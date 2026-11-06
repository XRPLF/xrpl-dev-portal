// Local variant of @redocly/theme's useCodePanel hook, used by the shadowed
// CodePanel in this folder.
//
// Difference from the theme version: a step that has no @chunk in any file
// (a prose-only step such as "Connect to the XRP Ledger Mainnet") no longer
// resets the panel to the first file with every line greyed out. Instead the
// panel keeps showing the last step that did have code, so the reader's place
// in the file is preserved until the next step that highlights code.
import { useContext, useCallback, useEffect, useState, useMemo } from 'react';

import type {
  CodeWalkthroughFile,
  CodeWalkthroughNode,
  CodeWalkthroughConditionsObject,
} from '@redocly/theme/core/types';

import {
  CodeWalkthroughControlsStateContext,
  CodeWalkthroughStepsContext,
} from '@redocly/theme/core/contexts';
import { useThemeHooks } from '@redocly/theme/core/hooks';

const ACTIVE_FILE_MOCK: CodeWalkthroughFile = {
  content: [],
  path: '',
  basename: '',
  metadata: { steps: [] },
  language: '',
};

export function useCodePanel(files: CodeWalkthroughFile[]) {
  const { activeStep } = useContext(CodeWalkthroughStepsContext);

  const { areConditionsMet, populateInputsWithValue } = useContext(
    CodeWalkthroughControlsStateContext,
  );

  const { useCodeHighlight } = useThemeHooks();
  const { highlight } = useCodeHighlight();

  const findFileIndexByName = useCallback(
    (name: string) => {
      return files.findIndex((file) => file.path === name);
    },
    [files],
  );

  const findFileIndexByStepId = useCallback(
    (id: string) => files.findIndex((file) => file.metadata.steps.includes(id)),
    [files],
  );

  // The most recent active step that has a chunk in one of the files.
  const [lastCodeStep, setLastCodeStep] = useState<string | null>(null);
  const activeStepHasCode = activeStep != null && findFileIndexByStepId(activeStep) !== -1;
  const activeCodeStep = activeStepHasCode ? activeStep : lastCodeStep;

  useEffect(() => {
    if (activeStepHasCode) {
      setLastCodeStep(activeStep);
    }
  }, [activeStep, activeStepHasCode]);

  const codeStepFileIndex = activeCodeStep ? findFileIndexByStepId(activeCodeStep) : -1;
  const initialActiveFileIndex = codeStepFileIndex !== -1 ? codeStepFileIndex : 0;

  const [activeFileIndex, setActiveFileIndex] = useState(initialActiveFileIndex);

  useEffect(() => {
    setActiveFileIndex(initialActiveFileIndex);
  }, [initialActiveFileIndex, activeCodeStep, files]);

  const handleTabSwitch = useCallback(
    (name: string) => {
      const index = findFileIndexByName(name);

      if (index !== -1) {
        setActiveFileIndex(index);
      }
    },
    [findFileIndexByName],
  );

  const activeFile =
    files[activeFileIndex] ||
    // Fallback to default. Needed when switching from language with more files to a language with less files
    files[initialActiveFileIndex] ||
    // Final fallback for dev mode when no files were added yet
    ACTIVE_FILE_MOCK;

  const highlightedCode = useMemo(() => {
    const { highlightedLines, code, isWholeFileSelected } = getRenderableCode(
      activeFile,
      activeCodeStep,
      areConditionsMet,
      populateInputsWithValue,
    );

    return highlight(code, activeFile.language, {
      withLineNumbers: true,
      // Shiki transformerMetaHighlight meta to highlight lines
      // If the whole file is selected for a step, do not apply highlighting
      highlight: isWholeFileSelected ? '' : `{${Array.from(highlightedLines).join(',')}}`,
      customTransformer: {
        // Add greyed-out class to lines that are not highlighted
        line(hast, number) {
          if (!highlightedLines.has(number)) {
            this.addClassToHast(hast, 'greyed-out');
          }
        },
      },
    });
  }, [activeFile, activeCodeStep, highlight, areConditionsMet, populateInputsWithValue]);

  return { activeFile, handleTabSwitch, highlightedCode, activeCodeStep } as const;
}

function getRenderableCode(
  activeFile: CodeWalkthroughFile,
  activeStep: string | null,
  areConditionsMet: (conditions: CodeWalkthroughConditionsObject) => boolean,
  populateInputsWithValue: (node: string) => string,
): {
  highlightedLines: Set<number>;
  code: string;
  isWholeFileSelected: boolean;
} {
  const codeLines = activeFile.content.flatMap((node) =>
    getCodeLinesFromNode(node, activeStep, areConditionsMet, populateInputsWithValue),
  );

  const codeLinesContent: string[] = [];
  const highlightedLines = new Set<number>();

  codeLines.forEach(({ lineContent, highlighted }, idx) => {
    codeLinesContent.push(lineContent);

    if (highlighted) {
      highlightedLines.add(idx + 1);
    }
  });

  return {
    highlightedLines,
    code: codeLinesContent.join('\n'),
    isWholeFileSelected: highlightedLines.size === codeLinesContent.length,
  };
}

/**
 * Convert code node to code line objects with content to render and their highlighted status
 */
function getCodeLinesFromNode(
  node: CodeWalkthroughNode,
  activeStep: string | null,
  areConditionsMet: (conditions: CodeWalkthroughConditionsObject) => boolean,
  populateInputsWithValue: (node: string) => string,
  parentHighlighted: boolean = false,
): { lineContent: string; highlighted: boolean }[] {
  if (typeof node === 'string') {
    const replacedNode = populateInputsWithValue(node);

    return [{ lineContent: replacedNode, highlighted: parentHighlighted }];
  } else {
    const shouldRenderChunk = areConditionsMet(node.condition);

    const isHighlighted =
      parentHighlighted ||
      (activeStep != null &&
        node.condition.steps.length > 0 &&
        node.condition.steps.includes(activeStep));

    return shouldRenderChunk
      ? node.children.flatMap((child) =>
          getCodeLinesFromNode(
            child,
            activeStep,
            areConditionsMet,
            populateInputsWithValue,
            isHighlighted,
          ),
        )
      : [];
  }
}
