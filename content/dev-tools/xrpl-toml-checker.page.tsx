import * as React from 'react';
import { useState } from 'react'
import { useTranslate } from '@portal/hooks';
import { clsx } from 'clsx'
// TODO: Double check if axios is the best option to use for basic html requests
import axios, { type AxiosError } from 'axios'
import TOML from '@ltd/j-toml'
//'content/static/vendor/iarna-toml-parse.js'

const TOML_PATH = "/.well-known/xrp-ledger.toml"
const TIPS = <p>Check if the file is actually hosted at the URL above, check your server's HTTPS settings and certificate, and make sure your server provides the required <a href="xrp-ledger-toml.html#cors-setup">CORS header.</a></p>
const TIPS_1 = <p>Make sure you are entering a valid XRP Ledger address.</p>
const TIPS_2 = <p>Make sure the account has the Domain field set.</p>
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

interface StatusResponse {
    icon?: {
      label: string,
      type: "SUCCESS" | "ERROR"
      check?: boolean
    }
    followUpContent?: JSX.Element
}

interface ResultBulletProps {
    message: string
    id: string // Used to look up & update when response is done
    response?: StatusResponse
}

function ResultBullet({
    message,
    id,
    response
}: ResultBulletProps) 
{
    const {translate} = useTranslate()
    let icon = undefined
    if(!!response) {
        icon = <span className={
            clsx(response.icon?.type === "SUCCESS" && CLASS_GOOD, 
            response.icon?.type === "ERROR" && CLASS_BAD)}>
                {response.icon?.label}
                {response.icon?.check && <i className="fa fa-check-circle"/>}
        </span>
    }

    return (
        <li id={id}>{translate(`${message} `)}{icon}{response?.followUpContent}</li>
    )
}

async function parseXRPLTomlWallet(
  setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  tomlData,
  addressToVerify: string) {
  const { translate } = useTranslate()

  const parsingTomlId = 'parsing-toml-data-log'
  const parsingTomlLogEntry: ResultBulletProps = {
      message: translate("Parsing TOML data..."),
      id: parsingTomlId,
  }
  addNewLogEntry(setLogEntries, parsingTomlLogEntry)
  let parsed
  try {
    parsed = TOML.parse(tomlData)
    updateLogEntry(setLogEntries, {...parsingTomlLogEntry, response: {
      icon: {
        label: "SUCCESS",
        type: "SUCCESS",
      },
    }})
  } catch(e) {
      updateLogEntry(setLogEntries, {...parsingTomlLogEntry, response: {
          icon: {
            label: e,
            type: "ERROR",
          },
      }})
      return
  }

  if (parsed?.METADATA) {
      const metadataId = 'metadata-log'
      const metadataLogEntry = {
          message: translate("Metadata section: "),
          id: metadataId
      }
      addNewLogEntry(setLogEntries, metadataLogEntry)
    if (Array.isArray(parsed.METADATA)) {
      updateLogEntry(setLogEntries, {...metadataLogEntry, response: {
          icon: {
            label: "Wrong type - should be table",
            type: "ERROR",
          },
      }})
    } else {
      updateLogEntry(setLogEntries, {...metadataLogEntry, response: {
          icon: {
            label: "Found",
            type: "SUCCESS",
          },
      }})  

      if (parsed.METADATA.modified) {
        const modifiedLogId = 'modified-date-log'
        const modifiedLogEntry = {
          message: translate("Modified date: "),
          id: modifiedLogId
        }
        addNewLogEntry(setLogEntries, modifiedLogEntry)
        try {
          updateLogEntry(setLogEntries, { ...modifiedLogEntry, response: {
              icon: {
                label: parsed.METADATA.modified.toISOString(),
                type: "SUCCESS",
              },
          }})
        } catch(e) {
          updateLogEntry(setLogEntries, { ...modifiedLogEntry, response: {
              icon: { 
                label: "INVALID",
                type: "ERROR",
              },
          }})
        }
      }
    }
  }

  // TODO: Potentially separate these functions here because top half is totally separate from down here?

  // Used to display the attributes from any matching accounts in the toml that are found
  const tomlAccountLogProps: ResultBulletProps = {
      message: translate("Account:"),
      id: 'toml-account-entry-log',
  }
  addNewLogEntry(setLogEntries, tomlAccountLogProps)

  if(parsed.ACCOUNTS) {
    if (!Array.isArray(parsed.ACCOUNTS)) {
      updateLogEntry(setLogEntries, {
        ...tomlAccountLogProps,
        response: {
          icon: {
            label: "Wrong type - should be table-array",
            type: "ERROR",
          }
        }
      })
    } else {
      const formattedEntries: JSX.Element[] = []
      parsed.ACCOUNTS.forEach((entry) => {
        // Display the toml file fields for any matching accounts
        if(entry.address === addressToVerify) {
          const fieldNames = Object.keys(entry)
          const displayedFields: JSX.Element[] = []
          fieldNames.forEach((fieldName) => {
            displayedFields.push(
            <li key={fieldName}>
              <strong>{fieldName}: </strong>
              <span className={`fieldName`}>
                {entry[fieldName]}
              </span>
            </li>)
          })
          formattedEntries.push((<ul key={`entry-${formattedEntries.length}`}>{displayedFields}</ul>))
        }
      })
      
      const statusLogId = 'account-found-status-log'
      const foundAddressInToml = formattedEntries.length > 0
      
      if(foundAddressInToml) {
        // Display the list of fields in the toml file that correspond to addressToVerify
        updateLogEntry(setLogEntries, {
          ...tomlAccountLogProps,
          response: {
            followUpContent: (
              <ol>
                {formattedEntries}
              </ol>
            )
          }
        })

        // Then share whether the domain / account pair as a whole has been validated
        addNewLogEntry(setLogEntries, {
          message: 'Account has been found in TOML file and validated.',
          id: statusLogId,
          response: {
            icon: {
              label: "DOMAIN VALIDATED",
              type: "SUCCESS",
              check: true,
            }
          }
        })            
      } else {
        // Share that the account couldn't be found in the toml file
        updateLogEntry(setLogEntries, {
          ...tomlAccountLogProps,
          response: {
            icon: {
              label: "NOT FOUND",
              type: "ERROR"
            }
          }
        })

        addNewLogEntry(setLogEntries, {
          message: "Account not found in TOML file. Domain can not be verified.",
          id: statusLogId,
          response: {
            icon: {
              label: "VALIDATION FAILED",
              type: "ERROR",
            }
          }
        })
      }
    }
  }
}

// TODO: Migrate this one next :)
// async function parseXRPLToml(
//     setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>, 
//     data, 
//     domain: string) {
//     let parsed
//     let logTOML = makeLogEntry("Parsing TOML data...")
//     try {
//       parsed = TOML(data)
//       logTOML.resolve("SUCCESS").addClass(CLASS_GOOD)
//     } catch(e) {
//       logTOML.resolve(e).addClass(CLASS_BAD)
//       return
//     }
  
//     if (parsed.hasOwnProperty("METADATA")) {
//       const metadata_type = makeLogEntry("Metadata section: ")
//       if (Array.isArray(parsed.METADATA)) {
//         metadata_type.resolve("Wrong type - should be table").addClass(CLASS_BAD)
//       } else {
//         metadata_type.resolve("Found").addClass(CLASS_GOOD)
  
//         if (parsed.METADATA.modified) {
//           const mod_log = makeLogEntry("Modified date: ")
//           try {
//             mod_log.resolve(parsed.METADATA.modified.toISOString()).addClass(CLASS_GOOD)
//           } catch(e) {
//             mod_log.resolve("INVALID").addClass(CLASS_BAD)
//           }
//         }
//       }
//     }
  
//     async function listEntries(name, list, fields, validate) {
//       let list_wrap = $("<p>"+name+"</p>")
//       let list_ol = $("<ol>").appendTo(list_wrap)
//       for (i=0; i<list.length; i++) {
//         let entry_wrap = $("<li>").appendTo(list_ol)
//         let entry_def = $("<ul class='mb-3'>").appendTo(entry_wrap)
//         let entry = list[i]
//         for (j=0; j<fields.length; j++) {
//           let fieldname = fields[j]
//           if (entry[fieldname] !== undefined) {
//             let field_def = $("<li><strong>"+fieldname+": </strong>").appendTo(entry_def)
//             $(" <span class='"+fieldname+"'>").text(entry[fieldname]).appendTo(field_def)
//           }
//         }
//         if (validate) {
//           validate(entry).then((validated) => {
//             if (validated === true) {
//               entry_def.append('<li class="badge badge-success">Domain Validated <i class="fa fa-check-circle"></i></li>')
//             }
//           })
//         }
//       }
//       makeLogEntry(list_wrap, true)
//     }
  
//     if (parsed.ACCOUNTS) {
//       if (!Array.isArray(parsed.ACCOUNTS)) {
//         makeLogEntry("Accounts:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
//       } else {
//         listEntries("Accounts:", parsed.ACCOUNTS, ACCOUNT_FIELDS, async function(acct) {
//           if (acct.address === undefined) {return undefined}
//           let net
//           if (acct.network === undefined) { net = "main" } else { net = acct.network }
//           return await validateAddressDomainOnNet(acct.address, domain, net)
//         })
//       }
//     }
//     if (parsed.VALIDATORS) {
//       if (!Array.isArray(parsed.VALIDATORS)) {
//         makeLogEntry("Validators:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
//       } else {
//         listEntries("Validators:", parsed.VALIDATORS, VALIDATOR_FIELDS)
//       }
//     }
//     if (parsed.PRINCIPALS) {
//       if (!Array.isArray(parsed.PRINCIPALS)) {
//         makeLogEntry("Principals:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
//       } else {
//         listEntries("Principals:", parsed.PRINCIPALS, PRINCIPAL_FIELDS)
//       }
//     }
//     if (parsed.SERVERS) {
//       if (!Array.isArray(parsed.SERVERS)) {
//         makeLogEntry("Servers:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
//       } else {
//         listEntries("Servers:", parsed.SERVERS, SERVER_FIELDS)
//       }
//     }
//     if (parsed.CURRENCIES) {
//       if (!Array.isArray(parsed.CURRENCIES)) {
//         makeLogEntry("Currencies:").resolve("Wrong type - should be table-array").addClass(CLASS_BAD)
//       } else {
//         listEntries("Currencies:", parsed.CURRENCIES, CURRENCY_FIELDS)
//       }
//     }
//   }

async function fetchFile(
    setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    domain: string,
    // verifyAccount: boolean // Otherwise we verify the validator settings TODO: Clean up 
    accountToVerify?: string
) {
    const { translate } = useTranslate()

    const url = "https://" + domain + TOML_PATH
    const checkUrlId = `check-url-log`
    const logEntry = {
        message: translate(`Checking ${url} ...`),
        id: checkUrlId,
    }
    addNewLogEntry(setLogEntries, logEntry)
    // TODO: For the straight to domain button, call this function (then delete this line, originally this is how that value was accessed)
    // const urlDomain = $('#domain').val()

    try {
        const response = await axios.get(url)
        const data: string = response.data
        console.log(data)
        updateLogEntry(setLogEntries, {...logEntry, response: {
            icon: {
              label: "FOUND",
              type: "SUCCESS",
            },
        }})
        
        if (accountToVerify){
            parseXRPLTomlWallet(setLogEntries, data, accountToVerify)
        } 
        // TODO: Next functions to migrate :) - May or may not also need the wallet address we're trying to verify
        //   else{
        //     parseXRPLToml(data, domain)
        //   }
    } catch (e) {
        const error = e as AxiosError
        console.log(error.status)
        console.error(error.response);
        const status = error?.status
        
        let errCode;
        if(status === 408) {
            errCode = 'TIMEOUT'
        } else if(status >= 400 && status < 500) {
            errCode = 'CLIENT ERROR'
        } else if (status >= 500 && status < 600) {
            errCode = 'SERVER ERROR'
        } else {
            errCode = 'UNKNOWN'
        }

        updateLogEntry(setLogEntries, {...logEntry, response: {
            icon: {
              label: errCode,
              type: "ERROR",
            },
            followUpContent: TIPS
        }})
    }
  }

function addNewLogEntry(
    setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>, 
    entry: ResultBulletProps)
{
    setLogEntries((prev) => {
        const updated: JSX.Element[] = [].concat(prev)
        const index = updated.length
        updated.push(<ResultBullet 
            message={entry.message}
            id={entry.id}
            key={`log-${index}`} response={entry.response}/>)
        return updated
    })
}

// Uses entry.id to find the existing entry to update
function updateLogEntry(
    setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>, 
    entry: ResultBulletProps) {
    setLogEntries((prev) => {
        const updated = [].concat(prev ?? [])
        const index = updated.findIndex((log) => {
            return log.props.id === entry.id
        })
        updated[index] = (<ResultBullet 
            message={entry.message} 
            id={entry.id}
            key={`log-${index}`} response={entry.response}/>)
        return updated
    })
}

// TODO: Rename, or separate the decoding from the "next step" function (This function is doing more than the name implies)
function decodeHexWallet(
  setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  hex: string, 
  accountToVerify: string) {
    let decodedDomain = '';
    for (let i = 0; i < hex.length; i += 2) {
        decodedDomain += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
    }
    const { translate } = useTranslate()
    const logId = 'decoding-domain-hex'
    addNewLogEntry(setAccountLogEntries, { message: translate('Decoding domain hex'), id: logId, response: {
        icon: {
          label: 'SUCCESS',
          type: 'SUCCESS',
        },
    }})

    fetchFile(setAccountLogEntries, decodedDomain, accountToVerify)
}

function fetchWallet(
    domainAddress: string, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    socket?: WebSocket) 
{
    const {translate} = useTranslate()
    
    // TODO: Replace this closing logic elsewhere 
    // (I'm not sure exactly how to store the state of 'socket' so it actually closes, or what readyState < 2 means)
    // if (typeof socket !== "undefined" && socket.readyState < 2) {
    //     socket.close()
    // }

    const baseResultBulletMessage = translate(`Checking domain of account`)

    // Reset the logs
    setAccountLogEntries([])

    const logId = 'check-domain-account'
    addNewLogEntry(setAccountLogEntries, { message: baseResultBulletMessage, id: logId, response: undefined })

    const url = "wss://xrplcluster.com"
    if (typeof socket !== "undefined" && socket.readyState < 2) {
      socket.close()
    }

    const data = {
      "command": "account_info",
      "account": domainAddress,
    }
    socket = new WebSocket(url)
    socket.addEventListener('message', (event) => {
      let data;
      let response: StatusResponse;
      try {
        data = JSON.parse(event.data)
        if (data.status === 'success') {
            if (data.result.account_data.Domain) {
              try {
                response = {
                    icon: {
                      label: 'SUCCESS',
                      type: 'SUCCESS',
                    },
                }
                decodeHexWallet(setAccountLogEntries, data.result.account_data.Domain, domainAddress)
              } catch(e) {
                console.log(e)
                response = {
                    icon: {
                      label: `ERROR`,
                      type: `ERROR`,
                    },
                    followUpContent: <p>Error decoding domain field: {data.result.account_data.Domain}</p>
                }
              }
            } else {
                response = {
                    icon: {
                      label: `ERROR`,
                      type: `ERROR`,
                    },
                    followUpContent: TIPS_2
                }            
            }
        } else {
            response = {
                icon: { 
                  label: `ERROR`,
                  type: `ERROR`,
                },
                followUpContent: TIPS_1
            }     
        }

        // Update with the success / error message + debug tip
        console.log(`Setting account log response to: ${JSON.stringify(response)}`)
        updateLogEntry(setAccountLogEntries, { message: baseResultBulletMessage, id: logId, response: response })
      } catch {
        // TODO: This is new to replace the socket.close() logic, so double check this makes sense
        socket.close()
        return false
      }
    })
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(data))
    })
  }

// TODO: Standardize the param order for things like setAccountLogEntries / domainAddress
// TODO: Find better names for these parameters.
function handleSubmitWallet(
    event: React.FormEvent<HTMLFormElement>, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    domainAddress: string) {

    event.preventDefault()
    setAccountLogEntries(undefined)  
    fetchWallet(domainAddress, setAccountLogEntries)
}

function handleSubmitDomain() {

}

export default function TomlChecker() {
  const { translate } = useTranslate();

  // Look up by domain variables
  const [domainLogEntries, setDomainLogEntries] = useState([])
  
  // Look up by account variables
  const [domainAddress, setDomainAddress] = useState("")
  const [accountLogEntries, setAccountLogEntries] = useState<JSX.Element[]>(undefined)

  return (
    <div className="toml-checker row">
        {/* Empty, but keeps the formatting similar to other pages */}
        <aside className="right-sidebar col-lg-3 order-lg-4" role="complementary"/>
        
        <main className="main col-md-7 col-lg-6 order-md-3  " role="main" id="main_content_body">
            <section className="container-fluid">
                <div className="p-3">
                    <h1>{translate(`xrp-ledger.toml Checker`)}</h1>
                    <p>{translate(`If you run an XRP Ledger validator or use the XRP Ledger for your business,
                    you can provide information about your usage of the XRP Ledger to the world in a machine-readable `)}
                    <a href="https://xrpl.org/xrp-ledger-toml.html"><code>{translate(`xrp-ledger.toml`)}</code>{translate(` file`)}</a>.</p>
                </div>

                {/* TODO: These buttons / look ups can be componentized potentially, there seems to be heavy overlap */}
                <div className="p-3 pb-5">
                    <form id="domain-entry" onSubmit={handleSubmitDomain}>
                        <h4>{translate(`Look Up By Domain`)}</h4>
                        <p>{translate(`This tool allows you to verify that your `)}<code>{translate(`xrp-ledger.toml`)}</code>
                            {translate(` file is syntactically correct and deployed properly.`)}</p>
                        <div className="input-group">
                            <input id="domain" type="text" className="form-control" required 
                                placeholder="example.com (Domain name to check)" 
                                pattern="^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z-]{0,22}[a-zA-Z]$" />
                            <br />
                            <button className="btn btn-primary form-control">{translate(`Check toml file`)}</button>
                        </div>{/*/.input-group*/}
                    </form>
                    {domainLogEntries && <div id="result">
                        <h5 className="result-title">{translate(`Result`)}</h5>
                            <ul id="log">
                                {domainLogEntries}
                            </ul>
                    </div>}
                </div>
                
                <div className="p-3 pt-5">
                    <h4>{translate(`Look Up By Account`)}</h4>
                    <p>{translate(`Enter an XRP Ledger address to see if that account is claimed by the domain it says owns it.`)}</p>
                    
                    <form id="domain-verification" onSubmit={
                        (event: React.FormEvent<HTMLFormElement>) => handleSubmitWallet(event, setAccountLogEntries, domainAddress)
                    }>
                        <div className="input-group">
                            {/* TODO Rename these id's since they're confusing with the above ids also being 'domain' based */}
                            <input id="verify-domain" type="text" className="form-control" required 
                                placeholder="r... (Wallet Address to check)" onChange={(event) => setDomainAddress(event.target.value)}/>
                            <br />
                            <button className="btn btn-primary form-control">{translate(`Check account`)}</button>
                        </div>{/*/.input-group*/}
                    </form>

                    {accountLogEntries && <div id="verify-domain-result">
                        <h5 id="verify-domain-result-title" className="result-title">{translate(`Result`)}</h5>
                        <ul id="verify-domain-log">
                            {accountLogEntries}
                        </ul>
                    </div>}
                </div>
            </section>

            {/* TOML tool */}
            <script type="application/javascript" src="{{currentpage.prefix}}static/vendor/iarna-toml-parse.js"></script>
        </main>
    </div>
  )
}
