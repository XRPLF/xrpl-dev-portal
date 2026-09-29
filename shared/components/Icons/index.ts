// Public surface of the icon set. Import from here, not from the individual
// files, so the layout below can change without touching consumers.
//
// Every icon shares one contract, described in full in shared.scss:
//   - it renders at 1em and inherits `color`, so size and colour come from
//     whatever it sits in and never from the icon
//   - it carries the `bds-icon` class, which is what the motion contract and
//     the PurgeCSS safelist key on
//   - it is aria-hidden by default; a control whose only content is an icon
//     must supply its own accessible name
//   - it takes `className` and `style`, and nothing else. The two link arrows
//     add `engaged`; that is the only difference in the set.
//
// Adding an icon means adding it here too, otherwise consumers cannot reach it.

// -----------------------------------------------------------------------------
// XRPL icons — drawn by design, and the ones that carry motion.
// -----------------------------------------------------------------------------
// These two respond to --bds-icon-engaged: the arrow advances and sheds its
// tail. They are drawn as separate head and tail elements on purpose; a
// single-path replacement renders correctly and silently loses the animation.
//
// A CSS container drives them with the `bds-icon-engaged` mixin. Where the
// trigger is React state instead, there is no pseudo-class to hang the mixin
// off, so the arrows take an optional `engaged` prop.
//
// Omitted and `false` are NOT the same, and the difference is a trap:
//
//   <Icon />                  nothing written; CSS is in sole charge
//   <Icon engaged={false} />  writes an inline 0, which outranks every
//                             stylesheet rule and so pins the icon still —
//                             defeating any hover rule on the container
//
// So `engaged={isActive}` on an icon that should also move on hover kills the
// hover. Use `engaged={isActive || undefined}` to have both.
export { XrplArrowInternalLinkIcon } from "./XrplArrowInternalLinkIcon";
export { XrplArrowExternalLinkIcon } from "./XrplArrowExternalLinkIcon";

// Self-driving: it spins whenever it is rendered, with no property to set.
// It does NOT announce itself — it is aria-hidden like the rest, so whatever
// renders it must expose the loading state through a live region or aria-busy.
// See the accessibility note in LoaderIcon.tsx.
export { LoaderIcon } from "./LoaderIcon";

export { PlusIcon } from "./PlusIcon";

// -----------------------------------------------------------------------------
// Material icons — third-party artwork, static.
// -----------------------------------------------------------------------------
// Fourteen icons, Google LLC, Apache-2.0; see LICENSE at the repository root,
// and the header of each file for the upstream source and the modifications
// made to it. None of these animate: they are stock artwork drawn as a single
// path, so there is no separate tail to retract.
export { MaterialArrowBackIcon } from "./MaterialArrowBackIcon";
export { MaterialArrowDownwardIcon } from "./MaterialArrowDownwardIcon";
export { MaterialArrowForwardIcon } from "./MaterialArrowForwardIcon";
export { MaterialArrowUpwardIcon } from "./MaterialArrowUpwardIcon";
export { MaterialDownloadIcon } from "./MaterialDownloadIcon";
export { MaterialKeyboardArrowDownIcon } from "./MaterialKeyboardArrowDownIcon";
export { MaterialKeyboardArrowLeftIcon } from "./MaterialKeyboardArrowLeftIcon";
export { MaterialKeyboardArrowRightIcon } from "./MaterialKeyboardArrowRightIcon";
export { MaterialKeyboardArrowUpIcon } from "./MaterialKeyboardArrowUpIcon";
export { MaterialNorthEastIcon } from "./MaterialNorthEastIcon";
export { MaterialNorthWestIcon } from "./MaterialNorthWestIcon";
export { MaterialSaveAltIcon } from "./MaterialSaveAltIcon";
export { MaterialSouthEastIcon } from "./MaterialSouthEastIcon";
export { MaterialSouthWestIcon } from "./MaterialSouthWestIcon";
