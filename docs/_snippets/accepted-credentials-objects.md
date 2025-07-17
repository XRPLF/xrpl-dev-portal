Each member of the `AcceptedCredentials` array is an inner object named `Credential` with the following nested fields:

| Field            | JSON Type            | [Internal Type][] | Required? | Description  |
|:-----------------|:---------------------|:------------------|:----------|--------------|
| `Issuer`         | String - [Address][] | AccountID         | Yes       | The issuer of the credential. |
| `CredentialType` | String               | Blob              | Yes       | The type of credential, as hexadecimal. This is an arbitrary value from 1 to 64 bytes that the issuer sets when they issue a credential. |

{% admonition type="info" name="Note" %}
In the usual JSON format, inner objects are wrapped in an object with one field, whose name defines the inner object type. In this case, the wrapping field is named `Credential`. For example:

```json
"AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    },
    // ... additional Credential inner objects ...
]
```
{% /admonition %}
