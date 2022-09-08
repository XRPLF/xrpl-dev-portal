# JavaScript key derivation examples

Generates key from a given input in Ed25519 and Secp256k1 format. On first run, you
have to install the necessary node.js dedpendencies:

    npm install

## Command-line usage:

### Password like seed    

    npm start "sEdSKaCy2JT7JaM7v95H9SxkhP9wS2r"

### Rippled RFC1751 Mnemonic

    npm start "KANT FISH GENE COST WEB JAKE CHUM HAD SOD MID KICK BOTH"

### Hex formatted seed

    npm start "0x21edc3dec3ef1873cf8f333381c5f360c3"

### Random seed

    npm start