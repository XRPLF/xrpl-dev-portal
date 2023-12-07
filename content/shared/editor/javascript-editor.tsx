import { javascript } from '@codemirror/lang-javascript'
import { Editor, EditorWrapperProps } from './editor'

export const JavascriptEditor = ({value, onChange, readOnly }: EditorWrapperProps) => {
    return <Editor
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        extensions={
            [
                javascript(),
            ]
        }
    />
}
