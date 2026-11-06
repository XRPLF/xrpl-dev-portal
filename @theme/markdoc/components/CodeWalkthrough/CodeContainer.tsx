// Local variant of @redocly/theme's CodeContainer, used by the shadowed
// CodePanel in this folder.
//
// Difference from the theme version: when a step becomes active, the code
// panel scrolls so that the first highlighted line sits level with the top of
// that step's blue bar, instead of only nudging the chunk into view. The
// effect is keyed on the step that owns the highlighted code, so prose-only
// steps leave the panel where it is.
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import type { JSX } from 'react';

import { CodeWalkthroughStepsContext } from '@redocly/theme/core/contexts';
import { CodeBlockContainer } from '@redocly/theme/components/CodeBlock/CodeBlockContainer';

export type CodeContainerProps = {
  highlightedCode: string;
  toolbar: JSX.Element;
  activeCodeStep: string | null;
};

// Keep the band clear of the panel header when the step has scrolled above it.
const TOP_PADDING_PX = 12;
// How long to wait for a click-triggered page scroll to settle before measuring.
const SETTLE_INTERVAL_MS = 120;
const SETTLE_MAX_MS = 1200;

export function CodeContainer({
  highlightedCode,
  toolbar,
  activeCodeStep,
}: CodeContainerProps): JSX.Element | null {
  const { lockObserver } = useContext(CodeWalkthroughStepsContext);
  const [isHovered, setIsHovered] = useState(false);
  const compRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeCodeStep) {
      return;
    }

    let cancelled = false;
    let lastStepTop: number | null = null;
    let waited = 0;

    const alignChunkWithStep = () => {
      if (cancelled || !compRef.current) {
        return;
      }

      const pre = compRef.current.querySelector('pre');
      if (!pre) {
        return;
      }

      const highlightedLines = Array.from(
        pre.querySelectorAll<HTMLElement>('span.line.highlighted'),
      );
      if (!highlightedLines.length) {
        return;
      }

      const stepTop = getActiveStepTop();

      // A click on a step smooth-scrolls the page to that step. Wait until the
      // step stops moving so the panel aligns with where the step ends up.
      const pageIsScrolling = lockObserver?.current === true;
      if (pageIsScrolling && stepTop !== lastStepTop && waited < SETTLE_MAX_MS) {
        lastStepTop = stepTop;
        waited += SETTLE_INTERVAL_MS;
        window.setTimeout(alignChunkWithStep, SETTLE_INTERVAL_MS);
        return;
      }

      const preRect = pre.getBoundingClientRect();
      const firstRect = highlightedLines[0].getBoundingClientRect();
      const lastRect = highlightedLines[highlightedLines.length - 1].getBoundingClientRect();

      const chunkOffset = firstRect.top - preRect.top + pre.scrollTop;
      const chunkHeight = lastRect.bottom - firstRect.top;

      // Distance from the top of the panel at which the chunk should start:
      // level with the step, but never above the panel and, when it fits,
      // never so low that the chunk is cut off at the bottom.
      const stepOffset = stepTop === null ? TOP_PADDING_PX : stepTop - preRect.top;
      const lowestStart = Math.max(pre.clientHeight - chunkHeight - TOP_PADDING_PX, 0);
      const startOffset = Math.min(Math.max(stepOffset, TOP_PADDING_PX), lowestStart);

      const maxScrollTop = Math.max(pre.scrollHeight - pre.clientHeight, 0);
      const top = Math.min(Math.max(chunkOffset - startOffset, 0), maxScrollTop);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      pre.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    // Let the highlighted markup land in the DOM first.
    const timer = window.setTimeout(alignChunkWithStep, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeCodeStep, lockObserver]);

  return (
    <CodeContainerWrapper
      data-component-name="Markdoc/CodeWalkthrough/CodeContainer"
      ref={compRef}
      $hideCodeColors={!isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CodeBlockContainer dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      {toolbar}
    </CodeContainerWrapper>
  );
}

/**
 * Viewport top of the active step's wrapper (the element that carries the blue
 * bar). Each CodeStep renders its Marker immediately before its wrapper, and
 * the active marker is the only one flagged data-step-active="true".
 */
function getActiveStepTop(): number | null {
  const marker = document.querySelector<HTMLElement>(
    '.code-walkthrough [data-component-name="Marker/Marker"][data-step-active="true"]',
  );
  const stepWrapper = marker?.nextElementSibling as HTMLElement | null | undefined;

  if (!stepWrapper || !stepWrapper.classList.contains('code-step-wrapper')) {
    return null;
  }

  return stepWrapper.getBoundingClientRect().top;
}

const CodeContainerWrapper = styled.div<{ $hideCodeColors: boolean }>`
  position: relative;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;

  pre {
    display: grid;
    grid-auto-rows: min-content;
    min-height: 0;
    overflow: scroll;
    margin: 0 !important;
    height: 100%;
    padding-left: 0 !important;

    span.line::before {
      color: var(--code-panel-line-numbering-color);
    }
    ${({ $hideCodeColors }) =>
      $hideCodeColors &&
      css`
        .line.greyed-out {
          color: var(--text-color-helper) !important;
          * {
            color: var(--text-color-helper) !important;
          }
        }
      `}
  }
`;
