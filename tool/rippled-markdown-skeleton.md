## command ##
[[Source]<br>](githuburl "Source")

blurb

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
//actual example here
```

*Second tab*

```
//second example here
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|








#### Response Format ####

An example of a successful response:

<div class='multicode'>

*WebSocket*

```
//actual example here
```

*Second tab*

```
//second example here
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|





#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
