var commandlist = $("#command_list");
var request_body = $("#request_body");
var request_button = $("#request_button");
var response_body = $("#response_body");
var response_code = $("#rest_responsecode");
var rest_url = $('#rest_url');
var rest_method = $("#rest_method");
var selected_command = $("#selected_command");
var spinner = $(".loader");
var reminders = $("#rest_url_wrapper .rest_reminders");
var test_warning = $("#test_warning");

var GET = "GET";
var POST = "POST";
var PUT = "PUT";
var DELETE = "DELETE";


function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

//Build requests
var requests = { };
var requestlist = [];
function Request(name, obj) {
    if (obj === undefined) {
        requestlist.push({slug: null,name: name});//separator
        return null;
    }

    obj.name = name;
    obj.slug = slugify(name);
    requests[obj.slug] = obj;
    requestlist.push(obj);

    return obj;
};

function generate_table_of_contents() {
    $.each(requestlist, function(i, req) {
        if (req.slug === null) {
            commandlist.append("<li class='separator'>"+req.name+"</li>");
        } else {
            commandlist.append("<li><a href='#"+req.slug+"'>"+req.name+"</a></li>");
        }
    });
}

function make_commands_clickable() {
    commandlist.children("li").click(function() {
        var cmd = slugify($(this).text().trim());

        if (!requests[cmd]) return;

        select_request(cmd, true);
        window.location.hash = cmd;

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });
}

var cm_request = CodeMirror(request_body.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false
});

var cm_response = CodeMirror(response_body.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false,
    readOnly: true
});

function update_method(el) {
    if (el === undefined) {
        method = $(this).val();
    } else {
        method = $(el).val();
    }

    if (method == GET) {
        request_body.hide();
    } else {
        request_body.show();
        cm_request.refresh();
    }
}

function change_path(command) {
    rest_url.empty();
    reminders.html("&nbsp;");

    var re = /(\{:[^}]+\})/g; // match stuff like {:address}
    params = command.path.split(re);

    //console.log(params);
    for (i=0; i<params.length; i++) {
        if (params[i].match(/\{:[^}]+\}/) !== null) {
            if (command.params === undefined || command.params[params[i]] === undefined) {
                var default_val = params[i];
            } else {
                var default_val = command.params[params[i]];
            }
            //rest_url.append("<span class='editable' contenteditable='true' id='resturl_"+params[i]+"'>"+default_val+"</span>");

            var new_div = $("<div>").appendTo(rest_url);
            var new_param = $("<input type='text' id='resturl_"+params[i]+"' value='"+default_val+"' class='editable' title='"+params[i]+"' />").appendTo(new_div);
            new_param.autosizeInput({"space": 0});
            //var new_label = $("<label class='reminder' for='resturl_"+params[i]+"'>"+params[i]+"</label>").appendTo(new_div);


        } else {
            rest_url.append("<span class='non_editable'>"+params[i]+"</span>");
        }
    }
}

function select_request(request) {
    if (request === undefined) {
        var el = commandlist.children("li:not(.separator)").eq(0);
        request = slugify(el.text());

/*        var keys  = Object.keys(requests);
        var index = keys.indexOf(cmd);
        if (index === -1) return;*/
    } else {
        var el = commandlist.find("li a[href='#"+request+"']").parent();
    }
    $(el).siblings().removeClass('selected');
    $(el).addClass('selected');

    command = requests[request];

    if (command.test_only === true) {
        test_warning.show();
    } else {
        test_warning.hide();
    }

    if (command.description) {
        $(description).html(command.description);

        if (command.link) {
            $(description).append(" <a class='button btn btn-outline-secondary' href='" + 
                DOC_BASE+command.link+"'>Read more</a>");
        }

        $(description).show();
    } else if (command.link) {
        $(description).html("<a class='link_underline' href='" + DOC_BASE+
                command.link+"'>Read more</a>");
    } else {
        $(description).hide();
    }

    selected_command.html($('<a>')
                    .attr('href', DOC_BASE+command.link)
                    .text(command.name));

    change_path(command);

    request_button.val(command.method);
    request_button.text(command.method+" request");
    update_method(request_button);

    if (command.hasOwnProperty("body")) {
        cm_request.setValue(JSON.stringify(command.body, null, 2));
    } else {
        //No body, so wipe out the current contents.
        cm_request.setValue("");
    }
    cm_request.refresh();

    reset_response_area();
};

function get_path() {
    s = "";
    rest_url.find(".non_editable, .editable").each(function() {
        if (this.tagName == "INPUT") {
            s += $(this).val();
        } else {
            s += $(this).text();
        }
    });
    return s;
}

function send_request() {
    //var method = rest_method.val();
    var method = request_button.val();
    if (method != GET && method != POST && method != PUT && method != DELETE) {
        console.log("ERROR: unrecognized http method");
        return;
    }
    //var path = rest_url.val();
    var path = get_path();

    $(this).addClass('depressed');
    response_body.addClass('obscured');

    var original_cmd = requests[slugify(selected_command.text())];

    if (original_cmd.hasOwnProperty("body")) {
        var body   = cm_request.getValue();
        $.ajax({
            type: method,
            url: URL_BASE + path,
            data: body,
            contentType: 'application/json',
            processData: false
        }).done(success_output).fail(error_output).always(reset_sending_status);
    } else {
        $.ajax({
            type: method,
            url: URL_BASE + path
        }).done(success_output).fail(error_output).always(reset_sending_status);
    }

    spinner.show();
}

function error_output(xhr,status,statusText) {
    response_code.text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(xhr.responseText);
}

function success_output(body,status,xhr) {
    response_code.text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(JSON.stringify(body, null, 2));
}

function reset_sending_status() {
    response_body.removeClass('obscured');
    request_button.removeClass('depressed');
    spinner.hide();
}

function reset_response_area() {
    cm_response.setValue("");
    response_code.text("");
}

function change_base_url(u) {
    window.URL_BASE = u;
    $("#rest_host").text(u);
}

$(document).ready(function() {
    //wait for the Requests to be populated by another file
    generate_table_of_contents();
    make_commands_clickable();

    if (window.location.hash) {
      var cmd   = window.location.hash.slice(1).toLowerCase();
      select_request(cmd);
    } else {
      select_request();
    }

    if (urlParams["base_url"]) {
        change_base_url(urlParams["base_url"]);
    }

    request_button.click(send_request);

});

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
