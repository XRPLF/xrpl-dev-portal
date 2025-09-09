import React, { useRef, useState } from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Connection } from './types';
import { Modal, ModalClipboardBtn, ModalCloseBtn } from '../Modal';

interface PermaLinkButtonProps {
  currentBody: any;
  selectedConnection: Connection;
}

interface PermaLinkProps extends PermaLinkButtonProps {
  closePermalinkModal: () => void;
}

const PermalinkModal: React.FC<PermaLinkProps> = ({
                                                    closePermalinkModal,
                                                    currentBody,
                                                    selectedConnection
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const permalinkRef = useRef(null);

  const footer = <>
    <ModalClipboardBtn textareaRef={permalinkRef} />
    <ModalCloseBtn onClick={closePermalinkModal} />
  </>

  return (
    <Modal
      id="wstool-1-permalink"
      title={translate("Permalink")}
      footer={footer}
      onClose={closePermalinkModal}
    >
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
            rows={8}
            ref={permalinkRef}
            value={getPermalink(selectedConnection, currentBody)}
            onChange={() => {}}
          />
        </div>
      </form>
    </Modal>
  );
};

export function PermalinkButton ({currentBody, selectedConnection}: PermaLinkButtonProps) {
  const [showPermalinkModal, setShowPermalinkModal] = useState(false);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <>
    <button
      className="btn btn-outline-secondary permalink"
      data-toggle="modal"
      data-target="#wstool-1-permalink"
      title={translate("Permalink")}
      onClick={() => setShowPermalinkModal(true)}
    >
      <i className="fa fa-link"></i>
    </button>
    {showPermalinkModal && (
      <PermalinkModal
        closePermalinkModal={() => setShowPermalinkModal(false)}
        currentBody={currentBody}
        selectedConnection={selectedConnection}
      />
    )}
  </>
}

function getPermalink (selectedConnection: Connection, currentBody) {
  const startHref = window.location.origin + window.location.pathname;
  const encodedBody = encodeURIComponent(get_compressed_body(currentBody));
  const encodedServer = encodeURIComponent(selectedConnection.ws_url);
  return `${startHref}?server=${encodedServer}&req=${encodedBody}`;
}

function get_compressed_body(currentBody) {
  return currentBody.replace("\n", "").trim();
}
