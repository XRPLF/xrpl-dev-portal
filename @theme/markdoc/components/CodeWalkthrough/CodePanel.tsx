// Shadows @redocly/theme/markdoc/components/CodeWalkthrough/CodePanel.
//
// Identical to the theme version except that it uses the local
// use-code-panel hook and CodeContainer in this folder, which keep the panel
// on the last code step during prose-only steps and align the highlighted
// chunk with the active step. See those files for details.
import React, { useContext } from 'react';
import styled from 'styled-components';

import type { JSX } from 'react';
import type { CodeWalkthroughFile } from '@redocly/theme/core/types';

import { CodeWalkthroughControlsStateContext } from '@redocly/theme/core/contexts';
import { CodePanelHeader } from '@redocly/theme/markdoc/components/CodeWalkthrough/CodePanelHeader';
import { CodePanelPreview } from '@redocly/theme/markdoc/components/CodeWalkthrough/CodePanelPreview';
import { CodePanelToolbar } from '@redocly/theme/markdoc/components/CodeWalkthrough/CodePanelToolbar';

import { useCodePanel } from './use-code-panel';
import { CodeContainer } from './CodeContainer';

export type CodePanelProps = {
  files: CodeWalkthroughFile[];
  downloadAssociatedFiles: CodeWalkthroughFile[];
  preview: React.ReactNode[];
};

export function CodePanel({
  files,
  downloadAssociatedFiles,
  preview,
}: CodePanelProps): JSX.Element | null {
  const { activeFile, handleTabSwitch, highlightedCode, activeCodeStep } = useCodePanel(files);
  const { handleDownloadCode } = useContext(CodeWalkthroughControlsStateContext);

  return (
    <CodePanelWrapper data-component-name="Markdoc/CodeWalkthrough/CodePanel">
      {preview ? (
        <CodePanelPreview>
          {preview.map((element, idx) => (
            <React.Fragment key={idx}>{element}</React.Fragment>
          ))}
        </CodePanelPreview>
      ) : null}
      <CodePanelHeader
        files={files}
        activeTabName={activeFile?.path || ''}
        handleTabSwitch={handleTabSwitch}
        onDownloadCode={() => handleDownloadCode([...files, ...downloadAssociatedFiles])}
      />
      <CodeContainer
        key={activeFile?.path || ''}
        highlightedCode={highlightedCode}
        activeCodeStep={activeCodeStep}
        toolbar={<CodePanelToolbar file={activeFile} />}
      />
    </CodePanelWrapper>
  );
}

const CodePanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;

  min-height: 144px;
  min-width: 0;
  height: 100%;
  word-wrap: break-word;
  margin-top: var(--spacing-xl);

  background-color: var(--code-panel-bg-color);
  border: 1px solid var(--code-panel-border-color);
  border-radius: var(--code-panel-border-radius);
  overflow: clip;
  --code-block-max-height: calc(100vh - var(--navbar-stack-height) - 2 * var(--spacing-xl));
  height: calc(100vh - var(--navbar-stack-height) - 2 * var(--spacing-xl));
  position: sticky;
  top: calc(var(--navbar-stack-height) + var(--spacing-xl));
`;
