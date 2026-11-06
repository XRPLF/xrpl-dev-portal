import * as React from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { PageWrapper } from "shared/components/PageWrapper";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { XrplArrowInternalLinkIcon } from "shared/components/Icons";
import { Status, STAGES, STATUS_LABELS, featureStatus, snapshot } from "../@theme/components/amendments/model";
import { AmendmentPanel, PanelSubject } from "../@theme/components/amendments/AmendmentPanel";
import { StatusPill } from "../@theme/components/amendments/StatusPill";
import { useAmendmentData } from "../@theme/components/amendments/useAmendmentData";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Amendments",
    description:
      "New XRP Ledger features from specification to Mainnet, with the spec, documentation, security audits, and test reports for each one.",
  },
};

const FEATURE_PARAM = "feature";

type Filter = "all" | Status;

// Literal class names, so PurgeCSS can see them.
const STAGE_CLASS: Record<Status, string> = {
  development: "is-development",
  voting: "is-voting",
  majority: "is-majority",
  enabled: "is-enabled",
};

function isPlainClick(e: React.MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export default function AmendmentsPage() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { amendments, dunl } = useAmendmentData();

  const byName = React.useMemo(() => new Map(amendments.map(a => [a.name, a])), [amendments]);
  const rows = React.useMemo(
    () => snapshot.features.map(f => ({ f, status: featureStatus(f, byName) })),
    [byName],
  );

  // The open feature lives in the URL, so every feature page has a link.
  const selected = new URLSearchParams(location.search).get(FEATURE_PARAM);
  const subject: PanelSubject | null = React.useMemo(() => {
    const row = rows.find(r => r.f.slug === selected);
    if (!row) return null;
    return { feature: row.f, amendment: row.f.amendment ? byName.get(row.f.amendment) : undefined, status: row.status };
  }, [rows, selected, byName]);

  // Opening pushes one history entry; closing goes back to it, so the
  // browser's Back button closes the panel instead of reopening it.
  const openPanel = (slug: string) => (e: React.MouseEvent) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    const opened = (location.state as { amdPanel?: boolean } | null)?.amdPanel;
    navigate({ search: `?${FEATURE_PARAM}=${encodeURIComponent(slug)}`, hash: location.hash }, { replace: !!opened, state: { amdPanel: true } });
  };
  const closePanel = React.useCallback(() => {
    if ((location.state as { amdPanel?: boolean } | null)?.amdPanel) {
      navigate(-1);
      return;
    }
    navigate({ search: "", hash: location.hash }, { replace: true });
  }, [location, navigate]);

  const [filter, setFilter] = React.useState<Filter>("all");
  const inFilter = (s: Status, f: Filter) => f === "all" || s === f || (f === "voting" && s === "majority");
  const chips: Filter[] = ["all", "development", "voting", "enabled"];
  const visible = rows.filter(r => inFilter(r.status, filter));

  return (
    <PageWrapper className="landing amd-page">
      <PageGrid className="amd-hero">
        <PageGrid.Row>
          <PageGrid.Col span={{ base: 4, md: 8, lg: 8 }}>
            <p className="amd-eyebrow label-l">{translate("Network")}</p>
            <h1 className="display-md amd-hero__title">{translate("Amendments")}</h1>
            <p className="body-l amd-hero__lead">
              {translate(
                "New XRP Ledger features, from specification to Mainnet. Each one brings its spec, documentation, security audits, and test reports together in one place.",
              )}
            </p>
            <p className="amd-hero__links body-r">
              <a href="/docs/concepts/networks-and-servers/amendments">{translate("How amendments work")}</a>
              <a href="/resources/known-amendments">{translate("Known Amendments")}</a>
            </p>
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>

      <PageGrid className="amd-section" id="features">
        <PageGrid.Row>
          <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }}>
            <div className="amd-chips" role="group" aria-label={translate("Filter by stage")}>
              {chips.map(key => (
                <button
                  type="button"
                  key={key}
                  className={clsx("amd-chip", filter === key && "is-active")}
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                >
                  {key === "all" ? translate("All") : translate(STATUS_LABELS[key])}
                  <span className="visually-hidden">, </span>
                  <span className="amd-chip__count">{rows.filter(r => inFilter(r.status, key)).length}</span>
                </button>
              ))}
            </div>
          </PageGrid.Col>
        </PageGrid.Row>

        <PageGrid.Row className="amd-features">
          {visible.map(({ f, status }) => {
            const current = STAGES.indexOf(status);
            return (
              <PageGrid.Col span={{ base: 4, md: 4, lg: 3 }} key={f.slug}>
                <a className="amd-feature" href={`?${FEATURE_PARAM}=${encodeURIComponent(f.slug)}`} onClick={openPanel(f.slug)}>
                  <span className="amd-feature__top">
                    <span className="amd-feature__xls">{f.xls}</span>
                    <StatusPill status={status} small label={f.amendment ? undefined : translate("Available")} />
                  </span>
                  <span className="amd-feature__title h-sm">{f.title}</span>
                  <span className="amd-feature__summary body-r">{f.summary}</span>
                  {f.amendment && (
                    <span className="amd-stages" aria-hidden="true">
                      {STAGES.map((s, i) => (
                        <span
                          key={s}
                          className={clsx("amd-stages__step", STAGE_CLASS[s], i < current && "is-done", i === current && "is-current")}
                        />
                      ))}
                    </span>
                  )}
                  <span className="amd-feature__foot">
                    <span className="amd-feature__more">{translate("Key dates and resources")}</span>
                    <span className="amd-feature__arrow" aria-hidden="true">
                      <XrplArrowInternalLinkIcon />
                    </span>
                  </span>
                </a>
              </PageGrid.Col>
            );
          })}
        </PageGrid.Row>

        <PageGrid.Row>
          <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }}>
            <p className="amd-attribution">
              {translate("Feature pages from")}{" "}
              <a href="https://opensource.ripple.com" target="_blank" rel="noopener noreferrer">
                opensource.ripple.com
              </a>
              {translate(" by Ripple, licensed under")}{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
              {translate(". Adapted for xrpl.org.")}
            </p>
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>

      <AmendmentPanel subject={subject} dunl={dunl} onClose={closePanel} />
    </PageWrapper>
  );
}
