import CodeMirror from '@uiw/react-codemirror';
import { ViewUpdate } from '@codemirror/view'
import { Extension } from '@codemirror/state'

import { editorXRPLTheme } from './theme'

export interface EditorWrapperProps {
    value: string
    onChange?: (value: string, viewUpdate: ViewUpdate) => void
    readOnly?: boolean
    lineNumbers?: boolean
}

export interface EditorProps extends EditorWrapperProps {
    extensions: Extension[]
}

export const Editor = ({value, extensions, onChange = () => {}, readOnly=false, lineNumbers=true }: EditorProps) => {
    return (
        <CodeMirror
          value={value}
          theme={editorXRPLTheme}
          extensions={[...extensions]}
          onChange={onChange}
          basicSetup={{
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            lineNumbers
          }}
        />
    );
}
