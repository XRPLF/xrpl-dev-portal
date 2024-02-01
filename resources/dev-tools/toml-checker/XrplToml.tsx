export const TOML_PATH = "/.well-known/xrp-ledger.toml"

export interface AccountFields {
    address: string,
    network: string,
    desc: string
}
  
export interface ValidatorFields {
    public_key: string,
    network: string,
    owner_country: string,
    server_country: string,
    unl: string
}

export interface PrincipalFields {
    name: string,
    email: string,
}

export interface ServerFields {
    json_rpc: string,
    ws: string,
    peer: string,
    network: string,
}

export interface CurrencyFields {
    code: string,
    display_decimals: string,
    issuer: string,
    network: string,
    symbol: string
}

export interface MetadataField {
    // TODO: There could be other fields here, but this is all the existing code used
    modified: Date
}

export interface XrplToml {
    ACCOUNTS?: AccountFields[],
    VALIDATORS?: ValidatorFields[],
    PRINCIPALS?: PrincipalFields[],
    SERVERS?: ServerFields[],
    CURRENCIES?: CurrencyFields[],
    METADATA?: MetadataField
}
