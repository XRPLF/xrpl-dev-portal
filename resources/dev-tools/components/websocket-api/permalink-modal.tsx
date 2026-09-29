import React, { useEffect, useRef, useState } from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Connection } from './types';
import { Modal, ModalClipboardBtn, ModalCloseBtn } from '../Modal';

interface PermaLinkButtonProps {
  currentBody: any;
  selectedConnection: Connection;
}

export const PermalinkModal: React.FC<PermaLinkButtonProps> = ({
                                                    currentBody,
                                                    selectedConnection
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const permalinkRef = useRef(null);
  const [permalink, setPermalink] = useState('');

  useEffect(() => {
    setPermalink(getPermalink(selectedConnection, currentBody));
  }, [selectedConnection, currentBody]);

  const footer = <>
    <ModalClipboardBtn textareaRef={permalinkRef} />
    <ModalCloseBtn />
  </>

  return (
    <Modal
      id="wstool-1-permalink"
      title={translate("Permalink")}
      footer={footer}
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
            value={permalink}
            onChange={() => {}}
          />
        </div>
      </form>
    </Modal>
  );
};

export function PermalinkButton () {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <button
      className="btn btn-outline-secondary permalink"
      data-bs-toggle="modal"
      data-bs-target="#wstool-1-permalink"
      title={translate("Permalink")}
    >
      <i className="fa fa-link"></i>
    </button>
  )
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
