import { clsx } from 'clsx'
import { Client } from 'xrpl'
import React = require("react");
import { CLASS_GOOD } from "../components/LogEntry";
import { AccountFields } from "./XrplToml";

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
  const api = new Client(wsNetworkUrl)
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

  let decodedDomain
  try {
    decodedDomain = decodeHex(accountInfoResponse.result.account_data.Domain)
  } catch(e) {
    console.warn("error decoding domain value", accountInfoResponse.result.account_data.Domain, e)
    return undefined
  }

  if(decodedDomain) {
    const doesDomainMatch = decodedDomain === domain
    if(!doesDomainMatch) {
      console.debug(addressToVerify, ": Domain mismatch ("+decodedDomain+" vs. "+domain+")")
    }
    return doesDomainMatch
  } else {
    console.debug(addressToVerify, ": Domain is undefined in settings")
    return undefined
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
export async function getListEntries(fields: Object[], filter?: Function, domainToVerify?: string) {
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
      const promises = []
      if(domainToVerify) {
        const accountEntry = entry as AccountFields
        if(accountEntry.address) {
          const net = accountEntry.network ?? "main"
          const domainIsValid = validateAddressDomainOnNet(accountEntry.address, domainToVerify, net) 

          domainIsValid.then((wasValidated) => {
            if(wasValidated) {
              displayedFields.push(
                <li className={CLASS_GOOD} key={`${key}-result`}>DOMAIN VALIDATED <i className="fa fa-check-circle"/></li>
              )
            }
          })

          promises.push(domainIsValid)
        } 
      }

      await Promise.all(promises)
      
      formattedEntries.push((<li key={key}>
          <ul className={clsx(domainToVerify && 'mb-3')} key={key + "-ul"}>{displayedFields}</ul>
        </li>))
    }
  }
  return formattedEntries
}
