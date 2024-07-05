import React from 'react';
import styled from 'styled-components';

import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { breakpoints } from '@redocly/theme/core/utils';
import { useLanguagePicker, useThemeHooks } from '@redocly/theme/core/hooks';
import { GlobalOutlinedIcon } from '@redocly/theme/icons/GlobalOutlinedIcon/GlobalOutlinedIcon';
import { Button } from '@redocly/theme/components/Button/Button';
import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

export type LanguagePickerProps = {
  onChangeLanguage: (newLang: string) => void;
  onlyIcon?: boolean;
  placement?: 'top' | 'bottom';
  alignment?: 'start' | 'end';
};

export function LanguagePicker(props: LanguagePickerProps): JSX.Element | null {
  const { currentLocale, locales, setLocale } = useLanguagePicker();
  const { useTelemetry } = useThemeHooks();
  const telemetry = useTelemetry();

  if (locales.length < 2 || !currentLocale) {
    return null;
  }

  const languagePickerButton = (
    <Button
      icon={<GlobalOutlinedIcon color="--button-content-color" />}
      variant="text"
      size="medium"
    />
  );

  const languageItems = locales.map((locale) => ({
    content: locale.name || locale.code || '',
    onAction: () => {
      setLocale(locale.code);
      props.onChangeLanguage(locale.code);
      telemetry.send('language_picker_locale_changed', { locale: locale.code });
    },
    active: locale.code === currentLocale.code,
    suffix: locale.code === currentLocale.code && <CheckmarkIcon />,
  }));

  return (
    <LanguageDropdown
      triggerEvent="click"
      placement={props.placement}
      alignment={props.alignment}
      trigger={languagePickerButton}
    >
      <DropdownMenu items={languageItems} />
    </LanguageDropdown>
  );
}

const LanguageDropdown = styled(Dropdown).attrs(() => ({
  dataAttributes: {
    'data-component-name': 'LanguagePicker/LanguagePicker',
  },
}))`
  --dropdown-menu-item-justify-content: space-between;
  --dropdown-menu-item-gap: var(--spacing-xxs);
  --dropdown-menu-font-size: var(--language-picker-dropdown-font-size);
  --dropdown-menu-font-weight: var(--language-picker-dropdown-font-weight);
  --dropdown-menu-line-height: var(--language-picker-dropdown-line-height);
  --dropdown-menu-text-color: var(--language-picker-dropdown-text-color);
  --dropdown-menu-min-width: var(--language-picker-dropdown-min-width);
  --dropdown-menu-max-width: var(--language-picker-dropdown-max-width);
  --dropdown-menu-max-height: var(--language-picker-dropdown-max-height);
  --dropdown-menu-padding: var(--language-picker-dropdown-padding);
  --dropdown-menu-border-radius: var(--language-picker-dropdown-border-radius);
  --dropdown-menu-box-shadow: var(--language-picker-dropdown-box-shadow);
  --dropdown-menu-border-color: var(--language-picker-dropdown-border-color);
  --dropdown-menu-bg-color: var(--language-picker-dropdown-bg-color);
  --dropdown-menu-item-padding-horizontal: var(--language-picker-dropdown-item-padding-horizontal);
  --dropdown-menu-item-padding-vertical: var(--language-picker-dropdown-item-padding-vertical);
  --dropdown-menu-item-separator-padding-top: var(
    --language-picker-dropdown-item-separator-padding-top
  );
  --dropdown-menu-item-separator-padding-bottom: var(
    --language-picker-dropdown-item-separator-padding-bottom
  );
  --dropdown-menu-item-border-radius: var(--language-picker-dropdown-item-border-radius);
  --dropdown-menu-item-bg-color-active: var(--language-picker-dropdown-item-bg-color-active);
  --dropdown-menu-item-bg-color-hover: var(--language-picker-dropdown-item-bg-color-hover);
  --dropdown-menu-item-bg-color-disabled: var(--language-picker-dropdown-item-bg-color-disabled);
  --dropdown-menu-item-separator-border-color: var(
    --language-picker-dropdown-item-separator-border-color
  );
  --dropdown-menu-item-color-dangerous: var(--language-picker-dropdown-item-color-dangerous);
  --dropdown-menu-item-color-disabled: var(--language-picker-dropdown-item-color-disabled);
  --dropdown-menu-item-color-active: var(--language-picker-dropdown-item-color-active);
  --dropdown-menu-item-color-hover: var(--language-picker-dropdown-item-color-hover);
`;
