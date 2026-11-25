import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from 'shared/components/Link';
import { PageWrapper } from 'shared/components/PageWrapper';
import { HeaderHeroSplitMedia } from 'shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';
import { StandardCardGroupSection } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';
import { LinkSmallGrid } from 'shared/sections/LinkSmallGrid/LinkSmallGrid';
import { FeatureSingleTopic } from 'shared/sections/FeatureSingleTopic/FeatureSingleTopic';

export const frontmatter = {
  seo: {
    title: 'Collateral Management on the XRP Ledger',
    description:
      'Move tokenized assets through their real lifecycle. Issue fund shares, distribute to institutional holders, and settle collateral swaps atomically with institutional-grade privacy and compliance, all natively on XRPL.',
  },
};

// TODO: Placeholder hrefs pending final URLs from PM.
const GET_STARTED_HREF = '#';
const EXPLORE_DOCS_HREF = '#';
const START_BUILDING_HREF = 'https://xrpl-sample-confidential-atomic-swa-gules.vercel.app/';
const CUSTODIAN_ONBOARDING_HREF = '#'; // Custodian onboarding guide in progress.

export default function CollateralManagement() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <PageWrapper className="landing page-use-cases page-use-cases-collateral-management">

      {/* 1. Hero */}
      <HeaderHeroSplitMedia
        layout="content-left"
        title={translate('Real-Time Collateral Mobility, Native to the Ledger')}
        description={translate(
          'Trillions in institutional fund assets sit trapped in settlement delays and static buffers. XRPL enables authorized institutions to issue, distribute, and mobilize tokenized assets through atomic, private settlement with sub-5-second finality, 24/7. One stack, one integration, no smart contracts.'
        )}
        primaryCta={{
          label: translate('Get Started'),
          href: GET_STARTED_HREF,
        }}
        secondaryCta={{
          label: translate('Explore the Docs'),
          href: EXPLORE_DOCS_HREF,
        }}
        media={{
          src: require('../../../static/img/bds-2026/use-cases-tokenization-hero-media.jpg'),
          alt: translate('Abstract architectural form representing connected collateral assets'),
        }}
      />

      {/* 2. The Institutional Foundation — Link Text Directory */}
      <LinkTextDirectory
        heading={translate('Built for How Collateral Actually Moves')}
        cards={[
          {
            heading: translate('Atomic Settlement'),
            description: translate(
              'Both legs of a trade execute in one transaction. All-or-nothing execution removes principal risk: either both legs settle or neither does. No clearing house, no T+1 delay. Sub-cent fees, 3 to 5 second finality.'
            ),
            buttons: [],
          },
          {
            heading: translate('Institutional-Grade Privacy'),
            description: translate(
              'Transaction amounts are encrypted on-ledger using zero-knowledge proofs. Counterparties, regulators, and auditors see exactly what they need through auditor keys. Public observers see that a transfer happened, not how much.'
            ),
            buttons: [],
          },
          {
            heading: translate('Embedded Compliance'),
            description: translate(
              'Authorization, freeze, clawback, and permissioning are enforced at the protocol level. Sponsored Fees abstract XRP away, so regulated institutions never need to hold it.'
            ),
            buttons: [],
          },
        ]}
      />

      {/* 3. What You Can Build — Standard Card Group (3 workflows) */}
      <StandardCardGroupSection
        variant="green"
        headline={translate('Mobilize Tokenized Assets Across Capital Markets')}
        description={translate(
          'Three collateral workflows, all built on the same XRPL feature stack.'
        )}
        cards={[
          {
            headline: translate('OTC Swap'),
            children: (
              <>
                <p>
                  {translate(
                    'Exchange any two tokenized assets in one all-or-nothing transaction, with optional encrypted amounts. The same primitive covers delivery versus payment, payment versus payment, and delivery versus delivery.'
                  )}
                </p>
                <p>
                  <strong>{translate('Use cases:')}</strong>{' '}
                  {translate('DvP, FX settlement, OTC and block trades')}
                </p>
              </>
            ),
          },
          {
            headline: translate('Securities Lending'),
            children: (
              <>
                <p>
                  {translate(
                    'Lend a tokenized security against collateral. The security and the collateral move in the same atomic transaction, and the return happens the same way at the end of the term.'
                  )}
                </p>
                <p>
                  <strong>{translate('Use cases:')}</strong>{' '}
                  {translate('Securities financing, short covering, yield on idle inventory')}
                </p>
              </>
            ),
          },
          {
            headline: translate('Collateral Pledge'),
            children: (
              <>
                <p>
                  {translate(
                    'Pledge tokenized assets to a third-party qualified custodian, with optional confidentiality, to secure credit, without selling them. The issuer’s authorization and compliance controls stay with the asset throughout.'
                  )}
                </p>
                <p>
                  <strong>{translate('Use cases:')}</strong>{' '}
                  {translate('Block trades, institutional secondary market activity')}
                </p>
              </>
            ),
          },
        ]}
      />

      {/* 4. Key Protocol Features — Cards Text Grid (8 features) */}
      <CardsTextGrid
        heading={translate('Institutional Controls, Native to the Ledger')}
        description={translate(
          'Some features described on this page, including Batch transactions, Confidential Transfers, and Sponsored Fees, depend on amendments that are not yet enabled on Mainnet.'
        )}
        cards={[
          {
            heading: translate('Atomic Settlement'),
            description: translate(
              'Both legs execute in one batch, all-or-nothing. No intermediary absorbs settlement risk because there is no settlement risk. Sub-cent fees replace 0.5–2.0 bps clearing costs per trade.'
            ),
          },
          {
            heading: translate('Confidential Transfers'),
            description: translate(
              'Encrypted amounts on-ledger via ZK proofs. Selective decryption for audit, compliance, and regulatory review. Opt-in per transaction: keep the asset leg private, leave cash transparent, or encrypt both.'
            ),
          },
          {
            heading: translate('Token Escrow'),
            description: translate(
              'Receive, hold, and release collateral on the ledger with no third party. Assets stay locked until a release condition is met: a set time, a cryptographic condition fulfilled off-chain, or both. If the condition isn’t met, the escrow can be cancelled and assets return to the original holder.'
            ),
          },
          {
            heading: translate('Sponsored Fees'),
            description: translate(
              'Third-party sponsors pay XRP fees and reserves on behalf of regulated entities. Regulated FIs never hold, touch, or transact XRP. The infrastructure cost is abstracted beneath a service layer.'
            ),
          },
          {
            heading: translate('Ledger-Level Policies'),
            description: translate(
              'Enforce signing quorums, multi-party approval thresholds, and segregation of duties at the protocol level. Institutions mirror their internal governance on-chain rather than relying on application-layer trust.'
            ),
          },
          {
            heading: translate('Permissioned Access'),
            description: translate(
              'MPT holder authorization ensures only KYC/AML-verified wallets hold tokenized assets. Authorization travels with the token into secondary market activity. Issuer retains freeze, clawback, and lock capability.'
            ),
          },
          {
            heading: translate('Composability with Stablecoins'),
            description: translate(
              'Settle the cash leg in any stablecoin issued on XRPL. Interoperate with any MPT-issued asset. Native to XRPL, no bridge.'
            ),
          },
          {
            heading: translate('Institutional Compliance Controls'),
            description: translate(
              'Permission Delegation enables separation of duties: treasury holds keys, trading desk transacts within delegated scope. Audit trail is stronger than off-chain equivalent.'
            ),
          },
        ]}
      />

      {/* 6. Why XRPL for Collateral Management — Link Text Directory (replaces Dimension/XRPL table) */}
      <LinkTextDirectory
        heading={translate('Why XRPL for Collateral Management')}
        cards={[
          {
            heading: translate('Deployment'),
            description: translate(
              'Native ledger primitives. No contracts to deploy, audit, or maintain.'
            ),
            buttons: [],
          },
          {
            heading: translate('Settlement'),
            description: translate('3–5 second finality, 24/7. Atomic by default.'),
            buttons: [],
          },
          {
            heading: translate('Cost'),
            description: translate('Sub-cent per operation.'),
            buttons: [],
          },
          {
            heading: translate('Privacy'),
            description: translate(
              'Protocol-native ZK proofs. Selective decryption for compliance.'
            ),
            buttons: [],
          },
          {
            heading: translate('Compliance'),
            description: translate(
              'Protocol-level authorization, freeze, clawback, delegation. Sponsored Fees abstract XRP.'
            ),
            buttons: [],
          },
        ]}
      />

      {/* 7. Integration Paths — Cards Text Grid */}
      <CardsTextGrid
        heading={translate('Build Directly or Move Faster with a Partner')}
        cards={[
          {
            heading: translate('Build It Yourself'),
            description: (
              <>
                {translate(
                  'Use open-source documentation and XRPL’s native transaction types (MPTokenIssuanceCreate, Batch, ConfidentialMPTSend) and Sponsored Fees to build your own collateral workflow directly on the ledger.'
                )}
                <br />
                <br />
                <Link href={START_BUILDING_HREF} intention="neutral">
                  {translate('Start Building with Docs')}
                </Link>
              </>
            ),
          },
          {
            heading: translate('Work with a Partner'),
            description: translate(
              'Connect with ecosystem partners already building collateral workflows on XRPL (marketplaces, custodians, transfer agents) for pre-built orchestration, custody integration, and managed infrastructure.'
            ),
          },
        ]}
      />

      {/* 8. For Custodians — intro beside image (FeatureSingleTopic), then requirement cards */}
      <FeatureSingleTopic
        className="cm-custodian-intro"
        orientation="right"
        title={translate('What a Custodian Needs to Support These Workflows')}
        description={translate(
          // TODO: Trimmed intro pending PMM approval. Doc original: 'Beyond the baseline integration described in the Custodian Onboarding Guide, supporting this use case requires the following:'
          'Beyond baseline custodian onboarding, supporting these workflows requires the following:'
        )}
        buttons={[
          {
            label: translate('Custodian Onboarding Guide'),
            href: CUSTODIAN_ONBOARDING_HREF,
          },
        ]}
        singleButtonEmphasis="standard"
        media={{
          src: require('../../../static/img/atomic-swap-flow.svg'),
          href: require('../../../static/img/atomic-swap-flow.svg'),
          linkLabel: translate('View full-size diagram'),
          alt: translate(
            'Atomic swap between two counterparties on XRPL. Two counterparties, each holding an asset at their own custodian, agree terms with an orchestrator. The orchestrator builds one batch transaction containing both legs, each counterparty signs from its own custodian, and the XRP Ledger swaps both legs atomically: both settle at once, or neither does.'
          ),
        }}
      />
      <StandardCardGroupSection
        className="cm-custodian-requirements"
        variant="neutral"
        headline=""
        description=""
        cards={[
          {
            headline: translate('Asset Support'),
            children: (
              <ul>
                <li>{translate('Custody both workflow legs as Multi-Purpose Tokens (MPTs): the tokenized asset and the cash-leg stablecoin.')}</li>
                <li>{translate('For collateral pledges, manage Token Escrow objects, including finish and cancel flows.')}</li>
              </ul>
            ),
          },
          {
            headline: translate('Key Management & Signing'),
            children: (
              <ul>
                <li>{translate('Generate, hold, and rotate a keypair per confidential account.')}</li>
                <li>{translate('Construct and sign MPT authorization, payment, and confidential transfer transactions.')}</li>
                <li>{translate('Support client-side proof generation and the multi-account signing format.')}</li>
              </ul>
            ),
          },
          {
            headline: translate('Indexing & Monitoring'),
            children: (
              <ul>
                <li>{translate('Track stablecoin issuer state and account authorization, lock, and denylist status.')}</li>
                <li>{translate('Reconcile confidential balances using advanced key management support.')}</li>
                <li>{translate('Parse Batch results at the inner-transaction level before crediting.')}</li>
              </ul>
            ),
          },
        ]}
      />

      {/* 9. Developers — Link Small Grid */}
      <LinkSmallGrid
        variant="gray"
        heading={translate('Developers')}
        description={translate('Master the Protocol: Essential References')}
        links={[
          {
            label: translate('Issue an MPT'),
            href: '/docs/tutorials/tokens/mpts/issue-a-multi-purpose-token',
          },
          {
            label: translate('Send a Multi-Account Batch'),
            href: '/docs/tutorials/best-practices/transaction-sending/send-a-multi-account-batch-transaction',
          },
          {
            label: translate('Confidential Payments'),
            href: '/docs/tutorials/payments/send-confidential-payments',
          },
          {
            label: translate('Atomic Swap Demo'),
            href: 'https://xrpl-sample-confidential-atomic-swa-gules.vercel.app/',
          },
          {
            label: translate('simpleXRPL Docs'),
            href: 'https://opensource.ripple.com/docs/simplexrpl',
          },
        ]}
      />

      {/* 10. Learn & Stay Updated — Link Small Grid */}
      <LinkSmallGrid
        variant="gray"
        heading={translate('Learn & Stay Updated')}
        links={[
          {
            label: translate('Join the Developer Discord'),
            href: 'https://discord.gg/sfX3ERAMjH',
          },
          {
            label: translate('Sign up for the Newsletter'),
            href: 'https://xrplresources.org/subscribe',
          },
          {
            label: translate('Follow @RippleDevRel'),
            href: 'https://twitter.com/RippleDevRel',
          },
          {
            label: translate('XRPL Explorer'),
            href: 'https://livenet.xrpl.org/',
          },
        ]}
      />

    </PageWrapper>
  );
}
