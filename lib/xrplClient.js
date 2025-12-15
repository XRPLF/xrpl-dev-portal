import xrpl from "xrpl";

let client;

export async function getClient() {
  if (!client || !client.isConnected()) {
    client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
  }
  return client;
}
