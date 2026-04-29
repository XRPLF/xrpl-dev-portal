// Component for {% code-page-name /%} Markdoc tag.
// Returns the current page title in monospace (code) font.
// Useful in includes / templates that may be reused across pages.

export default function CodePageName(props: {
  name: string
}) {
    return (
        <code>{props.name}</code>
    )
}
