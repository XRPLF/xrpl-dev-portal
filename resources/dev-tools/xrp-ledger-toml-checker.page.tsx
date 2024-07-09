import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { TextLookupForm, type TextLookupFormProps } from './components/TextLookupForm';
import { fetchFile, fetchWallet } from './toml-checker/ValidateTomlSteps';
import { LogEntryItem } from './components/LogEntry';

export const frontmatter = {
  seo: {
    title: 'xrp-ledger.toml Checker',
    description: "Confirm that your site's xrp-ledger.toml file is set up correctly.",
  }
};

/**
 * Example data to test the tool with
 *
 * Domains:
 * - Valid: validator.xrpl-labs.com
 * - Not valid: sologenic.com
 *
 * Addresses:
 * - Valid: rSTAYKxF2K77ZLZ8GoAwTqPGaphAqMyXV
 * - No toml: rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz
 * - No domain: rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
 */

function handleSubmitWallet(
  setAccountLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
  event: React.FormEvent<HTMLFormElement>,
  addressToVerify: string) {

  event.preventDefault()
  setAccountLogEntries([])
  fetchWallet(setAccountLogEntries, addressToVerify)
}

function handleSubmitDomain(
  setDomainLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
  event: React.FormEvent<HTMLFormElement>,
  domainAddress: string) {

  event.preventDefault();
  setDomainLogEntries([])
  fetchFile(setDomainLogEntries, domainAddress)
}

export default function TomlChecker() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const domainButtonProps: TextLookupFormProps = {
    title: `Look Up By Domain`,
    description: <p>{translate('resources.dev-tools.toml-checker.domain.description.part1', `This tool allows you to verify that your `)}<code>{translate(`xrp-ledger.toml`)}</code>
    {translate('resources.dev-tools.toml-checker.domain.description.part2', ` file is syntactically correct and deployed properly.`)}</p>,
    buttonDescription: `Check toml file`,
    formPlaceholder: "example.com (Domain name to check)",
    handleSubmit: handleSubmitDomain,
  }

  const addressButtonProps: TextLookupFormProps = {
    title: `Look Up By Account`,
    description: <p>{translate('resources.dev-tools.toml-checker.account.description.part1', `Enter an XRP Ledger address to see if that account is claimed by the domain it says owns it.`)}</p>,
    buttonDescription: `Check account`,
    formPlaceholder: `r... (${translate("Wallet Address to check")})`,
    handleSubmit: handleSubmitWallet
  }

  return (
    <div className="toml-checker row">
        {/* This aside is empty but it keeps the formatting similar to other pages */}
        <aside className="right-sidebar col-lg-3 order-lg-4" role="complementary"/>

        <main className="main col-lg-9" role="main" id="main_content_body">
            <section className="container-fluid">
                <div className="p-3">
                    <h1>{translate(`xrp-ledger.toml Checker`)}</h1>
                    <p>{translate('resources.dev-tools.toml-checker.p.part1', `If you run an XRP Ledger validator or use the XRP Ledger for your business,
                    you can provide information about your usage of the XRP Ledger to the world in a machine-readable `)}
                    <a href="https://xrpl.org/xrp-ledger-toml.html"><code>{translate(`xrp-ledger.toml`)}</code>{translate('resources.dev-tools.toml-checker.p.part2', ` file`)}</a>{translate('resources.dev-tools.toml-checker.p.part3', `.`)}</p>
                </div>

                <TextLookupForm {...domainButtonProps} />
                <TextLookupForm {...addressButtonProps} />
            </section>
        </main>
    </div>
  )
}
