import { ValueError } from "./errors.js";

const lsfAccepted = 0x00010000;

/**
 * Looks up Credentials issued by/to a specified XRPL account, optionally
 * filtering by accepted status. Handles pagination.
 */
export async function lookUpCredentials(client, issuer, subject, accepted = "both") {
  const account = issuer || subject;
  if (!account) {
    throw new ValueError("Must specify issuer or subject");
  }

  accepted = accepted.toLowerCase();
  if (!["yes", "no", "both"].includes(accepted)) {
    throw new ValueError("accepted must be 'yes', 'no', or 'both'");
  }

  const credentials = [];
  let request = {
    command: "account_objects",
    account,
    type: "credential",
  };

  // Fetch first page
  let response = await client.request(request);

  while (true) {
    for (const obj of response.result.account_objects) {
      if (issuer && obj.Issuer !== issuer) continue;
      if (subject && obj.Subject !== subject) continue;

      const credAccepted = Boolean(obj.Flags & lsfAccepted);
      if (accepted === "yes" && !credAccepted) continue;
      if (accepted === "no" && credAccepted) continue;

      credentials.push(obj);
    }

    if (!response.result.marker) break;

    /** 
     * If there is marker, request the next page using the convenience function "requestNextPage()".
     * See https://js.xrpl.org/classes/Client.html#requestnextpage to learn more.
     **/ 
    response = await client.requestNextPage(request, response.result);
  }

  return credentials;
}
