import * as React from "react";
import { useState } from "react";
import { useTranslate } from "@portal/hooks";
import { decode } from "ripple-binary-codec";
import { encodeNodePublic } from "ripple-address-codec";
import { verify as keyCodecVerify } from "ripple-keypairs";
import { parse } from "smol-toml";
import { TextLookupForm } from "./components/TextLookupForm";
import { addNewLogEntry, LogEntry, LogEntryItem } from "./components/LogEntry"
import { hexToBytes, hexToString, stringToHex } from "@xrplf/isomorphic/utils"

const DomainVerificationPage = () => {
  const { translate } = useTranslate();
  const TOML_PATH = "/.well-known/xrp-ledger.toml";
  let query_param = 0;

  const parse_xrpl_toml = async (setLogEntries, data, public_key_hex, public_key, message) => {
    try {
      const parsed = parse(data);
      const validator_entries = parsed.VALIDATORS;

      if (validator_entries && Array.isArray(validator_entries)) {
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
    } catch (e) {
      addNewLogEntry(setLogEntries, {
        message: translate(`Error parsing TOML: ${e.message}`),
        id: "error-parsing-toml",
      });
    }
  };

  const parseAndVerifyManifest = async (setLogEntries, manifest) => {
    try {
      const decodedManifest = decode(manifest.toUpperCase());
      const publicKeyHex = decodedManifest.PublicKey as string;
      const publicKey = encodeNodePublic(hexToBytes(publicKeyHex));
      const domain = hexToString(decodedManifest.Domain as string);
      const message = `[domain-attestation-blob:${domain}:${publicKey}]`;
      const url = `https://${domain}${TOML_PATH}?v=${query_param++}`;

      fetch(url)
        .then((response) => response.text())
        .then((data) => parse_xrpl_toml(setLogEntries, data, publicKeyHex, publicKey, message))
        .catch((error) => {
          addNewLogEntry(setLogEntries, {
            message: translate(`Error fetching TOML: ${error.message}`),
            id: "error-fetching-toml",
          });
        });
    } catch (e) {
      addNewLogEntry(setLogEntries, {
        message: translate(`Error decoding manifest: ${e.message}`),
        id: "error-decoding-manifest",
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
