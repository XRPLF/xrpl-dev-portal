export { Link } from './Link';
export type { LinkProps, LinkIntention, LinkContext, LinkVariation, LinkSize } from './Link';

// Legacy component, kept intact but unused in production. See legacy/BdsLink.md.
export { BdsLink } from './legacy/BdsLink';
export type {
  BdsLinkProps,
  LinkVariant as LegacyLinkVariant,
  LinkSize as LegacyLinkSize,
  LinkIconType as LegacyLinkIconType,
} from './legacy/BdsLink';

export { LinkArrow } from './legacy/LinkArrow';
export type { LinkArrowProps, LinkArrowVariant, LinkArrowSize } from './legacy/LinkArrow';
