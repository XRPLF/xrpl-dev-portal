/**
 * Loading spinner.
 *
 * Eight ticks at 45deg intervals, with opacity descending clockwise from the
 * brightest at 12 o'clock — so the bright end reads as the head and the fade
 * behind it as the tail.
 *
 * ---------------------------------------------------------------------------
 * The animation is self-contained and needs no external stimulus.
 * ---------------------------------------------------------------------------
 * Unlike the arrow, which is driven by whatever context it lands in, a spinner
 * only ever means one thing. It animates on its own the moment it is rendered:
 * anything that shows this icon has already decided something is loading.
 *
 * The motion is defined in LoaderIcon.scss. Two things about it are
 * deliberate:
 *
 *   - It STEPS rather than sweeps. Eight discrete 45deg stops, so every tick
 *     lands exactly where the previous one was and the ring stays in register.
 *     A continuous rotation drifts the ticks off their own positions.
 *   - It turns COUNTER-CLOCKWISE, which is the direction the opacity ramp
 *     implies: the head moves away from the tail, not into it.
 *
 * Colour comes from context via currentColor; size scales with the label.
 *
 * ---------------------------------------------------------------------------
 * ACCESSIBILITY — this icon announces nothing. The consumer must.
 * ---------------------------------------------------------------------------
 * It is aria-hidden, like every icon here, so a screen reader gets NOTHING
 * from rendering it: to that user the loading state does not exist. Rendering
 * it on its own is a WCAG 2.2 SC 4.1.3 (Status Messages, AA) failure.
 *
 * Whatever shows this icon has to expose the state itself — either a live
 * region that announces it:
 *
 *   <span role="status">
 *     <LoaderIcon /> <span className="visually-hidden">Loading results</span>
 *   </span>
 *
 * or aria-busy on the region being replaced:
 *
 *   <div aria-busy={loading}>{loading ? <LoaderIcon /> : results}</div>
 *
 * One more thing the icon cannot decide for you: SC 2.2.2 (Pause, Stop, Hide,
 * Level A) applies to motion that starts on its own, runs past five seconds
 * AND sits alongside other content. A spinner that blocks interaction is
 * exempt as essential; one left ticking next to readable content is not, and
 * then it needs a way to pause, stop or hide it.
 */
export const LoaderIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bds-icon bds-icon-loader ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.5021 2 12.9091 2.40701 12.9091 2.90909V6.54545C12.9091 7.04753 12.5021 7.45455 12 7.45455C11.4979 7.45455 11.0909 7.04753 11.0909 6.54545V2.90909C11.0909 2.40701 11.4979 2 12 2Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 16.5455C12.5021 16.5455 12.9091 16.9525 12.9091 17.4545V21.0909C12.9091 21.593 12.5021 22 12 22C11.4979 22 11.0909 21.593 11.0909 21.0909V17.4545C11.0909 16.9525 11.4979 16.5455 12 16.5455Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.9299 4.9299C5.28492 4.57488 5.86053 4.57488 6.21555 4.9299L8.78828 7.50263C9.1433 7.85765 9.1433 8.43326 8.78828 8.78828C8.43326 9.1433 7.85765 9.1433 7.50263 8.78828L4.9299 6.21555C4.57488 5.86053 4.57488 5.28492 4.9299 4.9299Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2117 15.2117C15.5667 14.8567 16.1423 14.8567 16.4974 15.2117L19.0701 17.7844C19.4251 18.1395 19.4251 18.7151 19.0701 19.0701C18.7151 19.4251 18.1395 19.4251 17.7844 19.0701L15.2117 16.4974C14.8567 16.1423 14.8567 15.5667 15.2117 15.2117Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 11.4979 2.40701 11.0909 2.90909 11.0909H6.54545C7.04753 11.0909 7.45455 11.4979 7.45455 12C7.45455 12.5021 7.04753 12.9091 6.54545 12.9091H2.90909C2.40701 12.9091 2 12.5021 2 12Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5455 12C16.5455 11.4979 16.9525 11.0909 17.4545 11.0909H21.0909C21.593 11.0909 22 11.4979 22 12C22 12.5021 21.593 12.9091 21.0909 12.9091H17.4545C16.9525 12.9091 16.5455 12.5021 16.5455 12Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.78828 15.2117C9.1433 15.5667 9.1433 16.1423 8.78828 16.4974L6.21555 19.0701C5.86053 19.4251 5.28492 19.4251 4.9299 19.0701C4.57488 18.7151 4.57488 18.1395 4.9299 17.7844L7.50263 15.2117C7.85765 14.8567 8.43326 14.8567 8.78828 15.2117Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0701 4.9299C19.4251 5.28492 19.4251 5.86053 19.0701 6.21555L16.4974 8.78828C16.1423 9.1433 15.5667 9.1433 15.2117 8.78828C14.8567 8.43326 14.8567 7.85765 15.2117 7.50263L17.7844 4.9299C18.1395 4.57488 18.7151 4.57488 19.0701 4.9299Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
    </svg>
  );
};
