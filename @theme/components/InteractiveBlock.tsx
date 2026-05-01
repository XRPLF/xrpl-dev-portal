// Component for {% interactive-block %} markdoc tag. Used in legacy interactive
// tutorials; not recommended for new tutorials.

import * as React from 'react'
import { useLocation } from 'react-router-dom'
import dynamicReact from '@markdoc/markdoc/dist/react'
import { idify } from '../helpers'

export default function InteractiveBlock(props: {
  children: React.ReactNode
  label: string
  steps: string[]
}) {
  const stepId = idify(props.label)
  const { pathname } = useLocation()

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
              const iterStepId = idify(step).toLowerCase()
              let className = `breadcrumb-item bc-${iterStepId}`
              if (idx > 0) className += ' disabled'
              if (iterStepId === stepId) className += ' current'
              return (
                <li className={className} key={iterStepId}>
                  <a href={`#interactive-${iterStepId}`}>{step}</a>
                </li>
                )
            })}
          </ul>
        </div>
        <div className="interactive-block-ui">{dynamicReact(props.children, React, {})}</div>
      </div>
    </div>
  )
}
