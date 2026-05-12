import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import FeaturedVideoHero from 'shared/sections/FeaturedVideoHero/FeaturedVideoHero';

export const AdvancedFeaturesSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <FeaturedVideoHero
      headline={translate('Advanced Payment Features')}
      subtitle={translate(
        'Helping fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs.',
      )}
      video={{
        source: {
          type: 'embed',
          embedUrl: 'https://www.youtube.com/embed/e2Iwsk37LMk',
        },
      }}
      links={[
        {
          label: translate('Learn More'),
          href: 'https://xrpl.org/docs/concepts/payment-types',
        },
      ]}
    />
  );
};
