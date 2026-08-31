# Manage Permissioned Domains (JavaScript)

These code samples show how to create, modify, and delete permissioned domains in JavaScript using the xrpl.js client library.

Quick install & usage:

```sh
npm i
node create-domain.js
node modify-domain.js
node delete-domain.js
```

The `create-domain.js` script creates a `setup.json` file with the details of the domain owner account and the domain ID of the created permissioned domain. The other two scripts use the data from `setup.json` to (respectively) modify and delete the same permissioned domain.

For more detail, see the full tutorial for how to [Manage Permissioned Domains](https://xrpl.org/docs/tutorials/compliance-features/manage-permissioned-domains).
