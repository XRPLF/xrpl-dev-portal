import { getClient } from "../../lib/xrplClient";

export default async function handler(req, res) {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }

  try {
    const client = await getClient();

    const response = await client.request({
      command: "account_nfts",
      account: address
    });

    const nfts = response.result.account_nfts || [];
    // Decode URI from hex to string
    const decoded = nfts.map(n => {
      const uriHex = n.URI || "";
      const uri = Buffer.from(uriHex, "hex").toString("utf8");
      return { ...n, decodedURI: uri };
    });

    res.status(200).json({ nfts: decoded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
}
