/**
 * XRPL external-link arrow.
 *
 * Same two-part construction as the internal arrow: the head is the corner
 * bracket (arrowhead_external), the tail the diagonal that retracts into it
 * until gone. The tail runs 1.4 units past the bracket's inner corner along its
 * own axis, closing the triangular gap that stopping at the corner leaves.
 *
 * Travel is horizontal only. The artwork points up-right, but advancing it that
 * way drags the mark off its baseline and reads as drifting, not advancing.
 *
 * Motion is in XrplArrowExternalLinkIcon.scss, the trigger contract in shared.scss.
 * 
 * Every moving part is INSIDE the SVG: the <g> travels and the tail scales,
 * both in viewBox user units. The <svg> element itself is never transformed, so
 * the icon occupies exactly the same box whether it is animating or not and
 * cannot disturb the layout around it.
 */
export const XrplArrowExternalLinkIcon: React.FC<{
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
      className={`xrpl-icon xrpl-icon-arrow-out ${className}`.trim()}
      style={engagedStyle}
      aria-hidden="true"
      focusable="false"
    >
      <g className="xrpl-icon-arrow-out__travel">
        <path
          className="xrpl-icon-arrow-out__tail"
          d="M4 18.6L17 5.6L18.4 7L5.4 20Z"
          fill="currentColor"
        />
        <path
          className="xrpl-icon-arrow-out__head"
          d="M17 7H15.6H9V5H19V15H17V7Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
