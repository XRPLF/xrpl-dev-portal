# Manage Permissioned Domains (Python)

These code samples show how to create, modify, and delete permissioned domains in Python using the xrpl-py client library.

Quick install & usage:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python create_domain.py
python modify_domain.py
python delete_domain.py
```

The `create_domain.py` script creates a `setup.json` file with the details of the domain owner account and the domain ID of the created permissioned domain. The other two scripts use the data from `setup.json` to (respectively) modify and delete the same permissioned domain.

For more detail, see the full tutorial for how to [Manage Permissioned Domains](https://xrpl.org/docs/tutorials/compliance-features/manage-permissioned-domains).
