# Issue MPT with Metadata (JavaScript)

Creates a sample MPT issuance with metadata encoded as JSON according to the [XLS-89 standard](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema).

Quick setup and usage:

```sh
npm i
node issue-mpt-with-metadata.js
```

The script should output a validated transaction and end with a line such as the following:

```text
MPToken created successfully with issuance ID 005073C721E14A7613BAAF5E0B1A253459832FF8D0D81278.
```
