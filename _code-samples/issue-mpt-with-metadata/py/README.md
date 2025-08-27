# Issue MPT with Metadata (Python)

Creates a sample MPT issuance with metadata encoded as JSON according to the [XLS-89 standard](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema).

Quick setup and usage:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python issue-mpt-with-metadata.py
```

The script should output a validated transaction and end with a line such as the following:

```text
MPToken created successfully with issuance ID 0050773D6B8DF8C6BEA497016C8679728A217DE1C4D50AC5.
```
