import React from 'react';
import { useTranslate } from "@portal/hooks";
import { Connection } from './types';

interface PermaLinkProps {
  permalinkRef: any;
  closePermalinkModal: any;
  currentBody: any;
  selectedConnection: Connection;
}

export const PermalinkModal: React.FC<PermaLinkProps> = ({
                                                           permalinkRef,
                                                           closePermalinkModal,
                                                           currentBody,
                                                           selectedConnection,
                                                         }) => {
  const { translate } = useTranslate();
  return (
    <div
      className="modal fade show"
      id="wstool-1-permalink"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{translate("Permalink")}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="permalink-box-1">
                  {translate(
                    "Share the following link to load this page with the currently-loaded inputs:"
                  )}
                </label>
                <textarea
                  id="permalink-box-1"
                  className="form-control"
                  ref={permalinkRef}
                  value={getPermalink(selectedConnection, currentBody)}
                  onChange={() => {}}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              title="Copy to clipboard"
              className="btn btn-outline-secondary clipboard-btn"
              data-clipboard-target="#permalink-box-1"
              id="permalink-box-1button"
              onClick={() =>
                copyToClipboard(
                  permalinkRef,
                  getPermalink(selectedConnection, currentBody)
                )
              }
            >
              <i className="fa fa-clipboard"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-dismiss="modal"
              onClick={closePermalinkModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPermalink = (selectedConnection, currentBody) => {
  const startHref = window.location.origin + window.location.pathname;
  const encodedBody = encodeURIComponent(get_compressed_body(currentBody));
  const encodedServer = encodeURIComponent(selectedConnection.ws_url);
  return `${startHref}?server=${encodedServer}&req=${encodedBody}`;
};

function get_compressed_body(currentBody) {
  let compressed_body;
  try {
    compressed_body = currentBody
  } catch (e) {
    // Probably invalid JSON. We'll make a permalink anyway, but we can't
    // compress all the whitespace because we don't know what's escaped. We can
    // assume that newlines are irrelevant because the rippled APIs don't accept
    // newlines in strings anywhere
    compressed_body = currentBody.replace("\n", "").trim();
  }

  return compressed_body;
}

const copyToClipboard = async (textareaRef, textareaValue) => {
  if (textareaRef.current) {
    textareaRef.current.select();
    textareaRef.current.focus();
    await navigator.clipboard.writeText(textareaValue);
  }
};
