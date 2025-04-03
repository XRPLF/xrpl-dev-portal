const lsfAccepted = 0x00010000;

async function lookUpCredentials(client, issuer, subject, accepted = "both") {
  const account = issuer || subject;
  if (!account) {
    throw new Error("Must specify issuer or subject");
  }

  accepted = accepted.toLowerCase();
  if (!["yes", "no", "both"].includes(accepted)) {
    throw new Error("accepted must be 'yes', 'no', or 'both'");
  }

  const credentials = [];
  let marker = undefined;

  do {
    const xrplResponse = await client.request({
      command: "account_objects",
      account,
      type: "credential",
      marker,
    });

    console.log(xrplResponse);
    if (xrplResponse.status !== "success") {
      const err = new Error("XRPL account_objects lookup failed");
      err.xrpl_response = xrplResponse.result;
      throw err;
    }

    for (const obj of xrplResponse.result.account_objects) {
      // Skip credentials that aren't issued to/by the requested address
      if (issuer && obj.Issuer !== issuer) continue;
      if (subject && obj.Subject !== subject) continue;

      // Skip credentials that don't match the specified accepted status
      const credAccepted = Boolean(obj.Flags & lsfAccepted);
      if (accepted === "yes" && !credAccepted) continue;
      if (accepted === "no" && credAccepted) continue;

      credentials.push(obj);
    }

    marker = xrplResponse.result.marker;
  } while (marker);

  return credentials;
}

module.exports = { lookUpCredentials };
