import React, { useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import styled from 'styled-components';

import type { CodeWalkthroughAttr } from '@redocly/config';

import {
  CodeWalkthroughStepsContext,
  CodeWalkthroughControlsStateContext,
} from '@redocly/theme/core/contexts';
import { CodePanel } from '@redocly/theme/markdoc/components/CodeWalkthrough/CodePanel';
import { useCodeWalkthrough } from '@redocly/theme/core/hooks';
import {
  CodeFilters,
  GetFilterState,
} from '@redocly/theme/markdoc/components/CodeWalkthrough/CodeFilters';

export type CodeWalkthroughProps = PropsWithChildren<CodeWalkthroughAttr>;

const COMPACT_VIEWPORT = '(max-width: 767px)';

function useCompactWalkthrough(): boolean {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COMPACT_VIEWPORT).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(COMPACT_VIEWPORT);
    const onChange = () => setIsCompact(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isCompact;
}

export function CodeWalkthrough({ children, steps, preview, ...attributes }: CodeWalkthroughProps) {
  const root = useRef<HTMLDivElement>(null);
  const isCompact = useCompactWalkthrough();

  const { controlsState, stepsState, files, downloadAssociatedFiles } = useCodeWalkthrough({
    steps,
    attributes,
    root,
  });
  const { activeFilters, getControlState, changeControlState } = controlsState;
  const { filtersElementRef, lockObserver } = stepsState;

  useEffect(() => {
    if (lockObserver) {
      lockObserver.current = isCompact;
    }
  }, [isCompact, lockObserver]);

  const stepsStateForViewport = useMemo(() => {
    if (!isCompact || !lockObserver) {
      return stepsState;
    }

    return {
      ...stepsState,
      lockObserver: {
        get current() {
          return true;
        },
        set current(_value: boolean) {
          lockObserver.current = true;
        },
      },
    };
  }, [isCompact, lockObserver, stepsState]);

  return (
    <CodeWalkthroughStepsContext.Provider value={stepsStateForViewport}>
      <CodeWalkthroughControlsStateContext.Provider value={controlsState}>
        <CodeWalkthroughWrapper
          ref={root}
          className="code-walkthrough"
          data-component-name="Markdoc/CodeWalkthrough/CodeWalkthrough"
          data-compact={isCompact ? 'true' : 'false'}
        >
          <DocsPanel>
            <CodeFilters
              filters={activeFilters}
              getFilterState={getControlState as GetFilterState}
              handleFilterSelect={changeControlState}
              filtersElementRef={filtersElementRef}
            />
            <ContentWrapper>{children}</ContentWrapper>
          </DocsPanel>

          <CodePanel
            files={files}
            downloadAssociatedFiles={downloadAssociatedFiles}
            preview={preview}
          />
        </CodeWalkthroughWrapper>
      </CodeWalkthroughControlsStateContext.Provider>
    </CodeWalkthroughStepsContext.Provider>
  );
}

const CodeWalkthroughWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 4fr 6fr;

  padding-right: var(--spacing-xl);

  border-top: 1px solid var(--border-color-secondary);
  border-bottom: 1px solid var(--border-color-secondary);

  &:first-child {
    border-top: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &[data-compact='true'] {
    grid-template-columns: 1fr;
    padding-right: 0;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    padding-right: 0;
  }
`;

const DocsPanel = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 0;
  min-height: calc(100vh - var(--navbar-height));

  padding-top: var(--spacing-xl);
  padding-right: var(--spacing-xs);
  padding-bottom: calc(var(--spacing-xs) + var(--spacing-xl));
  gap: var(--spacing-xl);

  &:has([data-component-name='Markdoc/CodeWalkthrough/CodeFilters']) {
    padding-top: 0;
  }

  [data-compact='true'] & {
    min-height: auto;
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;

  min-height: 0;
  max-width: var(--md-content-max-width);

  & > *:not(.code-step-wrapper) {
    padding-left: var(--spacing-xl);
  }
  & > ul:not(.code-step-wrapper),
  & > ol:not(.code-step-wrapper) {
    padding-left: calc(var(--spacing-xl) + var(--md-list-left-padding));
  }

  overflow-y: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  && > *:first-child {
    margin-top: 0;
  }

  [data-compact='true'] & {
    overflow: visible;
  }
`;
