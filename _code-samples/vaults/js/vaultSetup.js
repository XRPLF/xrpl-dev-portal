import xrpl from 'xrpl'
import fs from 'fs'

// Setup script for vault tutorials

process.stdout.write('Setting up tutorial: 0/5\r')

const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create and fund all wallets
const [
  { wallet: mptIssuer },
  { wallet: domainOwner },
  { wallet: depositor },
  { wallet: vaultOwner }
] = await Promise.all([
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet()
])

// Step 1: Create MPT issuance, permissioned domain, and credentials in parallel
process.stdout.write('Setting up tutorial: 1/5\r')

const credType = 'VaultAccess'
const [mptCreateResult] = await Promise.all([
  client.submitAndWait(
    {
      TransactionType: "MPTokenIssuanceCreate",
      Account: mptIssuer.address,
      Flags:
        xrpl.MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
        xrpl.MPTokenIssuanceCreateFlags.tfMPTCanLock,
      AssetScale: 2,
      TransferFee: 0,
      MaximumAmount: "1000000000000",
      MPTokenMetadata: xrpl.encodeMPTokenMetadata({
        ticker: "USTST",
        name: "USTST Stablecoin",
        desc: "A test stablecoin token",
        icon: "example.org/ustst-icon.png",
        asset_class: "rwa",
        asset_subclass: "stablecoin",
        issuer_name: "Test Stablecoin Inc",
        uris: [
          {
            uri: "example.org/ustst",
            category: "website",
            title: "USTST Official Website",
          },
          {
            uri: "example.org/ustst/reserves",
            category: "attestation",
            title: "Reserve Attestation Reports",
          },
          {
            uri: "example.org/ustst/docs",
            category: "docs",
            title: "USTST Documentation",
          },
        ],
        additional_info: {
          backing: "USD",
          reserve_ratio: "1:1",
        },
      }),
    },
    { wallet: mptIssuer, autofill: true },
  ),
  client.submitAndWait(
    {
      TransactionType: "Batch",
      Account: domainOwner.address,
      Flags: xrpl.BatchFlags.tfAllOrNothing,
      RawTransactions: [
        {
          RawTransaction: {
            TransactionType: "PermissionedDomainSet",
            Account: domainOwner.address,
            AcceptedCredentials: [
              {
                Credential: {
                  Issuer: domainOwner.address,
                  CredentialType: xrpl.convertStringToHex(credType),
                },
              },
            ],
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn,
          },
        },
        {
          RawTransaction: {
            TransactionType: "CredentialCreate",
            Account: domainOwner.address,
            Subject: depositor.address,
            CredentialType: xrpl.convertStringToHex(credType),
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn,
          },
        },
      ],
    },
    { wallet: domainOwner, autofill: true },
  ),
]);

const mptIssuanceId = mptCreateResult.result.meta.mpt_issuance_id

// Get domain ID
const domainOwnerObjects = await client.request({
  command: 'account_objects',
  account: domainOwner.address,
  ledger_index: 'validated'
})
const domainId = domainOwnerObjects.result.account_objects.find(
  (node) => node.LedgerEntryType === 'PermissionedDomain'
).index

// Step 2: Depositor accepts credential, authorizes MPT, and creates vault in parallel
process.stdout.write('Setting up tutorial: 2/5\r')

const [, vaultCreateResult] = await Promise.all([
  client.submitAndWait(
    {
      TransactionType: 'Batch',
      Account: depositor.address,
      Flags: xrpl.BatchFlags.tfAllOrNothing,
      RawTransactions: [
        {
          RawTransaction: {
            TransactionType: 'CredentialAccept',
            Account: depositor.address,
            Issuer: domainOwner.address,
            CredentialType: xrpl.convertStringToHex(credType),
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn
          }
        },
        {
          RawTransaction: {
            TransactionType: 'MPTokenAuthorize',
            Account: depositor.address,
            MPTokenIssuanceID: mptIssuanceId,
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn
          }
        }
      ]
    },
    { wallet: depositor, autofill: true }
  ),
  client.submitAndWait(
    {
      TransactionType: 'VaultCreate',
      Account: vaultOwner.address,
      Asset: {
        mpt_issuance_id: mptIssuanceId
      },
      Flags: xrpl.VaultCreateFlags.tfVaultPrivate,
      DomainID: domainId,
      Data: xrpl.convertStringToHex(
        JSON.stringify({ n: "LATAM Fund II", w: "examplefund.com" })
      ),
      MPTokenMetadata: xrpl.encodeMPTokenMetadata({
        ticker: 'SHARE1',
        name: 'Vault Shares',
        desc: 'Proportional ownership shares of the vault',
        icon: 'example.com/vault-shares-icon.png',
        asset_class: 'defi',
        issuer_name: 'Vault Owner',
        uris: [
          {
            uri: 'example.com/asset',
            category: 'website',
            title: 'Asset Website'
          },
          {
            uri: 'example.com/docs',
            category: 'docs',
            title: 'Docs'
          }
        ],
        additional_info: {
          example_info: 'test'
        }
      }),
      AssetsMaximum: '0',
      WithdrawalPolicy: xrpl.VaultWithdrawalPolicy.vaultStrategyFirstComeFirstServe
    },
    { wallet: vaultOwner, autofill: true }
  )
])

const vaultNode = vaultCreateResult.result.meta.AffectedNodes.find(
  (node) => node.CreatedNode?.LedgerEntryType === 'Vault'
)
const vaultID = vaultNode.CreatedNode.LedgerIndex
const vaultShareMPTIssuanceId = vaultNode.CreatedNode.NewFields.ShareMPTID

// Step 3: Issuer sends payment to depositor
process.stdout.write('Setting up tutorial: 3/5\r')

const paymentResult = await client.submitAndWait(
  {
    TransactionType: 'Payment',
    Account: mptIssuer.address,
    Destination: depositor.address,
    Amount: {
      mpt_issuance_id: mptIssuanceId,
      value: '10000'
    }
  },
  { wallet: mptIssuer, autofill: true }
)

if (paymentResult.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error('\nPayment failed:', paymentResult.result.meta.TransactionResult)
  await client.disconnect()
  process.exit(1)
}

// Step 4: Make an initial deposit so withdraw example has shares to work with
process.stdout.write('Setting up tutorial: 4/5\r')

const initialDepositResult = await client.submitAndWait(
  {
    TransactionType: 'VaultDeposit',
    Account: depositor.address,
    VaultID: vaultID,
    Amount: {
      mpt_issuance_id: mptIssuanceId,
      value: '1000'
    }
  },
  { wallet: depositor, autofill: true }
)

if (initialDepositResult.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error('\nInitial deposit failed:', initialDepositResult.result.meta.TransactionResult)
  await client.disconnect()
  process.exit(1)
}

// Step 5: Save setup data to file
process.stdout.write('Setting up tutorial: 5/5\r')

const setupData = {
  mptIssuer: {
    address: mptIssuer.address,
    seed: mptIssuer.seed
  },
  mptIssuanceId,
  domainOwner: {
    address: domainOwner.address,
    seed: domainOwner.seed
  },
  domainId,
  credentialType: credType,
  depositor: {
    address: depositor.address,
    seed: depositor.seed
  },
  vaultOwner: {
    address: vaultOwner.address,
    seed: vaultOwner.seed
  },
  vaultID,
  vaultShareMPTIssuanceId
}

fs.writeFileSync('vaultSetup.json', JSON.stringify(setupData, null, 2))

process.stdout.write('Setting up tutorial: Complete!\n')

await client.disconnect()
