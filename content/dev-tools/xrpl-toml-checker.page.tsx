import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { clsx } from 'clsx'
import axios, { type AxiosError } from 'axios'
import { type Client } from 'xrpl'
import { parse } from 'smol-toml'
import { type AccountFields, type XrplToml, type MetadataField, TOML_PATH } from './toml-checker/XrplToml';
import { addNewLogEntry, CLASS_GOOD, type LogEntryProps, type LogEntryStatus, updateLogEntry } from './toml-checker/LogEntry';
import { TextLookupForm, type TextLookupFormProps } from './toml-checker/TextLookupForm';
/**
 * Example data to test the tool with
 * 
 * Domains:
 * - Valid: validator.xrpl-labs.com
 * - Not valid: sologenic.com
 * 
 * Addresses:
 * - Valid: rSTAYKxF2K77ZLZ8GoAwTqPGaphAqMyXV
 * - No toml: rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz
 * - No domain: rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
 */

// TODO: Split this into separate files (especially the types)
// TODO: Separate functions into step-by-step flow + helpers

/**
 * Log a list of fields from a toml file or display a relevant error message. 
 * Will return true if successfully displays at least one field from fields without erroring.
 * 
 * @param setLogEntries A setter to update the logs with the new fields.
 * @param headerText The initial message to include as a header for the list.
 * @param fields A set of fields to parse and display. May be undefined, but if so, 
 *               this function will simply return false. Simplifies typing.
 * @param additionalCheck A function to verify something about fields before displaying the list of fields. Must return true / false.
 * @param filterDisplayedFieldsTo Limits the displayed fields to ones which match the predicate.
 * @returns True if displayed any fields (after applying any given filters)
 */
async function validateAndDisplayFields(
  setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>, 
  headerText: string, 
  fields?: Object[],
  domainToVerify?: string,
  filterDisplayedFieldsTo?: Function): Promise<boolean> {

  const { translate } = useTranslate()
  
  // If there's no data, do nothing
  if(!fields) {
    return false
  }

  // Otherwise display all relevant data in the toml file for these field
  if(Array.isArray(fields)) {
    let icon = undefined;
    const formattedEntries = await getListEntries(fields, filterDisplayedFieldsTo, domainToVerify)
    if(formattedEntries.length > 0) {
      addNewLogEntry(setLogEntries, 
        {
          message: headerText,
          id: headerText,
          status: {
            followUpMessage: (
              <ol>
                {formattedEntries}
              </ol>
            ),
            icon: icon
          }
        }
      )
      return true
    } else {
      return false
    }
  } else {
    // Invalid toml data
    addNewLogEntry(setLogEntries, {
      message: headerText,
      id: headerText,
      status: {
        icon: {
          label: translate("WRONG TYPE - SHOULD BE TABLE-ARRAY"),
          type: "ERROR",
        }
      }
    })

    return false

  }
}

// Decode a hexadecimal string into a regular string, assuming 8-bit characters.
// Not proper unicode decoding, but it'll work for domains which are supposed
// to be a subset of ASCII anyway.
function decodeHex(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

function getWsUrlForNetwork(net: string) {
  let wsNetworkUrl: string
  if (net === "main") {
    wsNetworkUrl = 'wss://s1.ripple.com:51233'
  } else if (net == "testnet") {
    wsNetworkUrl = 'wss://s.altnet.rippletest.net:51233'
  } else if (net === "devnet") {
    wsNetworkUrl = 'wss://s.devnet.rippletest.net:51233/'
  } else if (net === "xahau") {
    wsNetworkUrl = 'wss://xahau-test.net:51233'
  } else {
    wsNetworkUrl = undefined
  }
  return wsNetworkUrl
}

async function validateAddressDomainOnNet(addressToVerify: string, domain: string, net: string) {
  if (!domain) { return undefined } // Can't validate an empty domain value
  
  const wsNetworkUrl = getWsUrlForNetwork(net)
  if(!wsNetworkUrl) {
    console.error(`The XRPL TOML Checker does not currently support verifying addresses on ${net}. 
      Please open an issue to add support for this network.`)
    return undefined
  }
  // @ts-expect-error -- xrpl is imported as a script once the page loads
  const api: Client = new xrpl.Client(wsNetworkUrl)
  await api.connect()

  let accountInfoResponse
  try {
    accountInfoResponse = await api.request({
      "command": "account_info",
      "account": addressToVerify
    })
  } catch(e) {
    console.warn(`failed to look up address ${addressToVerify} on ${net} network"`, e)
    return undefined
  } finally {
    await api.disconnect()
  }

  if (accountInfoResponse.result.account_data.Domain === undefined) {
    console.info(`Address ${addressToVerify} has no Domain defined on-ledger`)
    return undefined
  }

  let domain_decoded
  try {
    domain_decoded = decodeHex(accountInfoResponse.result.account_data.Domain)
  } catch(e) {
    console.warn("error decoding domain value", accountInfoResponse.result.account_data.Domain, e)
    return undefined
  }

  if(domain_decoded) {
    const doesDomainMatch = domain_decoded === domain
    if(!doesDomainMatch) {
      console.debug(addressToVerify, ": Domain mismatch ("+domain_decoded+" vs. "+domain+")")
    }
    return doesDomainMatch
  } else {
    console.debug(addressToVerify, ": Domain is undefined in settings")
    return undefined
  }
}

function validateAndDisplayMetadata(
  setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>, 
  metadata?: MetadataField) {

  const { translate } = useTranslate()

  if (metadata) {
    const metadataId = 'metadata-log'
    const metadataLogEntry = {
        message: translate("Metadata section: "),
        id: metadataId
    }
    addNewLogEntry(setLogEntries, metadataLogEntry)
    
    // Uniquely checks if array, instead of if not array
    if (Array.isArray(metadata)) {
      updateLogEntry(setLogEntries, {...metadataLogEntry, status: {
          icon: {
            label: translate("WRONG TYPE - SHOULD BE TABLE"),
            type: "ERROR",
          },
      }})
    } else {
      updateLogEntry(setLogEntries, {...metadataLogEntry, status: {
          icon: {
            label: translate("FOUND"),
            type: "SUCCESS",
          },
      }})  

      if (metadata.modified) {
        const modifiedLogId = 'modified-date-log'
        const modifiedLogEntry = {
          message: translate("Modified date: "),
          id: modifiedLogId
        }
        addNewLogEntry(setLogEntries, modifiedLogEntry)
        try {
          updateLogEntry(setLogEntries, { ...modifiedLogEntry, status: {
              icon: {
                label: metadata.modified.toISOString(),
                type: "SUCCESS",
              },
          }})
        } catch(e) {
          updateLogEntry(setLogEntries, { ...modifiedLogEntry, status: {
              icon: { 
                label: translate("INVALID"),
                type: "ERROR",
              },
          }})
        }
      }
    }
  }
}

/**
 * Read in a toml file and verify it has the proper fields, then display those fields in the logs.
 * 
 * @param setLogEntries A setter to update the logs.
 * @param tomlData Toml data to parse.
 * @param addressToVerify The address we're actively looking to verify matches with this toml file.
 * @param domain A website to look up further information about the toml file.
 * @returns Nothing.
 */
async function parseXRPLToml(
  setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  tomlData,
  addressToVerify?: string,
  domain?: string) {
  const { translate } = useTranslate()

  const parsingTomlLogEntry: LogEntryProps = {
      message: translate("Parsing TOML data..."),
      id: 'parsing-toml-data-log',
  }
  addNewLogEntry(setLogEntries, parsingTomlLogEntry)
  
  let parsed: XrplToml
  try {
    parsed = parse(tomlData)
    updateLogEntry(setLogEntries, {...parsingTomlLogEntry, status: {
      icon: {
        label: translate("SUCCESS"),
        type: "SUCCESS",
      },
    }})
  } catch(e) {
      updateLogEntry(setLogEntries, {...parsingTomlLogEntry, status: {
          icon: {
            label: e,
            type: "ERROR",
          },
      }})
      return
  }

  validateAndDisplayMetadata(setLogEntries, parsed.METADATA)

  const accountHeader = translate("Accounts:")
  if(addressToVerify) {
    const filterToSpecificAccount = (entry: AccountFields) => entry.address === addressToVerify
    const accountFound = await validateAndDisplayFields(
      setLogEntries, 
      accountHeader, 
      parsed.ACCOUNTS, 
      undefined, 
      filterToSpecificAccount)
 
    const statusLogId = 'account-found-status-log'
    if(accountFound) {
      // Then share whether the domain / account pair as a whole has been validated
      addNewLogEntry(setLogEntries, {
        message: translate('Account has been found in TOML file and validated.'),
        id: statusLogId,
        status: {
          icon: {
            label: translate("DOMAIN VALIDATED"),
            type: "SUCCESS",
            check: true,
          }
        }
      })
    } else {
      // validateAndDisplayFields does not display an entry for parsing `Account:` in the toml file if it fails to 
      // find any matching entries for addressToVerify, so we need to display that error first.
      addNewLogEntry(setLogEntries, {
        message: translate("Account:"),
        id: 'toml-account-entry-log',
        status: {
          icon: {
            label: translate("NOT FOUND"),
            type: "ERROR"
          }
        }
      })

      addNewLogEntry(setLogEntries, {
        message: translate("Account not found in TOML file. Domain can not be verified."),
        id: statusLogId,
        status: {
          icon: {
            label: translate("VALIDATION FAILED"),
            type: "ERROR",
          }
        }
      })
    }
  } else { 
    await validateAndDisplayFields(setLogEntries, translate(accountHeader), parsed.ACCOUNTS, domain)
    await validateAndDisplayFields(setLogEntries, translate("Validators:"), parsed.VALIDATORS)
    await validateAndDisplayFields(setLogEntries, translate("Principals:"), parsed.PRINCIPALS)
    await validateAndDisplayFields(setLogEntries, translate("Servers:"), parsed.SERVERS)
    await validateAndDisplayFields(setLogEntries, translate("Currencies:"), parsed.CURRENCIES)
  }
}

/**
 * A formatted list item displaying content from a single field of a toml file.
 * 
 * @param props Field info to display
 * @returns A formatted list item
 */
function FieldListItem(props: { fieldName: string, fieldValue: string}) {
  return (
  <li key={props.fieldName}>
    <strong>{props.fieldName}: </strong>
    <span className={`fieldName`}>
      {props.fieldValue}
    </span>
  </li>)
}

/**
 * Get an array of HTML lists that can be used to display toml data. 
 * If no data exists or none matches the filter it will return an empty array instead.
 * 
 * @param fields An array of objects to parse into bullet points
 * @param filter Optional function to filter displayed fields to only ones which return true.
 */
async function getListEntries(fields: Object[], filter?: Function, domainToVerify?: string) {
  // TODO: Clean this up - this logic is an absolute mess to read
  const formattedEntries: JSX.Element[] = []
  for(let i = 0; i < fields.length; i++) {
    const entry = fields[i]
    if(!filter || filter(entry)) {
      const fieldNames = Object.keys(entry)
      const displayedFields: JSX.Element[] = []
      fieldNames.forEach((fieldName) => {
        if(entry[fieldName] && Array.isArray(entry[fieldName])) {
          const internalList = []
          entry[fieldName].forEach((value) => {
            internalList.push(
              <FieldListItem key={value} fieldName={fieldName} fieldValue={value}/>
            )
          })
          displayedFields.push(<ol key={`ol-${displayedFields.length}`}>{internalList}</ol>)
        } else {
          displayedFields.push(
            <FieldListItem key={fieldName} fieldName={fieldName} fieldValue={entry[fieldName]}/>
          )
        }
      })

      const key = `entry-${formattedEntries.length}`
      if(domainToVerify) {
        const accountEntry = entry as AccountFields
        if(accountEntry.address) {
          const net = accountEntry.network ?? "main"
          const domainIsValid = await validateAddressDomainOnNet(accountEntry.address, domainToVerify, net) 
          if(domainIsValid) {
            displayedFields.push(
              <li className={CLASS_GOOD} key={`${key}-result`}>DOMAIN VALIDATED <i className="fa fa-check-circle"/></li>
            )
          }
        } 
      }
      formattedEntries.push((<li key={key}>
          <ul className={clsx(domainToVerify && 'mb-3')} key={key + "-ul"}>{displayedFields}</ul>
        </li>))
    }
  }
  return formattedEntries
}

function getHttpErrorCode(status?: number) {
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
  return errCode
}

async function fetchFile(
    setLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    domain: string,
    accountToVerify?: string,
) {
    const { translate } = useTranslate()

    const url = "https://" + domain + TOML_PATH
    const checkUrlId = `check-url-log`
    const logEntry = {
        message: translate(`Checking ${url} ...`),
        id: checkUrlId,
    }
    addNewLogEntry(setLogEntries, logEntry)

    try {
        const response = await axios.get(url)
        const data: string = response.data
        updateLogEntry(setLogEntries, {...logEntry, status: {
            icon: {
              label: translate("FOUND"),
              type: "SUCCESS",
            },
        }})
        
        // Continue to the next step of verification
        parseXRPLToml(setLogEntries, data, accountToVerify, domain)

    } catch (e) {
        const errorUpdate: LogEntryProps = {...logEntry, status: {
          icon: {
            label: translate(getHttpErrorCode((e as AxiosError)?.status)),
            type: "ERROR",
          },
          followUpMessage: (<p>
            {translate("Check if the file is actually hosted at the URL above, ")
            + translate("check your server's HTTPS settings and certificate, and make sure your server provides the required ")}
            <a href="xrp-ledger-toml.html#cors-setup">{translate("CORS header.")}</a>
          </p>)
        }}
        updateLogEntry(setLogEntries, errorUpdate)
    }
  }


function displayDecodedWalletLog(
  setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
) {
  const { translate } = useTranslate()
  const logId = 'decoding-domain-hex'
  addNewLogEntry(setAccountLogEntries, { 
    message: translate('Decoding domain hex'), 
    id: logId, 
    status: {
      icon: {
        label: translate('SUCCESS'),
        type: 'SUCCESS',
      },
  }})
}

function decodeHexWallet(hex: string) {
    let decodedDomain = '';
    for (let i = 0; i < hex.length; i += 2) {
        decodedDomain += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
    }
    return decodedDomain
}

function fetchWallet(
    accountToVerify: string, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    socket?: WebSocket) 
{
    const {translate} = useTranslate()

    // Reset the logs
    setAccountLogEntries([])

    const walletLogEntry = { 
      message: translate(`Checking domain of account`), 
      id: 'check-domain-account', 
    }
    addNewLogEntry(setAccountLogEntries, walletLogEntry)

    const url = "wss://xrplcluster.com"
    if (typeof socket !== "undefined" && socket.readyState < 2) {
      socket.close()
    }

    const data = {
      "command": "account_info",
      "account": accountToVerify,
    }
    socket = new WebSocket(url)
    socket.addEventListener('message', (event) => {
      let data;
      // Defaults to error to simplify logic later on
      let response: LogEntryStatus = {
        icon: { 
          label: translate(`ERROR`),
          type: `ERROR`,
        },
      };
      try {
        data = JSON.parse(event.data)
        if (data.status === 'success') {
          if (data.result.account_data.Domain) {
            try {
              response = {
                  icon: {
                    label: translate('SUCCESS'),
                    type: 'SUCCESS',
                  },
              }
              // Continue to the next step of validation
              const decodedDomain = decodeHexWallet(data.result.account_data.Domain)
              displayDecodedWalletLog(setAccountLogEntries)
              fetchFile(setAccountLogEntries, decodedDomain, accountToVerify)
            } catch(e) {
              console.log(e)
              response.followUpMessage = <p>{translate(`Error decoding domain field: ${data.result.account_data.Domain}`)}</p>
            }
          } else {
            response.followUpMessage = <p>{translate("Make sure the account has the Domain field set.")}</p>
          }
        } else {
            response.followUpMessage = <p>{translate("Make sure you are entering a valid XRP Ledger address.")}</p>
        }
        updateLogEntry(setAccountLogEntries, { ...walletLogEntry, status: response })
      } catch {
        socket.close()
        return false
      }
    })
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(data))
    })
  }

// TODO: Standardize the param order for things like setAccountLogEntries / domainAddress
function handleSubmitWallet(
    event: React.FormEvent<HTMLFormElement>, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    addressToVerify: string) {

    event.preventDefault()
    setAccountLogEntries(undefined)  
    fetchWallet(addressToVerify, setAccountLogEntries)
}

function handleSubmitDomain(
  event: React.FormEvent<HTMLFormElement>, 
  setDomainLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  domainAddress: string) {

  event.preventDefault();
  setDomainLogEntries(undefined)  
  fetchFile(setDomainLogEntries, domainAddress)
}

export default function TomlChecker() {
  const { translate } = useTranslate();

  const domainButtonProps: TextLookupFormProps = {
    title: `Look Up By Domain`,
    description: <p>{translate(`This tool allows you to verify that your `)}<code>{translate(`xrp-ledger.toml`)}</code>
    {translate(` file is syntactically correct and deployed properly.`)}</p>,
    buttonDescription: `Check toml file`,
    formPlaceholder: "example.com (Domain name to check)",
    handleSubmit: handleSubmitDomain,
  }

  const addressButtonProps: TextLookupFormProps = {
    title: `Look Up By Account`,
    description: <p>{translate(`Enter an XRP Ledger address to see if that account is claimed by the domain it says owns it.`)}</p>,
    buttonDescription: `Check account`,
    formPlaceholder: `r... (${translate("Wallet Address to check")})`,
    handleSubmit: handleSubmitWallet
  }

  return (
    <div className="toml-checker row">
        {/* This aside is empty but it keeps the formatting similar to other pages */}
        <aside className="right-sidebar col-lg-3 order-lg-4" role="complementary"/>
        
        <main className="main col-md-7 col-lg-6 order-md-3  " role="main" id="main_content_body">
            <section className="container-fluid">
                <div className="p-3">
                    <h1>{translate(`xrp-ledger.toml Checker`)}</h1>
                    <p>{translate(`If you run an XRP Ledger validator or use the XRP Ledger for your business,
                    you can provide information about your usage of the XRP Ledger to the world in a machine-readable `)}
                    <a href="https://xrpl.org/xrp-ledger-toml.html"><code>{translate(`xrp-ledger.toml`)}</code>{translate(` file`)}</a>.</p>
                </div>

                <TextLookupForm {...domainButtonProps} />
                <TextLookupForm {...addressButtonProps} />
            </section>
        </main>
    </div>
  )
}
