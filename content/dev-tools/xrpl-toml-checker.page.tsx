import * as React from 'react';
import { useState } from 'react'
import { useTranslate } from '@portal/hooks';
import { clsx } from 'clsx'
import { type Client } from 'xrpl'

const TOML_PATH = "/.well-known/xrp-ledger.toml"
const TIPS = '<p>Check if the file is actually hosted at the URL above, check your server\'s HTTPS settings and certificate, and make sure your server provides the required <a href="xrp-ledger-toml.html#cors-setup">CORS header.</a></p>'
const TIPS_1 = '<p>Make sure you are entering a valid XRP Ledger address.</p>'
const TIPS_2 = '<p>Make sure the account has the Domain field set.</p>'
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

// TODO: Migrate this function :)
// function makeLogEntry(text: string, raw: boolean) {
//     let log
//     if (raw) {
//         log = $('<li></li>').appendTo('#log').append(text)
//     } else {
//         log = $('<li></li>').text(text+" ").appendTo('#log')
//     }
//     log.resolve = function(text) {
//         return $('<span></span>').html(text).appendTo(log) // This is the icon!
//     }
//     return log
// }
interface StatusResponse {
    iconLabel: string,
    iconType: "SUCCESS" | "ERROR"
    followUpContent?: JSX.Element
}

interface ResultBulletProps {
    message: string
    response?: StatusResponse
}

function ResultBullet({
    message, 
    response
}: ResultBulletProps) 
{
    const {translate} = useTranslate()
    let icon = undefined
    if(!!response) {
        icon = <span className={
            clsx(response.iconType === "SUCCESS" && CLASS_GOOD, 
            response.iconType === "ERROR" && CLASS_BAD)}>
                {response.iconLabel}
        </span>
    }

    return (
        <li>{translate(`${message} `)}{icon}{response.followUpContent}</li>
    )

}

function fetchWallet(
    domainAddress: string, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    socket?: WebSocket) 
{
    const {translate} = useTranslate()

    const [checkingDomain, setCheckingDomain] = useState<ResultBulletProps>({
        message: translate(`Checking domain of account`),
        response: undefined 
    })

    setAccountLogEntries([<li>{translate('Checking domain of account')}</li>])
    // const checkingLog = makeLogEntryWallet('Checking domain of account')
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
      try {
        data = JSON.parse(event.data)
        if (data.status === 'success') {
            if (data.result.account_data.Domain) {
              try {
                setAccountLogEntries((prev) => {
                    return prev + <ResultBullet/>
                })
                checkingLog.resolve('SUCCESS').addClass(CLASS_GOOD)
                decodeHexWallet(data.result.account_data.Domain)
              } catch(e) {
                console.log(e)
                checkingLog.resolve('ERROR').addClass(CLASS_BAD).after('<p>Error decoding domain field: ' + data.result.account_data.Domain + '</p>')
              }
            } else {
              checkingLog.resolve('ERROR').addClass(CLASS_BAD).after(TIPS_2)
            }
        } else {
          checkingLog.resolve('ERROR').addClass(CLASS_BAD).after(TIPS_1)
        }
      } catch {
        return false
      }
    })
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(data))
    })
  }

function handleSubmitWallet(
    event: React.FormEvent<HTMLFormElement>, 
    setAccountLogEntries: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    domainAddress: string) {

    event.preventDefault()
    setAccountLogEntries(undefined)  
    fetchWallet(domainAddress)
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
                    <div id="result">
                        <h5 className="result-title">{translate(`Result`)}</h5>
                        <ul id="log">
                            {domainLogEntries}
                        </ul>
                    </div>
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
