import json
import os

# ---------- CONFIGURE THIS PART ----------

PROJECT_NAME = "Souldier Coin Tuskegee"
BASE_EXTERNAL_URL = "https://salutetosouldiers.blockchain/coins"
BASE_METADATA_URL = "https://metadata.salutetosouldiers.blockchain"
CHAIN_ORIGIN = "XRPL-Testnet"

REALMS = [
    {
        "realm": "Aurora",
        "tier": "Founders",
        "element": "Light",
        "folder": "metadata/aurora",
        "start_id": 1,
        "count": 10
    },
    {
        "realm": "Prime",
        "tier": "Elite",
        "element": "Precision",
        "folder": "metadata/prime",
        "start_id": 1,
        "count": 10
    },
    {
        "realm": "Shadow",
        "tier": "Vanguard",
        "element": "Shadow",
        "folder": "metadata/shadow",
        "start_id": 1,
        "count": 10
    }
]

# ---------- DO NOT TOUCH BELOW UNLESS YOU KNOW WHAT YOU'RE DOING ----------

def pad(num, width=4):
    return str(num).zfill(width)

def main():
    for r in REALMS:
        os.makedirs(r["folder"], exist_ok=True)
        for i in range(r["start_id"], r["start_id"] + r["count"]):
            edition = pad(i)
            global_id = f"SCT-{r['realm'].upper()}-{edition}"

            data = {
                "name": f"{PROJECT_NAME} #{edition} — {r['realm']} Realm",
                "description": f"{r['realm']} Realm Souldier Coin from the {PROJECT_NAME} collection.",
                "image": f"{BASE_METADATA_URL}/{r['realm'].lower()}/{edition}/image.webp",
                "animation_url": f"{BASE_METADATA_URL}/{r['realm'].lower()}/{edition}/animation.mp4",
                "external_url": f"{BASE_EXTERNAL_URL}/{r['realm'].lower()}/{edition}",
                "attributes": [
                    { "trait_type": "Project", "value": PROJECT_NAME },
                    { "trait_type": "Realm", "value": r["realm"] },
                    { "trait_type": "Tier", "value": r["tier"] },
                    { "trait_type": "Edition", "value": edition },
                    { "trait_type": "Element", "value": r["element"] }
                ],
                "global_coin_id": global_id,
                "realm": r["realm"],
                "chain_origin": CHAIN_ORIGIN,
                "project": PROJECT_NAME
            }

            file_path = os.path.join(r["folder"], f"{edition}.json")
            with open(file_path, "w") as f:
                json.dump(data, f, indent=2)

            print(f"Written {file_path}")

if __name__ == "__main__":
    main()
