# Domain verification of XRP Ledger accounts using xrp-ledger.toml file.
# For information on this process, see:
#   https://xrpl.org/xrp-ledger-toml.html#account-verification
# License: MIT. https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

import requests
import toml
import xrpl

def verify_account_domain(account):
    """
    Verify an account using an xrp-ledger.toml file.

    Params:
        account:dict - the AccountRoot object to verify
    Returns (domain:str, verified:bool)
    """
    domain_hex = account.get("Domain")
    if not domain_hex:
        return "", False
    verified = False
    domain = xrpl.utils.hex_to_str(domain_hex)
    toml_url = f"https://{domain}/.well-known/xrp-ledger.toml"
    toml_response = requests.get(toml_url)
    if toml_response.ok:
        parsed_toml = toml.loads(toml_response.text)
        toml_accounts = parsed_toml.get("ACCOUNTS", [])
        for t_a in toml_accounts:
            if t_a.get("address") == account.get("Account"):
                verified = True
                break
    return domain, verified


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    parser.add_argument("address", type=str,
            help="Classic address to check domain verification of")
    args = parser.parse_args()
    client = xrpl.clients.JsonRpcClient("https://xrplcluster.com")
    r = xrpl.account.get_account_info(args.address, client,
            ledger_index="validated")
    print(verify_account_domain(r.result["account_data"]))
