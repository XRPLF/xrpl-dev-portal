import * as React from 'react';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { usePageSharedData } from '@portal/hooks';
import { Link } from '@portal/Link';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

export function IndexPageItems() {
  const data = usePageSharedData('index-page-items') as any[];
  return (
    <div className="landing page-docs page-docs-index overflow-hidden styled-page">
      <div className="content">
        <div className="children-display">
          <ul>
            {data.map((item: any) => (
              <li className="level-1">
                <Link to={item.slug}>{item.title}</Link>
                <p className='class="blurb child-blurb'>{item.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function StartStep(props: { children: React.ReactNode; stepIdx: number; steps: string[] }) {
  const stepLabel = props.steps[props.stepIdx];
  const stepId = slugify(stepLabel);

  return (
    <div className="interactive-block" id={'interactive-' + stepId}>
      <div className="interactive-block-inner">
        <div className="breadcrumbs-wrap">
          <ul
            className="breadcrumb tutorial-step-crumbs"
            id={'bc-ul-' + stepId}
            data-steplabel={stepLabel}
            data-stepid={stepId}
          >
            {props.steps.map((step, idx) => {
              const iterStepId = slugify(step).toLowerCase();
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
