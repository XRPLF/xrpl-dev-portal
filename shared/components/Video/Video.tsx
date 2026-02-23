import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { DesignConstrainedVideoProps } from 'shared/utils/types';

/** Native HTML video source */
export type VideoSourceNative = {
  type: 'native';
  props: DesignConstrainedVideoProps;
};

/**
 * Embed source - raw HTML iframe code from YouTube/Vimeo/Wistia
 *
 * ⚠️ **SECURITY WARNING**: embedCode uses regex-based parsing which can be bypassed
 * with malformed HTML (e.g., newlines in attributes, missing quotes, unusual spacing).
 * **Always prefer `embedUrl` over `embedCode` when possible.**
 *
 * Only use embedCode when:
 * - The HTML comes from a trusted source you control
 * - You cannot extract the URL beforehand
 *
 * The component validates against TRUSTED_EMBED_ORIGINS, but regex parsing is not
 * foolproof against all HTML variations.
 */
export type VideoSourceEmbedCode = {
  type: 'embed';
  embedCode: string;
  embedUrl?: never;
};

/**
 * Embed source - direct embed URL (safer, preferred)
 *
 * ✅ **RECOMMENDED**: This is the preferred and safer method for embedding videos.
 * Directly validates the URL against TRUSTED_EMBED_ORIGINS without HTML parsing.
 */
export type VideoSourceEmbedUrl = {
  type: 'embed';
  embedUrl: string;
  embedCode?: never;
};

export type VideoSource =
  | VideoSourceNative
  | VideoSourceEmbedCode
  | VideoSourceEmbedUrl;

export interface VideoProps {
  /**
   * Video source: native HTML video or embed (YouTube/Vimeo/Wistia)
   *
   * **For embeds, prefer `embedUrl` over `embedCode`:**
   * - ✅ `embedUrl`: Direct URL validation (safer, recommended)
   * - ⚠️ `embedCode`: Regex-based HTML parsing (can be bypassed, use with caution)
   */
  source: VideoSource;
  /** Optional cover image - when provided, video shows in modal on click */
  coverImage?: {
    src: string;
    alt: string;
  };
  /** Aspect ratio for container (default 16/9) */
  aspectRatio?: '16/9' | '4/3' | '1/1';
  /** Additional className for container */
  className?: string;
}

/** Trusted embed origins for embedCode sanitization */
const TRUSTED_EMBED_ORIGINS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  'fast.wistia.net',
  'fast.wistia.com',
];

function isTrustedEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return TRUSTED_EMBED_ORIGINS.some(
      (origin) => host === origin || host.endsWith('.' + origin)
    );
  } catch {
    return false;
  }
}

/**
 * Extract iframe src from embed code if from trusted origin
 *
 * ⚠️ **SECURITY WARNING**: This regex-based parser is NOT foolproof and can be bypassed
 * with malformed HTML. Known bypass vectors include:
 * - Newlines or unusual whitespace in attributes
 * - Missing or unusual quote characters
 * - HTML comments or CDATA sections
 * - Encoded characters or HTML entities
 *
 * This function should only be used as a fallback when embedUrl is not available.
 * Always prefer using embedUrl directly when possible.
 *
 * @param embedCode - Raw HTML iframe embed code (from trusted sources only)
 * @returns Extracted URL if valid and from trusted origin, null otherwise
 */
function extractEmbedUrlFromCode(embedCode: string): string | null {
  const iframeMatch = embedCode.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (!iframeMatch) return null;
  const url = iframeMatch[1];
  return isTrustedEmbedUrl(url) ? url : null;
}

export const Video = React.forwardRef<HTMLDivElement, VideoProps>(
  (props, ref) => {
    const {
      source,
      coverImage,
      aspectRatio = '16/9',
      className,
    } = props;

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    const closeModal = useCallback(() => {
      setIsModalOpen(false);
    }, []);

    useEffect(() => {
      if (!isModalOpen) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, closeModal]);

    // Focus trap: capture previous focus, focus close button, restore on close
    useEffect(() => {
      if (isModalOpen) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();
      } else {
        previousActiveElementRef.current?.focus();
      }
    }, [isModalOpen]);



    const renderVideoContent = () => {
      if (source.type === 'native') {
        return (
          <video
            {...source.props}
            className="bds-video__element"
          />
        );
      }

      // Embed: prefer embedUrl, else extract from embedCode (trusted origins only)
      let embedUrl: string | null = null;

      if ('embedUrl' in source && source.embedUrl) {
        embedUrl = isTrustedEmbedUrl(source.embedUrl)
          ? source.embedUrl
          : null;
      } else if ('embedCode' in source && source.embedCode) {
        embedUrl = extractEmbedUrlFromCode(source.embedCode);
      }

      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            title="Video"
            className="bds-video__iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      return null;
    };

    const videoContent = renderVideoContent();
    if (!videoContent) return null;

    const containerClass = clsx(
      'bds-video',
      `bds-video--aspect-${aspectRatio.replace('/', '-')}`,
      className
    );

    if (coverImage) {
      return (
        <>
          <div ref={ref} className={containerClass}>
            <button
              type="button"
              className="bds-video__cover-button"
              onClick={() => setIsModalOpen(true)}
              aria-label="Play video"
            >
              <img
                src={coverImage.src}
                alt={coverImage.alt}
                className="bds-video__cover-image"
              />
              <span className="bds-video__play-icon" aria-hidden>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="32"
                    fill="rgba(0,0,0,0.5)"
                  />
                  <path
                    d="M26 20v24l18-12-18-12z"
                    fill="white"
                  />
                </svg>
              </span>
            </button>
          </div>

          {isModalOpen && (
            <div
              className="bds-video-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Video"
            >
              <div
                className="bds-video-modal__backdrop"
                onClick={closeModal}
                aria-hidden
              />
              <div className="bds-video-modal__content">
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="bds-video-modal__close"
                  onClick={closeModal}
                  aria-label="Close video"
                >
                  <span aria-hidden>&times;</span>
                </button>
                <div className="bds-video-modal__video">
                  {renderVideoContent()}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <div ref={ref} className={containerClass}>
        <div className="bds-video__inner">{videoContent}</div>
      </div>
    );
  }
);

Video.displayName = 'Video';

export default Video;
