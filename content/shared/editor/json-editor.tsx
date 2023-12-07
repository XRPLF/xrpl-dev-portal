import { linter, lintGutter } from '@codemirror/lint'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { Extension } from '@codemirror/state'

import { Editor, EditorWrapperProps } from './editor'

export const JsonEditor = ({value, onChange, readOnly, lineNumbers }: EditorWrapperProps) => {
    const extensions: Extension[] = [
        json()
    ]

    if(!readOnly) {
        extensions.push(
            lintGutter(),
            linter(jsonParseLinter())
        )
    }

    return <Editor
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        extensions={extensions}
        lineNumbers={lineNumbers}
    />
}
