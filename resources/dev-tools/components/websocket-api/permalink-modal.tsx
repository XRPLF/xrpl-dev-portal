import React, { useRef, useState } from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Connection } from './types';
import { Modal, ModalClipboardBtn, ModalCloseBtn } from '../Modal';

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
            ref={permalinkRef}
            value={getPermalink(selectedConnection, currentBody)}
            onChange={() => {}}
          />
        </div>
      </form>
    </Modal>
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
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <>
    <button
      className="btn btn-outline-secondary permalink"
      data-toggle="modal"
      data-target="#wstool-1-permalink"
      title={translate("Permalink")}
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
