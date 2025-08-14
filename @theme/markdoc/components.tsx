import * as React from 'react';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { Link } from '@redocly/theme/components/Link/Link';
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { idify } from '../helpers';
import { Button } from '@redocly/theme/components/Button/Button';

export {default as XRPLoader} from '../components/XRPLoader';
export { XRPLCard, CardGrid } from '../components/XRPLCard';


export function IndexPageItems() {
    const { usePageSharedData } = useThemeHooks();
    const data = usePageSharedData('index-page-items') as any[];
    return (
        <div className="children-display">
            <ul>
              {data?.map((item: any) => (
                <li className="level-1" key={item.slug}>
                  <Link to={item.slug}>{item.title}</Link>
                  <p className='class="blurb child-blurb'>{item.blurb}</p>
                </li>
              ))}
            </ul>
        </div>
  );
}

export function InteractiveBlock(props: { children: React.ReactNode; label: string; steps: string[] }) {
  const stepId = idify(props.label);
  const { pathname } = useLocation();

  return (
    // add key={pathname} to ensure old step state gets rerendered on page navigation
    <div className="interactive-block" id={'interactive-' + stepId}  key={pathname}>
      <div className="interactive-block-inner">
        <div className="breadcrumbs-wrap">
          <ul
            className="breadcrumb tutorial-step-crumbs"
            id={'bc-ul-' + stepId}
            data-steplabel={props.label}
            data-stepid={stepId}
          >
            {props.steps?.map((step, idx) => {
              const iterStepId = idify(step).toLowerCase();
              let className = `breadcrumb-item bc-${iterStepId}`;
              if (idx > 0) className += ' disabled';
              if (iterStepId === stepId) className += ' current';
              return (
                <li className={className} key={iterStepId}>
                  <a href={`#interactive-${iterStepId}`}>{step}</a>
                </li>
                );
            })}
          </ul>
        </div>

        <div className="interactive-block-ui">{dynamicReact(props.children, React, {})}</div>
      </div>
    </div>
    );
}

export function RepoLink(props: {
        children: React.ReactNode;
        path: string;
        github_fork: string;
        github_branch: string
    }) {
    const treeblob = props.path.indexOf(".") >= 0 ? "blob/" : "tree/"
    const sep = props.github_fork[-1] == "/" ? "" : "/"
    const href = props.github_fork+sep+treeblob+props.github_branch+"/"+props.path

    return (
        <Link to={href}>{dynamicReact(props.children, React, {})}</Link>
    )
}

export function CodePageName(props: {
    name: string;
}) {
    return (
        <code>{props.name}</code>
    )
}

export function Badge(props: {
    children: React.ReactNode;
    color: string;
    href: string;
}) {
    const DEFAULT_COLORS = {
      "open for voting": "80d0e0",
      "投票中": "80d0e0", // ja: open for voting
      "expected": "blue",
      "予定": "blue", // ja: expected
      "enabled": "green",
      "有効": "green", // ja: enabled
      "obsolete": "red",
      "廃止": "red", // ja: obsolete
      "撤回": "red", // ja: withdrawn/removed/vetoed
      "new in": "blue",
      "新規": "blue", // ja: new in
      "updated in": "blue",
      "更新": "blue", // ja: updated in
      "in development": "lightgrey",
      "開発中": "lightgrey", // ja: in development
    }

    let childstrings = ""

    React.Children.forEach(props.children, (child, index) => {
      if (typeof child == "string") {
        childstrings += child
      }
    });

    const parts = childstrings.split(":")
    const left : string = shieldsIoEscape(parts[0])
    const right : string = shieldsIoEscape(parts.slice(1).join(":"))

    let color = props.color
    if (!color) {
      if (DEFAULT_COLORS.hasOwnProperty(left.toLowerCase())) {
        color = DEFAULT_COLORS[left.toLowerCase()]
      } else {
        color = "lightgrey"
      }
    }

    let badge_url = `https://img.shields.io/badge/${left}-${right}-${color}.svg`

    if (props.href) {
      return (
        <Link to={props.href}>
          <img src={badge_url} alt={childstrings} className="shield" />
        </Link>
      )
    } else {
      return (
        <img src={badge_url} alt={childstrings} className="shield" />
      )
    }
}

type TryItServer = 's1' | 's2' | 'xrplcluster' | 'testnet' | 'devnet' | 'testnet-clio' | 'devnet-clio'

export function TryIt(props: {
  method: string,
  server?: TryItServer
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  let use_server = "";
  if (props.server == "s1") {
    use_server = "?server=wss%3A%2F%2Fs1.ripple.com%2F"
  } else if (props.server == "s2") {
    use_server = "?server=wss%3A%2F%2Fs2.ripple.com%2F"
  } else if (props.server == "xrplcluster") {
    use_server = "?server=wss%3A%2F%2Fxrplcluster.com%2F"
  } else if (props.server == 'devnet') {
    use_server = "?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet') {
    use_server = "?server=wss%3A%2F%2Fs.altnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet-clio') {
    use_server = "?server=wss%3A%2F%2Fclio.altnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'devnet-clio') {
    use_server = "?server=wss%3A%2F%2Fclio.devnet.rippletest.net%3A51233%2F"
  }
  const to_path = `/resources/dev-tools/websocket-api-tool${use_server}#${props.method}`
  return (
    <Link style={{marginBottom: "1rem", textDecoration: "none"}} className="btn btn-primary btn-arrow" to={to_path} target="_blank" role="button">{translate("component.tryit", "Try it!")}</Link>
  )
}

export function TxExample(props: {
  txid: string,
  server?: TryItServer
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  let use_server = "";
  if (props.server == "s1") {
    use_server = "&server=wss%3A%2F%2Fs1.ripple.com%2F"
  } else if (props.server == "s2") {
    use_server = "&server=wss%3A%2F%2Fs2.ripple.com%2F"
  } else if (props.server == "xrplcluster") {
    use_server = "&server=wss%3A%2F%2Fxrplcluster.com%2F"
  } else if (props.server == 'devnet') {
    use_server = "&server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet') {
    use_server = "&server=wss%3A%2F%2Fs.altnet.rippletest.net%3A51233%2F"
  }
  
  const ws_req = `req=%7B%22id%22%3A%22example_tx_lookup%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22${props.txid}%22%2C%22binary%22%3Afalse%2C%22api_version%22%3A2%7D`
  const to_path = `/resources/dev-tools/websocket-api-tool?${ws_req}${use_server}`
  return (
    <Link style={{marginBottom: "1rem", textDecoration: "none"}} className="btn btn-primary btn-arrow" to={to_path} target="_blank" role="button">{translate("component.queryexampletx", "Query example transaction")}</Link>
  )
}

function shieldsIoEscape(s: string) {
  return s.trim()
    .replace(/-/g, '--')
    .replace(/_/g, '__')
    .replace(/%/g, '%25')
}

export function NotEnabled() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <span className="status not_enabled" title={translate("This feature is not currently enabled on the production XRP Ledger.")}><i className="fa fa-flask"></i></span>
  )
}

// Type definitions for amendments
type Amendment = {
  name: string;
  rippled_version: string;
  tx_hash?: string;
  consensus?: string;
  date?: string;
  id: string;
};

type AmendmentsResponse = {
  amendments: Amendment[];
};

// Generate amendments table with live mainnet data
export function AmendmentsTable() {
  const [amendments, setAmendments] = React.useState<Amendment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  React.useEffect(() => {
    const fetchAmendments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: AmendmentsResponse = await response.json();
        
        // Sort amendments table
        const sortedAmendments = data.amendments
          .sort((a: Amendment, b: Amendment) => {
            // Sort by status priority (lower number = higher priority)
            const getStatusPriority = (amendment: Amendment): number => {
              if (amendment.consensus) return 1; // Open for Voting
              if (amendment.tx_hash) return 2; // Enabled
            };

            const priorityA = getStatusPriority(a);
            const priorityB = getStatusPriority(b);

            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            // Sort by rippled_version (descending)
            if (a.rippled_version !== b.rippled_version) {
              return b.rippled_version.localeCompare(a.rippled_version, undefined, { numeric: true });
            }
            
            // Finally sort by name (ascending)
            return a.name.localeCompare(b.name);
          });
        
        setAmendments(sortedAmendments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch amendments');
      } finally {
        setLoading(false);
      }
    };

    fetchAmendments();
  }, []);

  // Fancy schmancy loading icon
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">{translate("amendment.loading", "Loading amendments...")}</span>
        </div>
        <div style={{ marginTop: '1rem' }}>{translate("amendment.loading", "Loading amendments...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>{translate("amendment.error", "Error loading amendments:")}:</strong> {error}
      </div>
    );
  }

  // Render amendment table
  return (
    <div className="md-table-wrapper">
      <table className="md">
        <thead>
          <tr>
            <th align="left" data-label="Name">{translate("amendment.table.name", "Name")}</th>
            <th align="left" data-label="Introduced">{translate("amendment.table.introduced", "Introduced")}</th>
            <th align="left" data-label="Status">{translate("amendment.table.status", "Status")}</th>
          </tr>
        </thead>
        <tbody>
          {amendments.map((amendment) => (
            <tr key={amendment.id}>
              <td align="left">
                <Link to={`#${amendment.name.toLowerCase()}`}>{amendment.name}</Link>
              </td>
              <td align="left">{amendment.rippled_version}</td>
              <td align="left">
                <AmendmentBadge amendment={amendment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AmendmentBadge(props: { amendment: Amendment }) {
  const [status, setStatus] = React.useState<string>('Loading...');
  const [href, setHref] = React.useState<string | undefined>(undefined);
  const [color, setColor] = React.useState<string>('blue');
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const enabledLabel = translate("amendment.status.enabled", "Enabled");
  const votingLabel = translate("amendment.status.openForVoting", "Open for Voting");

  React.useEffect(() => {
    const amendment = props.amendment;
    
    // Check if amendment is enabled (has tx_hash)
    if (amendment.tx_hash) {
      const enabledDate = new Date(amendment.date).toISOString().split('T')[0];
      setStatus(`${enabledLabel}: ${enabledDate}`);
      setColor('green');
      setHref(`https://livenet.xrpl.org/transactions/${amendment.tx_hash}`);
    } 
    // Check if amendment is currently being voted on (has consensus field)
    else if (amendment.consensus) {
      setStatus(`${votingLabel}: ${amendment.consensus}`);
      setColor('80d0e0');
      setHref(undefined); // No link for voting amendments
    }
  }, [props.amendment, enabledLabel, votingLabel]);

  // Split the status at the colon to create two-color badge
  const parts = status.split(':');
  const label = shieldsIoEscape(parts[0]);
  const message = shieldsIoEscape(parts.slice(1).join(':'));
  
  const badgeUrl = `https://img.shields.io/badge/${label}-${message}-${color}`;

  if (href) {
    return (
      <Link to={href} target="_blank">
        <img src={badgeUrl} alt={status} className="shield" />
      </Link>
    );
  }

  return <img src={badgeUrl} alt={status} className="shield" />;
}

export function AmendmentDisclaimer(props: {
  name: string,
  compact: boolean
}) {
  const [amendmentStatus, setStatus] = React.useState<Amendment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const link = () => <Link to={`/resources/known-amendments#${props.name.toLowerCase()}`}>{props.name}{ props.compact ? "" : " amendment"}</Link>

  React.useEffect(() => {
    const fetchAmendments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AmendmentsResponse = await response.json()
        console.log("data.amendments is:", data.amendments)

        let found_amendment = false
        for (const amendment of data.amendments) {
          if (amendment.name == props.name) {
            setStatus(amendment)
            found_amendment = true
            break
          }
        }
        if (!found_amendment) {
          throw new Error(`Couldn't find ${props.name} amendment in status table.`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch amendments');
      } finally {
        setLoading(false)
      }
    }
    fetchAmendments()
  }, [])

  if (loading) {
    return (
      <p><em>
      {translate("component.amendment-status.requires.1", "Requires the ")}{link()}{translate("component.amendment-status.requires.2", ".")}
      {" "}
      <span className="spinner-border text-primary" role="status">
        <span className="sr-only">{translate("amendment.loading_status", "Loading...")}</span>
      </span>
      </em></p>
    )
  }
  
  if (error) {
    return (
      <p><em>
      {translate("component.amendment-status.requires.1", "Requires the ")}{link()}{translate("component.amendment-status.requires.2", ".")}
      {" "}
      <span className="alert alert-danger" style={{display: "block"}}>
        <strong>{translate("amendment.error_status", "Error loading amendment status")}:</strong> {error}
      </span>
      </em></p>
    )
  }

  if (props.compact) {
    return (
      <>
        {link()}
        {" "}
        <AmendmentBadge amendment={amendmentStatus} />
      </>
    )
  }
  
  return (
    <p><em>(
      {
        amendmentStatus.date ? (
          <>
          {translate("component.amendment-status.added.1", "Added by the ")}{link()}
          {translate("component.amendment-status.added.2", ".")}
          {" "}
          <AmendmentBadge amendment={amendmentStatus} />
          </>
        ) : (
          <>
          {translate("component.amendment-status.requires.1", "Requires the ")}{link()}
          {translate("component.amendment-status.requires.2", ".")}
          {" "}
          <AmendmentBadge amendment={amendmentStatus} />
          </>
        )
      }
    )</em></p>
  )
}
