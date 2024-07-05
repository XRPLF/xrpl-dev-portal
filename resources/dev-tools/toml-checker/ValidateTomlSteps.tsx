import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import axios, { AxiosError } from "axios";
import { parse } from "smol-toml";
import { getListEntries } from "./ListTomlFields";
import { addNewLogEntry, updateLogEntry, LogEntryItem, LogEntryStatus } from "../components/LogEntry";
import { MetadataField, XrplToml, AccountFields, TOML_PATH } from "./XrplToml";

/**
 * Helper to log a list of fields from a toml file or display a relevant error message.
 * Will return true if successfully displays at least one field from fields without erroring.
 *
 * @param setLogEntries A setter to update the logs with the new fields.
 * @param headerText The initial message to include as a header for the list.
 * @param fields A set of fields to parse and display. May be undefined, but if so,
 *               this function will simply return false. Simplifies typing.
 * @param domainToVerify The domain to check
 * @param filterDisplayedFieldsTo Limits the displayed fields to ones which match the predicate.
 * @returns True if displayed any fields (after applying any given filters)
 */
async function validateAndDisplayFields(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    headerText: string,
    fields?: Object[],
    domainToVerify?: string,
    filterDisplayedFieldsTo?: Function): Promise<boolean> {

    const { useTranslate } = useThemeHooks();
    const { translate } = useTranslate();

    // If there's no data, do nothing
    if(!fields) {
      return false
    }

    // Otherwise display all relevant data in the toml file for these field
    if(Array.isArray(fields)) {
        let icon = undefined;
        const formattedEntries = await getListEntries(fields, filterDisplayedFieldsTo, domainToVerify)
        const relevantTomlFieldsExist = formattedEntries.length > 0
        if(relevantTomlFieldsExist) {
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
            })
        }
        return relevantTomlFieldsExist
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

/**
 * Check whether a metadata field on a toml file is valid, then display logs with the results.
 *
 * @param setLogEntries - A setter to update the logs
 * @param metadata - Metadata from a toml file being verified
 */
function validateAndDisplayMetadata(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
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
 * This is the 3rd step for verifying a wallet, and the 2nd step for verifying a toml file itself.
 *
 * @param setLogEntries A setter to update the logs.
 * @param tomlData Toml data to parse.
 * @param addressToVerify The address we're actively looking to verify matches with this toml file.
 * @param domain A website to look up further information about the toml file.
 * @returns Nothing.
 */
async function parseXRPLToml(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    tomlData,
    addressToVerify?: string,
    domain?: string) {
    const { translate } = useTranslate()

    const parsingTomlLogEntry: LogEntryItem = {
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
        // We failed to find any entries which match the account we're looking for
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
        // The final validation message is displayed under the validated account since in this case we're
        // verifying a wallet address, not the toml file itself.
        await validateAndDisplayFields(setLogEntries, translate(accountHeader), parsed.ACCOUNTS, domain)

        // We then display the rest of the toml as additional information
        await validateAndDisplayFields(setLogEntries, translate("Validators:"), parsed.VALIDATORS)
        await validateAndDisplayFields(setLogEntries, translate("Principals:"), parsed.PRINCIPALS)
        await validateAndDisplayFields(setLogEntries, translate("Servers:"), parsed.SERVERS)
        await validateAndDisplayFields(setLogEntries, translate("Currencies:"), parsed.CURRENCIES)
    }
}

/**
 * Convert HTML error odes to status messages to display.
 *
 * @param status - HTML Error code
 * @returns A human readable explanation for the HTML based on error code categories.
 */
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

/**
 * Extract and parse a toml file from a url derived via domain. If accountToVerify is
 * passed in, this specifically verifies that address is in the toml file.
 * For verifying a wallet, this is the 2nd step. For verifying a toml file itself, this is the 1st step.
 *
 * @param setLogEntries - A setter to update the log files.
 * @param domain = The main section of a url - ex. validator.xrpl-labs.com
 * @param accountToVerify - A wallet to optionally specifically check for.
 */
export async function fetchFile(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    domain: string,
    accountToVerify?: string) {

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
        const errorUpdate: LogEntryItem = {...logEntry, status: {
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

/**
 * Helper to display the result of trying to decode the domain decoding.
 *
 * @param setAccountLogEntries - A setter to update the displayed logs.
 */
function displayDecodedWalletLog(
    setAccountLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,) {

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
        }
    })
}

/**
 * Decode ascii hex into a string.
 *
 * @param hex - a hex string encoded in ascii.
 * @returns The decoded string
 */
function decodeHexWallet(hex: string): string {
    let decodedDomain = '';
    for (let i = 0; i < hex.length; i += 2) {
        decodedDomain += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
    }
    return decodedDomain
}

/**
 * The first step to verify an XRPL Wallet is verified with a toml file.
 * Looks up the domain associated with the given accountToVerify and the status on success or failure.
 *
 * @param accountToVerify
 * @param setAccountLogEntries
 * @param socket
 */
export function fetchWallet(
    setAccountLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    accountToVerify: string,
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
