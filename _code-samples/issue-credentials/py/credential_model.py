import re
from datetime import datetime

from xrpl.core.addresscodec import is_valid_classic_address
from xrpl.utils import ripple_time_to_datetime, datetime_to_ripple_time, str_to_hex

from decode_hex import decode_hex

def is_allowed_credential_type(credential_type: str):
    """
    Returns True if the specified credential type is one that this service
    issues, or False otherwise.
    
    XRPL credential types can be any binary data; this service issues
    any credential that can be encoded from the following ASCII chars:
    alphanumeric characters, underscore, period, and dash.
    (min length 1, max 64)

    You might want to further limit the credential types, depending on your 
    use case; for example, you might only issue one specific credential type.
    """
    CREDENTIAL_REGEX = re.compile(r'^[A-Za-z0-9_\.\-]{1,64}$')
    if CREDENTIAL_REGEX.match(credential_type):
        return True
    return False


def is_allowed_uri(uri):
    """
    Returns True if the specified URI is acceptable for this service, or
    False otherwise.

    XRPL Credentials' URI values can be any binary data; this service
    adds any user-requested URI to a Credential as long as the URI
    can be encoded from the characters usually allowed in URIs, namely
    the following ASCII chars:

    alphanumeric characters (upper and lower case)
    the following symbols: -._~:/?#[]@!$&'()*+,;=%
    (minimum length 1 and max length 256 chars)

    You might want to instead define your own URI and attach it to the
    Credential regardless of user input, or you might want to verify that the
    URI points to a valid Verifiable Credential document that matches the user.
    """
    URI_REGEX = re.compile(r"^[A-Za-z0-9\-\._~:/\?#\[\]@!$&'\(\)\*\+,;=%]{1,256}$")
    if URI_REGEX.match(uri):
        return True
    return False


class Credential:
    """
    A credential object, in a simplified format for our API.
    The constructor performs parameter validation. Attributes:
    subject (str): the subject of the credential, as a classic address
    credential (str): the credential type, in human-readable (ASCII) chars
    uri (str, optional): URI of the credential in human-readable (ASCII) chars
    expiration (datetime, optional): time when the credential expires
                            (displayed as an ISO 8601 format string in JSON)
    accepted (bool, optional): true if this credential has been accepted
                               on the XRPL by the subject account.
                               False if not accepted. 
                               Omitted for credentials that haven't been 
                               issued yet.
    """
    def __init__(self, d: dict):
        self.subject = d.get("subject")
        if type(self.subject) != str:
            raise ValueError("Must provide a string 'subject' field")
        if not is_valid_classic_address(self.subject):
            raise ValueError(f"subject not valid address: '{self.subject}'")

        self.credential = d.get("credential")
        if type(self.credential) != str:
            raise ValueError("Must provide a string 'credential' field")

        if not is_allowed_credential_type(self.credential):
            raise ValueError(f"credential not allowed: '{self.credential}'.")

        self.uri = d.get("uri")
        if self.uri is not None and (
                type(self.uri) != str or not is_allowed_uri(self.uri)):
            raise ValueError(f"URI isn't valid: {self.uri}")

        exp = d.get("expiration")
        if exp:
            if type(exp) == str:
                self.expiration = datetime.fromisoformat(exp)
            elif type(exp) == datetime:
                self.expiration = exp
            else:
                raise ValueError(f"Unsupported expiration format: {type(exp)}")
        else:
            self.expiration = None
        
        self.accepted = d.get("accepted")
    
    @classmethod
    def from_xrpl(cls, xrpl_d: dict):
        """
        Instantiate from a Credential ledger entry in the XRPL format.
        """
        d = {
            "subject": xrpl_d["Subject"],
            "credential": decode_hex(xrpl_d["CredentialType"]),
            "accepted": bool(xrpl_d["Flags"] & 0x00010000) # lsfAccepted
        }
        if xrpl_d.get("URI"):
            d["uri"] = decode_hex(xrpl_d["URI"])
        if xrpl_d.get("Expiration"):
            d["expiration"] = ripple_time_to_datetime(xrpl_d["Expiration"])
        return cls(d)

    def to_dict(self):
        d = {
            "subject": self.subject,
            "credential": self.credential,
        }
        if self.expiration is not None:
            d["expiration"] = self.expiration.isoformat()
        if self.uri:
            d["uri"] = self.uri
        if self.accepted is not None:
            d["accepted"] = self.accepted
        return d
    
    def to_xrpl(self):
        """
        Return an object with parameters formatted for the XRPL
        """
        return XrplCredential(self)

class XrplCredential:
    """
    A Credential object, in a format closer to the XRP Ledger representation.
    Credential type and URI are hexadecimal;
    Expiration, if present, is in seconds since the Ripple Epoch.
    """
    def __init__(self, c:Credential):
        self.subject = c.subject
        self.credential = str_to_hex(c.credential)
        if c.expiration:
            self.expiration = datetime_to_ripple_time(c.expiration)
        else:
            self.expiration = None

        if c.uri:
            self.uri = str_to_hex(c.uri)
        else:
            self.uri = None

class CredentialRequest(Credential):
    """
    Request from user to issue a credential on ledger.
    The constructor performs parameter validation.
    """
    def __init__(self, cred_request):
        super().__init__(cred_request)

        self.documents = cred_request.get("documents")
        # This is where you would check the user's documents to see if you
        # should issue the requested Credential to them. This API only checks
        # that the documents field is present and does not evaluate to false.
        if not self.documents:
            raise ValueError(f"you must provide a non-empty 'documents' field")
