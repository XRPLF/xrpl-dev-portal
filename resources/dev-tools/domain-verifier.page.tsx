import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { decode } from "ripple-binary-codec";
import addressCodec, { encodeNodePublic } from "ripple-address-codec";
import { verify as keyCodecVerify } from "ripple-keypairs";
import { parse } from "smol-toml";
import { TextLookupForm } from "./components/TextLookupForm";
import { addNewLogEntry, LogEntryItem, updateLogEntry } from './components/LogEntry'
import { hexToBytes, hexToString, stringToHex } from "@xrplf/isomorphic/utils"

export const frontmatter = {
  seo: {
    title: 'Domain Verifier',
    description: "Use this tool to confirm that your rippled validator has domain verification set up correctly",
  }
};

const TIPS =
  <p>Check if the xrp-ledger.toml file is actually hosted in the /.well-known/ location at the domain in your manifest. Check your server\'s HTTPS settings and certificate, and make sure your server provides the required <a href="xrp-ledger-toml.html#cors-setup">CORS header.</a></p>;

const DomainVerificationPage = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const TOML_PATH = "/.well-known/xrp-ledger.toml";
  let query_param = 0;

  const parse_xrpl_toml = async (setLogEntries, data, public_key_hex, public_key, message) => {
    const parsingTomlBase = {
      message: translate('Parsing TOML data...'),
      id: 'parsing-toml'
    }

    let parsed;
    try {
      addNewLogEntry(setLogEntries, parsingTomlBase);
      parsed = parse(data);
      updateLogEntry(setLogEntries, {
        ...parsingTomlBase,
        status: {
          icon: {
            label: translate('Success'),
            type: 'SUCCESS'
          }
        }
      });
    } catch(e) {
      updateLogEntry(setLogEntries, {
        ...parsingTomlBase,
        status: {
          icon: {
            label: e.message,
            type: 'SUCCESS'
          }
        }
      });
    }

    const validator_entries = parsed.VALIDATORS;

    if (validator_entries) {
      if (!Array.isArray(validator_entries)) {
        addNewLogEntry(setLogEntries, {
          id: 'validators',
          message: translate('Validators'),
          status: {
            icon: {
              label: translate('Wrong type - should be table-array'),
              type: 'SUCCESS'
            }
          }
        })
        return;
      }

      let validator_found = false;
      for (let i = 0; i < validator_entries.length; i++) {
        const pk = validator_entries[i]["public_key"];
        if (pk === public_key) {
          validator_found = true;
          const attestation = validator_entries[i]["attestation"];
          const verify = keyCodecVerify(
            stringToHex(message),
            attestation,
            public_key_hex
          );

          if (verify) {
            addNewLogEntry(setLogEntries, {
              message: translate("Domain Verification Succeeded"),
              id: "domain-verification-success",
            });
          } else {
            addNewLogEntry(setLogEntries, {
              message: translate("Domain Verification Failed"),
              id: "domain-verification-fail",
            });
          }
          break;
        }
      }

      if (!validator_found) {
        addNewLogEntry(setLogEntries, {
          message: translate(
            "The validator key for this manifest was not found in the TOML file"
          ),
          id: "validator-key-not-found",
        });
      }
    } else {
      addNewLogEntry(setLogEntries, {
        message: translate("No Validators Found"),
        id: "no-validators",
      });
    }
  };

  function displayManifest(setLogEntries, manifest) {
    for(const key in manifest) {
      addNewLogEntry(setLogEntries,{
        message: `${key}: ${manifest[key]}`,
        id: `manifest-${key}`
      })
    }
  }

  const parseAndVerifyManifest = async (setLogEntries, manifest) => {
    let decodedManifest: any

    try {
      decodedManifest = decode(manifest.toUpperCase());
    } catch(e) {
      addNewLogEntry(setLogEntries, {
        message: translate(`Error decoding manifest:`),
        id: "error-decoding-manifest",
        status: {
          icon: {
            label: e.message,
            type: 'ERROR'
          }
        }
      });
      return
    }

    const publicKeyHex = decodedManifest.PublicKey as string;
    const publicKey = encodeNodePublic(hexToBytes(publicKeyHex));
    const seq = decodedManifest['Sequence']
    const ephemeralPublicKeyHex = decodedManifest["SigningPubKey"];
    const ephemeralPublicKey = addressCodec.encodeNodePublic(hexToBytes(ephemeralPublicKeyHex));

    let domain: string;
    try {
      domain = hexToString(decodedManifest.Domain as string);
    } catch {
      addNewLogEntry(setLogEntries, {
        message: translate(`Domain not found in manifest`),
        id: "no-domain",
      });

      displayManifest(setLogEntries, {
        "Sequence": seq,
        "Master Public Key": publicKey,
        "Ephemeral Public Key": ephemeralPublicKey
      });
      return
    }

    displayManifest(setLogEntries, {"Sequence":seq,
      "Domain":domain,
      "Master Public Key": publicKey,
      "Ephemeral Public Key":ephemeralPublicKey})

    const message = `[domain-attestation-blob:${domain}:${publicKey}]`;
    const url = `https://${domain}${TOML_PATH}?v=${query_param++}`;
    const baseCheckingToml = {
      id: 'checking-toml',
      message: `${translate('resources.dev-tools.domain-verifier.checking.part1','Checking ')}${url}${translate('resources.dev-tools.domain-verifier.checking.part2','Checking')}}`
    }
    addNewLogEntry(setLogEntries, baseCheckingToml)

    try {
      await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          updateLogEntry(setLogEntries, {
            ...baseCheckingToml,
            status: {
              icon: {
                label: translate('Found'),
                type: 'SUCCESS'
              }
            }
          })
          parse_xrpl_toml(setLogEntries, data, publicKeyHex, publicKey, message)
        })
        .catch((error) => {
          updateLogEntry(setLogEntries, {
            ...baseCheckingToml,
            status: {
              icon: {
                label: error.message,
                type: 'ERROR'
              }
            }
          })
        });
    } catch (e) {
      addNewLogEntry(setLogEntries, {
        message: translate(`Error decoding manifest:`),
        id: "error-decoding-manifest",
        status: {
          followUpMessage: TIPS,
          icon: {
            label: e.message,
            type: 'ERROR',
          },
        }
      });
    }
  };

  const handleSubmit = (
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    event: React.FormEvent<HTMLFormElement>,
    fieldValue: string
  ) => {
    event.preventDefault();
    setLogEntries([]);
    parseAndVerifyManifest(setLogEntries, fieldValue);
  };

  const formProps = {
    title: translate("Domain Verification Checker"),
    description: (
      <div>
        <p>
          {translate(
            "This tool allows you to verify that domain verification is properly configured."
          )}
        </p>
        <p>
          {translate(
            "Enter the manifest found in your validator-keys.json file. Do not confuse this with your validator's secret key."
          )}
        </p>
        <p>
          {translate(
            "To do this with the validator-keys-tool use the following command:"
          )}
        </p>
        <pre>
          <code>$ validator-keys show_manifest hex</code>
        </pre>
      </div>
    ),
    buttonDescription: translate("Verify"),
    formPlaceholder: translate("Your Manifest Here"),
    handleSubmit,
  };

  return <TextLookupForm {...formProps} />;
};

export default DomainVerificationPage;
