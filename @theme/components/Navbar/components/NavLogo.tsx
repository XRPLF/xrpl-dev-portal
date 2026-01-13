import { useThemeHooks } from "@redocly/theme/core/hooks";
import { BdsLink } from "../../../../shared/components/Link/Link";
import { xrpSymbolBlack, xrpLogotypeBlack, xrpLedgerNav } from "../constants/icons";

/**
 * Nav Logo Component.
 * Shows symbol on desktop/mobile, full logotype on tablet.
 * On desktop hover, the "XRP LEDGER" text animates out to the right.
 */
export function NavLogo() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <BdsLink href="/" className="bds-navbar__logo" aria-label={translate("XRP Ledger Home")} variant="inline">
      <img
        src={xrpSymbolBlack}
        alt={translate("XRP Ledger")}
        className="bds-navbar__logo-symbol"
      />
      <img
        src={xrpLedgerNav}
        alt=""
        className="bds-navbar__logo-text"
      />
      <img
        src={xrpLogotypeBlack}
        alt={translate("XRP Ledger")}
        className="bds-navbar__logo-full"
      />
    </BdsLink>
  );
}

