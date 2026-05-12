import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';

export const WhyChooseSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const cards = [
    {
      heading: translate('Enable Cross-Border Stablecoin Payments'),
      description: (
        <ul>
          <li>{translate('Set of regulated stablecoins RLUSD, AUDD, BBRL, USDC etc live on XRPL')}</li>
          <li>{translate('Easily receive, store, convert, issue and send stablecoins')}</li>
        </ul>
      ),
      buttons: [],
    },
    {
      heading: translate('Access Reliable Payments Infrastructure'),
      description: (
        <ul>
          <li>{translate('Uninterrupted performance with 99.9% uptime since 2012')}</li>
          <li>{translate('Over $1T+ in value moving transactions processed to date')}</li>
        </ul>
      ),
      buttons: [],
    },
    {
      heading: translate('Move Money Efficiently'),
      description: (
        <ul>
          <li>{translate('Transactions settle atomically, in 3-5 seconds')}</li>
          <li>{translate('Predictable and ultra-low transaction fees')}</li>
        </ul>
      ),
      buttons: [],
    },
  ];

  return (
    <LinkTextDirectory
      heading={translate('Why Choose XRPL Payments Suite for Your Payment Rails?')}
      cards={cards}
    />
  );
};
