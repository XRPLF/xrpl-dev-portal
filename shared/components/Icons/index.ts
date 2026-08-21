// Public surface of the icon set. Import from here, not from the individual
// files, so the layout below can change without touching consumers.
//
// Every icon shares one contract, described in full in shared.scss:
//   - it renders at 1em and inherits `color`, so size and colour come from
//     whatever it sits in and never from the icon
//   - it carries the `xrpl-icon` class, which is what the motion contract and
//     the PurgeCSS safelist key on
//   - it is aria-hidden by default; a control whose only content is an icon
//     must supply its own accessible name
//
// Adding an icon means adding it here too, otherwise consumers cannot reach it.

// -----------------------------------------------------------------------------
// XRPL icons — drawn by design, and the ones that carry motion.
// -----------------------------------------------------------------------------
// These two respond to --xrpl-icon-engaged: the arrow advances and sheds its
// tail. They are drawn as separate head and tail elements on purpose; a
// single-path replacement renders correctly and silently loses the animation.
//
// A CSS container drives them with the `xrpl-icon-engaged` mixin. React drives
// them with the optional `engaged` prop, which writes nothing when omitted —
// see the prop's own docs for why `false` and `undefined` differ.
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
