from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountObjects, AccountObjectType

lsfAccepted = 0x00010000

class XRPLLookupError(Exception):
    def __init__(self, xrpl_response):
        self.body = xrpl_response.result

def look_up_credentials(client:JsonRpcClient, 
                        issuer:str="", 
                        subject:str="", 
                        accepted:str="both"):
    """
    Looks up Credentials issued by/to a specified XRPL account, optionally
    filtering by accepted status. Handles pagination.
    """
    account = issuer or subject # Use whichever is specified, issuer if both
    if not account:
        raise ValueError("Must specify issuer or subject")
    
    accepted = accepted.lower()
    if accepted not in ("true","false","both"):
        raise ValueError("accepted must be str 'true', 'false', or 'both'")

    credentials = []
    has_more_pages = True
    marker = None
    while has_more_pages:
        xrpl_response = client.request(AccountObjects(
            account=account,
            type=AccountObjectType.CREDENTIAL,
            marker=marker
        ))
        if xrpl_response.status != "success":
            raise XRPLLookupError(xrpl_response)

        for obj in xrpl_response.result["account_objects"]:
            # Skip credentials that aren't issued to/by the requested address.
            if issuer and obj["Issuer"] != issuer:
                continue
            if subject and obj["Subject"] != subject:
                continue
            # Skip credentials that don't match the specified accepted status
            cred_accepted = obj["Flags"] & lsfAccepted
            
            if accepted == "yes" and not cred_accepted:
                continue
            if accepted == "no" and cred_accepted:
                continue
            credentials.append(obj)
        
        marker = xrpl_response.result.get("marker")
        if not marker:
            has_more_pages = False
    
    return credentials
