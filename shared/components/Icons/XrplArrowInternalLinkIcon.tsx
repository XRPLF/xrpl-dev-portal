/**
 * XRPL internal-link arrow.
 *
 * Drawn as two elements, not one path, so the tail can shrink while the head
 * advances. Flattening it renders correctly and silently loses the animation.
 *
 * Fully engaged the tail has zero width and only the head is left — design's
 * arrowhead_internal, unmodified. The tail overlaps into the head rather than
 * meeting its leading edge, which stops a V-shaped gap opening at the
 * centreline as it retracts.
 *
 * Motion is in XrplArrowInternalLinkIcon.scss, the trigger contract in shared.scss.
 * 
 * Every moving part is INSIDE the SVG: the <g> travels and the tail scales,
 * both in viewBox user units. The <svg> element itself is never transformed, so
 * the icon occupies exactly the same box whether it is animating or not and
 * cannot disturb the layout around it.
 */
export const XrplArrowInternalLinkIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  engaged?: boolean; // optional: drive the icon's motion from React state
}> = ({ className = "", style, engaged }) => {
  const engagedStyle =
    engaged === undefined
      ? style
      : ({
          ...style,
          "--xrpl-icon-engaged": engaged ? 1 : 0,
        } as React.CSSProperties);

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`xrpl-icon xrpl-icon-arrow ${className}`.trim()}
      style={engagedStyle}
      aria-hidden="true"
      focusable="false"
    >
      <g className="xrpl-icon-arrow__travel">
        <path
          className="xrpl-icon-arrow__tail"
          d="M0.688256 11.3117L20 11.3094L20 13.3092L0.688256 13.3115Z"
          fill="currentColor"
        />
        <path
          className="xrpl-icon-arrow__head"
          d="M22.3116 12.3116L13.1842 21.4391L11.77 20.0249L19.5 12.3116L18.4814 11.3096L11.7713 4.59973L13.1855 3.18552L22.3116 12.3116Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
