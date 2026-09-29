// WARNING: local testing only. This writes account seeds to
// confidentialTransfersSetup.json. Never persist secrets in plaintext in
// production.

import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  BatchFlags,
  Client,
  GlobalFlags,
  MPTokenIssuanceCreateFlags,
  deriveConfidentialKeypair,
  encodeMPTokenMetadata,
  prepareConfidentialConvert,
  prepareConfidentialMergeInbox,
  prepareConfidentialSend,
  signMultiBatch
} from 'xrpl'

const TOTAL_STEPS = 6
const ASSET_SCALE = 0

// The issuer's second account converts confidentialSupply of each token into a
// confidential balance, then sends each token's distributions to the holders
// that need it.
const confidentialSupply = 900000

export async function setup() {
  const client = new Client('wss://s.devnet.rippletest.net:51233')
  await client.connect()

  let step = 1
  const progress = () => process.stdout.write(`Setting up tutorial: ${step++}/${TOTAL_STEPS}\r`)

  async function submit(tx, wallet, description) {
    const response = await client.submitAndWait(tx, { wallet, autofill: true })
    const resultCode = response.result.meta.TransactionResult
    if (resultCode !== 'tesSUCCESS') {
      throw new Error(`Unable to ${description}: ${resultCode}`)
    }
    return response
  }

  // 1. Fund the accounts ----------------------
  progress()
  const [
    { wallet: issuer },
    { wallet: issuerSecondAccount },
    { wallet: auditor },
    { wallet: seller },
    { wallet: buyer },
    { wallet: flaggedHolder }
  ] = await Promise.all(Array.from({ length: 6 }, () => client.fundWallet()))

  const issuerKeys = deriveConfidentialKeypair(issuer.seed)
  const issuerSecondAccountKeys = deriveConfidentialKeypair(
    issuerSecondAccount.seed
  )
  const auditorKeys = deriveConfidentialKeypair(auditor.seed)
  const sellerKeys = deriveConfidentialKeypair(seller.seed)
  const buyerKeys = deriveConfidentialKeypair(buyer.seed)
  const flaggedHolderKeys = deriveConfidentialKeypair(flaggedHolder.seed)

  const tokens = [
    {
      name: 'ctst',
      ticker: 'CTST',
      distributions: [{ recipient: seller, amount: 1000 }],
      metadata: {
        name: 'Confidential Fund Token',
        desc: 'A confidential demo tokenized fund.',
        icon: 'https://example.org/ctst-icon.png',
        asset_class: 'rwa',
        asset_subclass: 'treasury'
      }
    },
    {
      name: 'ctusd',
      ticker: 'CTUSD',
      distributions: [
        { recipient: buyer, amount: 100000 },
        { recipient: flaggedHolder, amount: 500 }
      ],
      metadata: {
        name: 'Confidential Cash Token',
        desc: 'A confidential demo stablecoin.',
        icon: 'https://example.org/cusd-icon.png',
        asset_class: 'rwa',
        asset_subclass: 'stablecoin'
      }
    }
  ]

  // 2. Create both issuances ----------------------
  progress()
  for (const token of tokens) {
    const createResponse = await submit(
      {
        TransactionType: 'MPTokenIssuanceCreate',
        Account: issuer.address,
        AssetScale: ASSET_SCALE,
        MaximumAmount: '1000000000',
        TransferFee: 0,
        Flags:
          MPTokenIssuanceCreateFlags.tfMPTCanHoldConfidentialBalance |
          MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
          MPTokenIssuanceCreateFlags.tfMPTCanClawback |
          MPTokenIssuanceCreateFlags.tfMPTCanLock,
        MPTokenMetadata: encodeMPTokenMetadata({
          ticker: token.ticker,
          issuer_name: 'Example Financial Corp',
          ...token.metadata
        })
      },
      issuer,
      `create the ${token.ticker} issuance`
    )
    token.mptIssuanceID = createResponse.result.meta.mpt_issuance_id
  }

  await submit(
    {
      TransactionType: 'Batch',
      Account: issuer.address,
      Flags: BatchFlags.tfAllOrNothing,
      RawTransactions: tokens.map((token) => ({
        RawTransaction: {
          TransactionType: 'MPTokenIssuanceSet',
          Account: issuer.address,
          MPTokenIssuanceID: token.mptIssuanceID,
          IssuerEncryptionKey: issuerKeys.publicKey,
          AuditorEncryptionKey: auditorKeys.publicKey,
          Flags: GlobalFlags.tfInnerBatchTxn
        }
      }))
    },
    issuer,
    'register the encryption keys on both issuances'
  )

  // 3. Move each supply into a confidential balance ----------------------
  progress()
  const supplyBatchTx = await client.autofill(
    {
      TransactionType: 'Batch',
      Account: issuer.address,
      Flags: BatchFlags.tfAllOrNothing,
      RawTransactions: [
        ...tokens.map((token) => ({
          RawTransaction: {
            TransactionType: 'MPTokenAuthorize',
            Account: issuerSecondAccount.address,
            MPTokenIssuanceID: token.mptIssuanceID,
            Flags: GlobalFlags.tfInnerBatchTxn
          }
        })),
        ...tokens.map((token) => ({
          RawTransaction: {
            TransactionType: 'Payment',
            Account: issuer.address,
            Destination: issuerSecondAccount.address,
            Amount: {
              mpt_issuance_id: token.mptIssuanceID,
              value: String(confidentialSupply)
            },
            Flags: GlobalFlags.tfInnerBatchTxn
          }
        }))
      ]
    },
    1
  )
  signMultiBatch(issuerSecondAccount, supplyBatchTx)
  const supplyBatchResponse = await client.submitAndWait(supplyBatchTx, {
    wallet: issuer
  })
  const supplyBatchResult = supplyBatchResponse.result.meta.TransactionResult
  if (supplyBatchResult !== 'tesSUCCESS') {
    throw new Error(
      `Unable to send the public supply of both tokens: ${supplyBatchResult}`
    )
  }

  // Each convert and merge carries a proof bound to its own sequence, so they
  // stay outside the Batch.
  for (const token of tokens) {
    const convertTx = await prepareConfidentialConvert(client, {
      account: issuerSecondAccount.address,
      mptIssuanceID: token.mptIssuanceID,
      amount: BigInt(confidentialSupply),
      holderKeypair: issuerSecondAccountKeys
    })
    await submit(
      convertTx,
      issuerSecondAccount,
      `convert the ${token.ticker} supply`
    )

    const supplyMergeTx = await prepareConfidentialMergeInbox(client, {
      account: issuerSecondAccount.address,
      mptIssuanceID: token.mptIssuanceID
    })
    await submit(supplyMergeTx, issuerSecondAccount, `merge the ${token.ticker} supply`)
  }

  // 4. Onboard each holder on both issuances ----------------------
  progress()
  await Promise.all(
    [
      [seller, sellerKeys],
      [buyer, buyerKeys],
      [flaggedHolder, flaggedHolderKeys]
    ].map(async ([holder, holderKeys]) => {
      await submit(
        {
          TransactionType: 'Batch',
          Account: holder.address,
          Flags: BatchFlags.tfAllOrNothing,
          RawTransactions: tokens.map((token) => ({
            RawTransaction: {
              TransactionType: 'MPTokenAuthorize',
              Account: holder.address,
              MPTokenIssuanceID: token.mptIssuanceID,
              Flags: GlobalFlags.tfInnerBatchTxn
            }
          }))
        },
        holder,
        `authorize ${holder.address} to hold both tokens`
      )

      // Each convert carries a proof bound to its own sequence, so they stay
      // outside the Batch.
      for (const token of tokens) {
        const registerTx = await prepareConfidentialConvert(client, {
          account: holder.address,
          mptIssuanceID: token.mptIssuanceID,
          amount: BigInt(0),
          holderKeypair: holderKeys
        })
        await submit(registerTx, holder, `register the ${token.ticker} holder key`)
      }
    })
  )

  // 5. Distribute each token to its holders ----------------------
  progress()
  for (const token of tokens) {
    for (const { recipient, amount } of token.distributions) {
      const distributeTx = await prepareConfidentialSend(client, {
        account: issuerSecondAccount.address,
        destination: recipient.address,
        mptIssuanceID: token.mptIssuanceID,
        amount: BigInt(amount),
        senderKeypair: issuerSecondAccountKeys
      })
      await submit(
        distributeTx,
        issuerSecondAccount,
        `distribute ${token.ticker} to ${recipient.address}`
      )
    }
  }

  // 6. Write the setup data ----------------------
  progress()
  const [fundToken, cashToken] = tokens
  const setupData = {
    description:
      'This file is auto-generated by confidentialTransfersSetup.js. It stores XRPL account info and the confidential MPT issuance IDs for the confidential transfer tutorials.',
    issuer: { address: issuer.address, seed: issuer.seed },
    issuerSecondAccount: {
      address: issuerSecondAccount.address,
      seed: issuerSecondAccount.seed
    },
    auditor: { address: auditor.address, seed: auditor.seed },
    seller: { address: seller.address, seed: seller.seed },
    buyer: { address: buyer.address, seed: buyer.seed },
    flaggedHolder: {
      address: flaggedHolder.address,
      seed: flaggedHolder.seed
    },
    fund: { ticker: fundToken.ticker, mptIssuanceID: fundToken.mptIssuanceID },
    stablecoin: { ticker: cashToken.ticker, mptIssuanceID: cashToken.mptIssuanceID }
  }

  fs.writeFileSync('confidentialTransfersSetup.json', JSON.stringify(setupData, null, 2))

  await client.disconnect()
}

// Allow running this file directly: `node confidentialTransfersSetup.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await setup()
}
