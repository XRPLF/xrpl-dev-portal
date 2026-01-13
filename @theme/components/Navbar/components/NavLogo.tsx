import * as React from "react";
import { BdsLink } from "../../../../shared/components/Link/Link";
import { xrpSymbolBlack, xrpLogotypeBlack, xrpLedgerNav } from "../constants/icons";

/**
 * Nav Logo Component.
 * Shows symbol on desktop/mobile, full logotype on tablet.
 * On desktop hover, the "XRP LEDGER" text animates out to the right.
 */
export function NavLogo() {
  return (
    <BdsLink href="/" className="bds-navbar__logo" aria-label="XRP Ledger Home" variant="inline">
      <img
        src={xrpSymbolBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-symbol"
      />
      <img
        src={xrpLedgerNav}
        alt=""
        className="bds-navbar__logo-text"
      />
      <img
        src={xrpLogotypeBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-full"
      />
    </BdsLink>
  );
}

