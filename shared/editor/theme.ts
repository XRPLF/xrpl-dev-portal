import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';

const blue200 = '#B2E0FF'
const blue500 = '#19A3FF'
const gray500 = '#838386'
const gray800 = '#232325'
const green700 = '#28B86A'
const orange500 = '#FF6719'
const white = '#FFFFFF'

export const editorXRPLTheme = createTheme({
    theme: 'dark',
    settings: {
      background: gray800,
      backgroundImage: '',
      fontFamily: 'Space Mono',
      foreground: white,
      caret: gray500,
      lineHighlight: gray800,
      gutterBackground: gray800,
    },
    styles: [
      { tag: [t.attributeName, t.attributeValue], color: white },
      { tag: t.propertyName, color: green700 },
      { tag: t.comment, color: gray500 },
      { tag: t.variableName, color: white },
      { tag: [t.string, t.special(t.brace)], color: green700 },
      { tag: t.number, color: blue500 },
      { tag: t.atom, color: orange500 },
      { tag: t.bool, color: orange500 },
      { tag: t.null, color: orange500 },
      { tag: t.keyword, color: orange500 },
      { tag: t.operator, color: white },
      { tag: t.definition(t.typeName), color: white },
      { tag: t.tagName, color: white },
      { tag: [t.brace, t.bracket], color: white },
      { tag: t.link, color: blue200 }
    ],
});
