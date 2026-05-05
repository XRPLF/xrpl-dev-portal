import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';

export const FlexibleIntegrationSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const cards = [
    {
      heading: translate('Build It Yourself'),
      description: (
        <>
          <p>{translate('Ideal for seasoned teams with crypto experience')}</p>
          <ul>
            <li>
              {translate('Access open ')}<a href="https://xrpl.org/docs">{translate('documentation')}</a>
            </li>
            <li>
              {translate('Use the Payments APIs + ')}<a href="https://xrpl.org/resources/dev-tools">{translate('XRPL tooling')}</a>
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: translate('Work with a Partner'),
      description: (
        <>
          <p>{translate('Ideal for regulated institutions')}</p>
          <ul>
            <li>
              {translate('Connect with the ')}<a href="https://discord.com/invite/KTNmhJDXqa">{translate('Community')}</a>
            </li>
            <li>{translate('Get help for more complex use cases')}</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <CardsTextGrid
      heading={translate('Flexible Integration: DIY or Partner-Led')}
      cards={cards}
    />
  );
};
