import * as React from 'react';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { Link } from '@redocly/theme/components/Link/Link';
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { idify } from '../helpers';

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

function shieldsIoEscape(s: string) {
  return s.trim().replaceAll('-', '--').replaceAll('_', '__')
}

export function NotEnabled() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <span className="status not_enabled" title={translate("This feature is not currently enabled on the production XRP Ledger.")}><i className="fa fa-flask"></i></span>
  )
}
