//Webpack was used to create domain-verifier-bundle.js so that we can use 'require' in the browser

const codec = require("ripple-binary-codec");
const addressCodec = require("ripple-address-codec");
const keyCodec = require("ripple-keypairs");

const TIPS =
  '<p>Check if the xrp-ledger.toml file is actually hosted in the /.well-known/ location at the domain in your manifest. Check your server\'s HTTPS settings and certificate, and make sure your server provides the required <a href="xrp-ledger-toml.html#cors-setup">CORS header.</a></p>';
const TOML_PATH = "/.well-known/xrp-ledger.toml";
const CLASS_GOOD = "badge badge-success";
const CLASS_BAD = "badge badge-danger";

var query_param = 0;

//This function makes the lists that output the status.
function makeLogEntry(text, raw) {
  let log;
  if (raw) {
    log = $("<li></li>")
      .appendTo("#log")
      .append(text);
  } else {
    log = $("<li></li>")
      .text(text + " ")
      .appendTo("#log");
  }
  log.resolve = function(text) {
    return $("<span></span>")
      .html(text)
      .appendTo(log);
  };
  return log;
}
//3.
//Find the validator entry in the TOML file and verify the signature of the attestation.
async function parse_xrpl_toml(data, public_key_hex, public_key, message) {
  let parsed;
  let log1 = makeLogEntry("Parsing TOML data...");
  try {
    parsed = TOML(data);
    log1.resolve("SUCCESS").addClass(CLASS_GOOD);
  } catch (e) {
    log1.resolve(e).addClass(CLASS_BAD);
    return;
  }

  console.log(parsed);

  let validator_entries = parsed.VALIDATORS;

  if (validator_entries) {
    if (!Array.isArray(validator_entries)) {
      makeLogEntry("Validators:")
        .resolve("Wrong type - should be table-array")
        .addClass(CLASS_BAD);
    } else {
      let validator_found = false;
      for (i = 0; i < validator_entries.length; i++) {
        let pk = validator_entries[i]["public_key"];

        if (pk == public_key) {
          validator_found = true;
          try {
            var attestation = validator_entries[i]["attestation"];
          } catch {
            makeLogEntry("Attestation Not found").addClass(CLASS_BAD);
          }

          try {
            var verify = keyCodec.verify(
              ascii_to_hexa(message),
              attestation,
              public_key_hex
            );
          } catch (e) {
            makeLogEntry("Domain Verification Failed")
              .resolve(e)
              .addClass(CLASS_BAD);
          }

          if (verify) {
            makeLogEntry("Domain Verification Succeeded").addClass(CLASS_GOOD);
          } else {
            makeLogEntry("Domain Verification Failed").addClass(CLASS_BAD);
          }
        }
      }
      if (!validator_found) {
        makeLogEntry(
          "The validator key for this manifest was not found in the TOML file"
        ).addClass(CLASS_BAD);
      }
    }
  } else {
    makeLogEntry("No Validators Found")
      .resolve("Failure")
      .addClass(CLASS_BAD);
  }
}


function display_manifest(man) {
  for (x in man){
    log = makeLogEntry(x + ": " +man[x]);
  }
}


//2.
//Decompose the manifest to obtain the domain and public key.
//Use these to create the message that should have been signed by the validator's private key (the attestation).
//Go to the domain and verify the signature of the attestation field in the appropriate validator entry.
function parse_manifest() {
  const manhex = $("#manifest").val().toUpperCase();;

  try {
    var man = codec.decode(manhex);
  } catch (e) {
    makeLogEntry("Error decoding manifest")
      .resolve(e)
      .addClass(CLASS_BAD);
    return;
  }

  let seq = man ["Sequence"];
  let public_key_hex = man["PublicKey"];
  let buff_pub = new Buffer(public_key_hex, "hex").toJSON().data;
  let public_key = addressCodec.encodeNodePublic(buff_pub);
  let ephemeral_public_key_hex = man["SigningPubKey"];
  let buff_eph_pub = new Buffer(ephemeral_public_key_hex, "hex").toJSON().data;
  let ephemeral_public_key = addressCodec.encodeNodePublic(buff_eph_pub);

  try {
    var domain = hex_to_ascii(man["Domain"]);
  } catch {
    makeLogEntry("Domain not found in manifest").addClass(CLASS_BAD);
    display_manifest({"Sequence":seq, 
                    "Master Public Key": public_key,
                    "Ephemeral Public Key":ephemeral_public_key});
    return;
  }

  display_manifest({"Sequence":seq, 
                    "Domain":domain,
                    "Master Public Key": public_key,
                    "Ephemeral Public Key":ephemeral_public_key})

  //This is the message that was signed by the validator's private key.
  let message = "[domain-attestation-blob:" + domain + ":" + public_key + "]";
  const url = "https://" + domain + TOML_PATH + "?v=" + query_param++;
  const log = makeLogEntry("Checking " + url + "...");

  $.ajax({
    url: url,
    dataType: "text",
    success: function(data) {
      log.resolve("FOUND").addClass(CLASS_GOOD);
      parse_xrpl_toml(data, public_key_hex, public_key, message);
    },
    error: function(jqxhr, status, error) {
      switch (status) {
        case "timeout":
          err = "TIMEOUT";
          break;
        case "abort":
          err = "ABORTED";
          break;
        case "error":
          err = "ERROR";
          break;
        default:
          err = "UNKNOWN";
      }
      log
        .resolve(err)
        .addClass(CLASS_BAD)
        .after(TIPS);
    }
  });
}

// Nifty hex/ascii helpers:
//https://www.w3resource.com/javascript-exercises/javascript-string-exercise-28.php
function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

//https://www.w3resource.com/javascript-exercises/javascript-string-exercise-27.php
function ascii_to_hexa(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}

function handle_submit(event) {
  event.preventDefault();

  $(".result-title").show();
  $("#result").show();
  $("#log").empty();

  parse_manifest();
}

//1.
//Start the verification process when the user enters a manifest.
$(document).ready(() => {
  $("#manifest-entry").submit(handle_submit);
});

