const TOML_PATH = "/.well-known/xrp-ledger.toml"
const TIPS = '<p>Check if the file is actually hosted at the URL above, check your server\'s HTTPS settings and certificate, and make sure your server provides the required <a href="xrp-ledger-toml.html#cors-setup">CORS header.</a></p>'
const CLASS_GOOD = "badge badge-success"
const CLASS_BAD = "badge badge-danger"

const ACCOUNT_FIELDS = [
  "address",
  "network",
  "desc"
]
const VALIDATOR_FIELDS = [
  "public_key",
  "network",
  "owner_country",
  "server_country",
  "unl"
]
const PRINCIPAL_FIELDS = [
  "name",
  "email"
]
const SERVER_FIELDS = [
  "json_rpc",
  "ws",
  "peer",
  "network"
]
const CURRENCY_FIELDS = [
  "code",
  "display_decimals",
  "issuer",
  "network",
  "symbol"
]

function VerificationError(message, tips) {
  this.name = "VerificationError"
  this.message = message || ""
  this.tips = tips || ""
}
VerificationError.prototype = Error.prototype

function makeLogEntry(text, raw) {
  let log
  if (raw) {
    log = $('<li></li>').appendTo('#log').append(text)
  } else {
    log = $('<li></li>').text(text+" ").appendTo('#log')
  }
  log.resolve = function(text) {
    return $('<span></span>').html(text).appendTo(log)
  }
  return log
}

function fetch_file() {
  const domain = $('#domain').val()
  const url = "https://" + domain + TOML_PATH

  const log = makeLogEntry('Checking ' + url + '...')
  $.ajax({
    url: url,
    dataType: 'text',
    success: function(data) {
      log.resolve('FOUND').addClass(CLASS_GOOD)
      parse_xrpl_toml(data, domain)
    },
    error: function(jqxhr, status, error) {
      switch (status) {
        case 'timeout':
          err = 'TIMEOUT'
          break
        case 'abort':
          err = 'ABORTED'
          break
        case 'error':
          err = 'ERROR'
          break
        default:
          err = 'UNKNOWN'
      }
      log.resolve(err).addClass(CLASS_BAD).after(TIPS)
    }
  })
}

async function parse_xrpl_toml(data, domain) {
  let parsed
  let log1 = makeLogEntry("Parsing TOML data...")
  try {
    parsed = TOML(data)
    log1.resolve("SUCCESS").addClass(CLASS_GOOD)
  } catch(e) {
    log1.resolve(e).addClass(CLASS_BAD)
    return
  }

  console.log(parsed)

  if (parsed.hasOwnProperty("METADATA")) {
    const metadata_type = makeLogEntry("Metadata section: ")
    if (Array.isArray(parsed.METADATA)) {
      metadata_type.resolve("Wrong type - should be table").addClass(CLASS_BAD)
    } else {
      metadata_type.resolve("Found").addClass(CLASS_GOOD)

      if (parsed.METADATA.modified) {
        const mod_log = makeLogEntry("Modified date: ")
        try {
          mod_log.resolve(parsed.METADATA.modified.toISOString()).addClass(CLASS_GOOD)
        } catch(e) {
          mod_log.resolve("INVALID").addClass(CLASS_BAD)
        }
      }
    }
  }

  async function list_entries(name, list, fields, validate) {
    let list_wrap = $("<p>"+name+"</p>")
    let list_ol = $("<ol>").appendTo(list_wrap)
    for (i=0; i<list.length; i++) {
      let entry_wrap = $("<li>").appendTo(list_ol)
      let entry_def = $("<ul class='mb-3'>").appendTo(entry_wrap)
      let entry = list[i]
      for (j=0; j<fields.length; j++) {
        let fieldname = fields[j]
        if (entry[fieldname] !== undefined) {
          let field_def = $("<li><strong>"+fieldname+": </strong>").appendTo(entry_def)
          $(" <span class='"+fieldname+"'>").text(entry[fieldname]).appendTo(field_def)
        }
      }
      if (validate) {
        validate(entry).then((validated) => {
          if (validated === true) {
            entry_def.append('<li class="badge badge-success">Domain Validated <i class="fa fa-check-circle"></i></li>')
          }
        })
      }
    }
    makeLogEntry(list_wrap, true)
  }

  if (parsed.ACCOUNTS) {
    if (!Array.isArray(parsed.ACCOUNTS)) {
      makeLogEntry("Accounts:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
    } else {
      list_entries("Accounts:", parsed.ACCOUNTS, ACCOUNT_FIELDS, async function(acct) {
        if (acct.address === undefined) {return undefined}
        let net
        if (acct.network === undefined) { net = "main" } else { net = acct.network }
        return await validate_address_domain_on_net(acct.address, domain, net)
      })
    }
  }
  if (parsed.VALIDATORS) {
    if (!Array.isArray(parsed.VALIDATORS)) {
      makeLogEntry("Validators:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
    } else {
      list_entries("Validators:", parsed.VALIDATORS, VALIDATOR_FIELDS)
    }
  }
  if (parsed.PRINCIPALS) {
    if (!Array.isArray(parsed.PRINCIPALS)) {
      makeLogEntry("Principals:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
    } else {
      list_entries("Principals:", parsed.PRINCIPALS, PRINCIPAL_FIELDS)
    }
  }
  if (parsed.SERVERS) {
    if (!Array.isArray(parsed.SERVERS)) {
      makeLogEntry("Servers:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
    } else {
      list_entries("Servers:", parsed.SERVERS, SERVER_FIELDS)
    }
  }
  if (parsed.CURRENCIES) {
    if (!Array.isArray(parsed.CURRENCIES)) {
      makeLogEntry("Currencies:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
    } else {
      list_entries("Currencies:", parsed.CURRENCIES, CURRENCY_FIELDS)
    }
  }
}

// Decode a hexadecimal string into a regular string, assuming 8-bit characters.
// Not proper unicode decoding, but it'll work for domains which are supposed
// to be a subset of ASCII anyway.
function decode_hex(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return str
}

async function validate_address_domain_on_net(address, domain, net) {
  if (!domain) { return undefined } // Can't validate an empty domain value
  let api
  if (net === "main") {
    api = new xrpl.Client('wss://s1.ripple.com')
  } else if (net == "testnet") {
    api = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  }
  await api.connect()

  let ai
  try {
    ai = await api.request({
      "command": "account_info",
      "account": address
    })
  } catch(e) {
    console.warn(`failed to look up address ${address} on ${net} network"`, e)
    api.disconnect()
    return undefined
  }

  if (ai.result.account_data.Domain === undefined) {
    console.info(`Address ${address} has no Domain defined on-ledger`)
    api.disconnect()
    return undefined
  }

  let domain_decoded
  try {
    domain_decoded = decode_hex(ai.result.account_data.Domain)
  } catch(e) {
    console.warn("error decoding domain value", ai.result.account_data.Domain, e)
    api.disconnect()
    return undefined
  }

  if (domain_decoded === domain) {
    api.disconnect()
    return true
  } else if (domain_decoded === undefined) {
    console.debug(address, ": Domain is undefined in settings")
    api.disconnect()
    return undefined
  } else {
    console.debug(address, ": Domain mismatch ("+domain_decoded+" vs. "+domain+")")
    api.disconnect()
    return false
  }
}

function handle_submit(event) {
  event.preventDefault();

  $('.result-title').show()
  $('#result').show()
  $('#log').empty()

  fetch_file()
}

$(document).ready(() => {
  $('#domain-entry').submit(handle_submit)
})
