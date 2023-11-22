import * as React from "react";
import { useState } from "react";
import { useTranslate } from "@portal/hooks";
import codec from "ripple-binary-codec";
import addressCodec from "ripple-address-codec";
import keyCodec from "ripple-keypairs";
import TOML from "@iarna/toml";

const DomainVerificationPage = () => {
  const { translate } = useTranslate();
  const [manifest, setManifest] = useState("");
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLogEntry = (text, isSuccess = true) => {
    setLogEntries((entries) => [
      ...entries,
      { text: translate(text), isSuccess },
    ]);
  };

  const hexToAscii = (str1) => {
    var str = "";
    for (var n = 0; n < str1.length; n += 2) {
      str += String.fromCharCode(parseInt(str1.substr(n, 2), 16));
    }
    return str;
  };

  const verifyAttestation = (validatorEntries, publicKeyHex, message) => {
    let validatorFound = false;
    for (const entry of validatorEntries) {
      if (entry.public_key === publicKeyHex) {
        validatorFound = true;
        try {
          const attestation = entry.attestation;
          const verify = keyCodec.verify(message, attestation, publicKeyHex);
          return verify;
        } catch (error) {
          addLogEntry(`Domain Verification Failed: ${error}`, false);
          return false;
        }
      }
    }
    if (!validatorFound) {
      addLogEntry(
        "The validator key for this manifest was not found in the TOML file",
        false
      );
    }
    return false;
  };

  const verifyDomain = async (domain, publicKeyHex, message) => {
    const url = `https://${domain}/.well-known/xrp-ledger.toml`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("TOML data fetch failed");
      const tomlData = await response.text();
      const parsedData = TOML.parse(tomlData);

      if (parsedData.VALIDATORS) {
        const isValid = verifyAttestation(
          parsedData.VALIDATORS,
          publicKeyHex,
          message
        );
        if (isValid) {
          addLogEntry("Domain Verification Succeeded");
        } else {
          addLogEntry("Domain Verification Failed", false);
        }
      } else {
        addLogEntry("No Validators Found", false);
      }
    } catch (error) {
      addLogEntry(`Error: ${error.message}`, false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLogEntries([]);

    try {
      const decodedManifest = codec.decode(manifest.toUpperCase());
      const domain = hexToAscii(decodedManifest.Domain);
      const publicKeyHex = decodedManifest.PublicKey;
      const buffPub = Buffer.from(publicKeyHex, "hex");
      const publicKey = addressCodec.encodeNodePublic(buffPub);
      const message = `[domain-attestation-blob:${domain}:${publicKey}]`;
      await verifyDomain(domain, publicKeyHex, message);
    } catch (error) {
      addLogEntry(`Error decoding manifest: ${error}`, false);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>{translate("Domain Verification Checker")}</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={manifest}
          onChange={(e) => setManifest(e.target.value)}
          placeholder={translate("Enter Manifest")}
        />
        <button type="submit">{translate("Verify")}</button>
      </form>
      {loading && <p>{translate("Loading...")}</p>}
      <ul>
        {logEntries.map((entry, index) => (
          <li key={index} className={entry.isSuccess ? "success" : "error"}>
            {entry.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DomainVerificationPage;
