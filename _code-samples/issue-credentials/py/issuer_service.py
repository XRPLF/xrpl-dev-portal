from os import getenv
from getpass import getpass

from flask import Flask, jsonify, request

from xrpl.clients import JsonRpcClient
from xrpl.models.exceptions import XRPLModelException
from xrpl.models.requests import LedgerEntry
from xrpl.models.transactions import CredentialCreate, CredentialDelete
from xrpl.transaction import sign_and_submit
from xrpl.wallet import Wallet

from look_up_credentials import look_up_credentials, XRPLLookupError
from credential_model import Credential, CredentialRequest

# Set up XRPL connection ------------------------------------------------------
def init_wallet():
    seed = getenv("ISSUER_ACCOUNT_SEED")
    if not seed:
        seed = getpass(prompt='Issuer account seed: ',stream=None)
    if not seed:
        print("Please specify the issuer's master seed")
        exit(1)
    return Wallet.from_seed(seed=seed)

wallet = init_wallet()
print("Starting credential issuer with XRPL address", wallet.address)

client = JsonRpcClient("https://s.devnet.rippletest.net:51234/")

# Define Flask app ------------------------------------------------------------
app = Flask(__name__)

# Method for users to request a credential from the service -------------------
@app.route("/credential", methods=['POST'])
def request_credential():
    # CredentialRequest throws if the request is not validly formatted
    cred_request = CredentialRequest(request.json).to_xrpl()

    cc_response = sign_and_submit(CredentialCreate(
        account=wallet.address,
        subject=cred_request.subject,
        credential_type=cred_request.credential,
        uri=cred_request.uri,
        expiration=cred_request.expiration
    ), client=client, wallet=wallet, autofill=True)

    if cc_response.status != "success":
        raise XRPLTxError(cc_response)
    elif cc_response.result["engine_result"] == "tecDUPLICATE":
        raise XRPLTxError(cc_response, status_code=409)
    elif cc_response.result["engine_result"] != "tesSUCCESS":
        raise XRPLTxError(cc_response)

    response = jsonify(cc_response.result)
    response.status_code = 201
    return response

# Method for admins to look up all credentials issued -------------------------
@app.route("/admin/credential")
def get_credentials():
    # ?accepted=yes|no|both query parameter - the default is "both"
    filter_accepted = request.args.get("accepted", "both").lower()

    credentials = look_up_credentials(
            client,
            issuer=wallet.address, 
            accepted=filter_accepted
    )
    response = {
        "credentials": [Credential.from_xrpl(c).to_dict() for c in credentials]
    }
    return response

# Method for admins to revoke an issued credential ----------------------------
@app.route("/admin/credential", methods=['DELETE'])
def delete_credential():
    del_request = Credential(request.json)

    # To save on transaction fees, check if the Credential
    # exists on ledger before attempting to delete it.
    xrpl_response = client.request(LedgerEntry(credential={
        "subject": del_request.subject,
        "issuer": wallet.address,
        "credential_type": del_request.to_xrpl().credential
    }))
    if (xrpl_response.status != "success" and 
            xrpl_response.result["error"] == "entryNotFound"):
        response = jsonify({
            "error": "entryNotFound",
            "error_message": (f"Credential doesn't exist for subject "
                              f"'{del_request.subject} and credential type "
                              f"'{del_request.credential}'")
        })
        response.status_code = 404
        return response

    cd_response = sign_and_submit(CredentialDelete(
        account=wallet.address,
        subject=del_request.subject,
        credential_type=del_request.to_xrpl().credential
    ), client=client, wallet=wallet, autofill=True)

    if cd_response.status != "success":
        raise XRPLTxError(cd_response)

    if cd_response.result["engine_result"] == "tecNO_ENTRY":
        # Usually this won't happen since we just checked for the credential,
        # but it's possible it got deleted since then.
        raise XRPLTxError(cd_response, status_code=404)
    elif cd_response.result["engine_result"] != "tesSUCCESS":
        raise XRPLTxError(cd_response)

    response = jsonify(cd_response.result)
    response.status_code = 200
    return response

# Error handling --------------------------------------------------------------
class XRPLTxError(Exception):
    def __init__(self, xrpl_response, status_code=400):
        self.body = xrpl_response.result
        self.status_code = status_code

@app.errorhandler(XRPLTxError)
def handle_tx_error(e):
    response = jsonify(e.body)
    response.status_code = e.status_code
    return response

@app.errorhandler(XRPLLookupError)
def handle_xrpl_error(e):
    response = jsonify(e.body)
    response.status_code = 400
    return response

@app.errorhandler(ValueError)
def handle_value_error(e):
    response = jsonify({
        "error": "badRequest",
        "error_message": str(e)
    })
    response.status_code = 400
    return response

# Reuse the same handler for xrpl-py's model exceptions
app.register_error_handler(XRPLModelException, handle_value_error)

# Tip: Some of Flask's built-in errors return HTML, not JSON, by default. 
# If you want to configure those, you can import error cases like BadRequest 
# from werkzeug.exceptions and implement custom handlers.
