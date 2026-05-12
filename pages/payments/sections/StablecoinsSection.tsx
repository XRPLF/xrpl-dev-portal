import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { StandardCardGroupSection } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import type { StandardCardPropsWithoutVariant } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';

const STABLECOIN_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: 'RLUSD',
    children:
      "Ripple's enterprise-grade stablecoin, is live on XRPL and fully backed by USD deposits. Built for institutions, it enables fast, compliant, low-cost cross-border payments.",
    callsToAction: [{ children: 'RLUSD', href: 'https://ripple.com/solutions/stablecoin/' }],
  },
  {
    headline: 'USDC',
    children:
      "Issued by Circle, is the world's largest regulated dollar stablecoin and now live on XRPL. It unlocks new corridors for enterprise payments, remittances, and DeFi for millions of users and developers.",
    callsToAction: [{ children: 'USDC', href: 'https://www.circle.com/usdc' }],
  },
  {
    headline: 'USDB',
    children:
      'By Braza Group, is a USD-pegged stablecoin backed by U.S. and Brazilian bonds. Built for FX and remittance, it supports both institutional and retail users via the Braza On app.',
    callsToAction: [{ children: 'USDB', href: 'https://www.brazabank.com.br/en/usdben/' }],
  },
  {
    headline: 'EUROP',
    children:
      'Issued by Schuman Financial, is the first MiCA-compliant euro stablecoin on XRPL. With full reserves at leading EU banks, it brings credible euro liquidity to payments, on-chain FX, and DeFi.',
    callsToAction: [{ children: 'EUROP', href: 'https://schuman.io/europ/' }],
  },
  {
    headline: 'XSGD',
    children:
      "From StraitsX, is a Singapore Dollar-backed stablecoin regulated by MAS. Its launch on XRPL enhances fast, low-cost payments in Southeast Asia's digital economy.",
    callsToAction: [{ children: 'XSGD', href: 'https://www.straitsx.com/xsgd' }],
  },
  {
    headline: 'AUDD',
    children:
      "An Australian dollar stablecoin, is live on XRPL and backed 1:1 with AUD. It supports value transfers, remittance, trade, cross-border transactions and DeFi, enabling AUD utility via XRPL's Decentralised Exchange.",
    callsToAction: [{ children: 'AUDD', href: 'https://www.audd.digital/' }],
  },
];

export const StablecoinsSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <StandardCardGroupSection
      headline={translate('Enterprise-Grade Stablecoins, Issued Natively on XRPL')}
      description=""
      variant="yellow"
      cards={STABLECOIN_CARDS}
    />
  );
};
