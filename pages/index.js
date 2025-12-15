import { useState } from "react";

function computePrestigeScore(nfts) {
  let score = 0;
  for (const n of nfts) {
    const realm = n.metadata?.realm;
    if (realm === "Aurora") score += 100;
    if (realm === "Prime") score += 150;
    if (realm === "Shadow") score += 200;
    // bonus per coin
    score += 10;
  }
  return score;
}

export default function Home() {
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNfts = async () => {
    setLoading(true);
    const res = await fetch(`/api/nfts?address=${address}`);
    const data = await res.json();
    const enriched = await Promise.all(
      (data.nfts || []).map(async (n) => {
        try {
          const metaUrl = (n.decodedURI || "").startsWith("ipfs://")
            ? n.decodedURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            : n.decodedURI;
          const metaRes = await fetch(metaUrl);
          const meta = await metaRes.json();
          return { ...n, metadata: meta };
        } catch (e) {
          return { ...n, metadata: null };
        }
      })
    );
    setNfts(enriched);
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Souldier Coin Tuskegee — Dashboard (Testnet)</h1>

      <label>XRPL Testnet Address:</label>
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
      />
      <button onClick={fetchNfts} disabled={!address || loading}>
        {loading ? "Loading..." : "Load My Coins"}
      </button>

      {nfts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          {nfts.map((n, i) => (
            <div key={i} style={{ border: "1px solid #444", borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <h3>{n.metadata?.name || "Unnamed Coin"}</h3>
              {n.metadata?.image && (
                <img
                  src={n.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  alt={n.metadata.name}
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              )}
              <p>{n.metadata?.description}</p>
              <p><b>Realm:</b> {n.metadata?.realm}</p>
              <p><b>Global ID:</b> {n.metadata?.global_coin_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
