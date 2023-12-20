import React, { useRef, useState } from 'react';
import { useTranslate } from "@portal/hooks";
import { Connection } from './types';

interface PermaLinkButtonProps {
  currentBody: any;
  selectedConnection: Connection;
}

interface PermaLinkProps extends PermaLinkButtonProps {
  closePermalinkModal: any;
}

const PermalinkModal: React.FC<PermaLinkProps> = ({
                                                    closePermalinkModal,
                                                    currentBody,
                                                    selectedConnection
}) => {
  const { translate } = useTranslate();
  const permalinkRef = useRef(null);

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

export const PermalinkButton = ({currentBody, selectedConnection}: PermaLinkButtonProps) => {
  const [isPermalinkModalVisible, setIsPermalinkModalVisible] = useState(false);

  const openPermalinkModal = () => {
    setIsPermalinkModalVisible(true);
  };
  const closePermalinkModal = () => {
    setIsPermalinkModalVisible(false);
  };

  return <>
    <button
      className="btn btn-outline-secondary permalink"
      title="Permalink"
      onClick={openPermalinkModal}
    >
      <i className="fa fa-link"></i>
    </button>
    {isPermalinkModalVisible && (
      <PermalinkModal
        closePermalinkModal={closePermalinkModal}
        currentBody={currentBody}
        selectedConnection={selectedConnection}
      />
    )}
  </>
}

const getPermalink = (selectedConnection, currentBody) => {
  const startHref = window.location.origin + window.location.pathname;
  const encodedBody = encodeURIComponent(get_compressed_body(currentBody));
  const encodedServer = encodeURIComponent(selectedConnection.ws_url);
  return `${startHref}?server=${encodedServer}&req=${encodedBody}`;
};

function get_compressed_body(currentBody) {
  return currentBody.replace("\n", "").trim();
}

const copyToClipboard = async (textareaRef, textareaValue) => {
  if (textareaRef.current) {
    textareaRef.current.select();
    textareaRef.current.focus();
    await navigator.clipboard.writeText(textareaValue);
  }
};
