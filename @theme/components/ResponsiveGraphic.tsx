import type { Node } from '@markdoc/markdoc'

/*
 * Display two graphics (which link to a full version of the desktop version)
 * with one optimized for mobile display and one optimized for desktop.
 */
export function ResponsiveGraphic(props: {
  alt: string
  desktop: string
  mobile: string
}) {
    // Note: <a> is needed here, not <Link> since <Link> will produce 404s in
    // translated pages by prefixing the path to the asset incorrectly.
    return (
    <a href={props.desktop}>
        <img src={props.desktop} alt={props.alt} className="d-none d-md-block" />
        <img src={props.mobile} alt={props.alt} className="d-block d-md-none" />
    </a>
)}

export function ResposiveGraphicForLlms(node: Node) {
    return `![${node.attributes.alt}](${node.attributes.desktop})`
}
