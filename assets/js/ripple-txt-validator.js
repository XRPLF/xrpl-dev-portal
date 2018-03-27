function VerificationError(message, tips) {
  this.name = "VerificationError";
  this.message = message || "";
  this.tips = tips || "";
}
VerificationError.prototype = Error.prototype;

function makeLogEntry(text) {
  var log = $('<li></li>').text(text).appendTo('#log');
  log.resolve = function(text) {
    return $('<span></span>').html(text).appendTo(log);
  };
  return log;
}

$('#domain-entry').submit(function(e) {
  e.preventDefault();

  var domain = $('#domain').val(),
    txtdata;

  $('.result-title').show();
  $('#result').show();
  $('#log').empty();

  async.waterfall([
    function(callback) {
      var urls = [
        //'http://www.'+domain+'/ripple.txt',
        'https://www.' + domain + '/ripple.txt',
        //'http://'+domain+'/ripple.txt',
        'https://' + domain + '/ripple.txt',
        'https://ripple.' + domain + '/ripple.txt'
      ].reverse();

      function next(xhr, status) {
        if (this instanceof $) {
          var err;
          switch (status) {
            case 'timeout':
              err = 'TIMEOUT';
              break;
            case 'abort':
              err = 'ABORTED';
              break;
            case 'error':
              err = 'ERROR';
              break;
            default:
              err = 'UNKNOWN';
          }
          $('<span></span>').text(err).addClass('red').appendTo(this);
        }
        if (!urls.length) {
          var tips = 'Check if the file is actually hosted at one of the URLs above and make sure your server provides the required <a href="https://ripple.com/wiki/Ripple.txt#Publishing_ripple.txt">CORS header.</a>';
          callback(new VerificationError('No ripple.txt found!', tips));
          return;
        }
        var url = urls.pop();
        var log = makeLogEntry('Checking ' + url + '...');
        $.ajax({
          url: url,
          dataType: 'text',
          success: function(data) {
            $('<span></span>').text('FOUND').addClass('green').appendTo(log);
            txtdata = data;
            callback();
          },
          error: $.proxy(next, log)
        });
      }
      next();
    },
    function() {
      txtdata = txtdata.replace('\r\n', '\n');
      txtdata = txtdata.replace('\r', '\n');
      txtdata = txtdata.split('\n');

      var currentSection = "",
        sections = {};
      for (var i = 0, l = txtdata.length; i < l; i++) {
        var line = txtdata[i].replace(/^\s+|\s+$/g, '');
        if (!line.length || line[0] === '#') {
          continue;
        } else if (line[0] === '[' && line[line.length - 1] === ']') {
          currentSection = line.slice(1, line.length - 1);
          sections[currentSection] = [];
        } else {
          line = line.replace(/^\s+|\s+$/g, '');
          if (sections[currentSection]) {
            sections[currentSection].push(line);
          }
        }
      }

      var log;

      log = makeLogEntry('Domain should match [domain]...');
      if (sections.domain && sections.domain.length && sections.domain[0] === domain) {
        log.resolve('VALID').addClass('green');
      } else if (sections.domain && sections.domain.length) {
        log.resolve('MISMATCH').addClass('red');
      } else {
        log.resolve('MISSING').addClass('red');
      }
    }
  ], function(err, result) {
    if (err instanceof VerificationError) {
      var log = makeLogEntry("");
      log.resolve(err.message).addClass('red');
      $('<br>').appendTo(log);
      $('<p></p>').html(err.tips).appendTo(log);
    } else if (err) {
      makeLogEntry(err).addClass('red');
    }
  });
});
