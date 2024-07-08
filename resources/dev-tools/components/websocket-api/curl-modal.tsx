import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Connection } from './types';
import { useRef, useState } from 'react';
import { Modal, ModalClipboardBtn, ModalCloseBtn } from '../Modal';

interface CurlButtonProps {
  currentBody: any;
  selectedConnection: Connection;
}

interface CurlProps extends CurlButtonProps{
  closeCurlModal: () => void;
}

const getCurl = function (currentBody, selectedConnection: Connection) {
  let body;
  try {
    // change WS to JSON-RPC syntax
    const params = JSON.parse(currentBody);
    delete params.id;
    const method = params.command;
    delete params.command;
    const body_json = { method: method, params: [params] };
    body = JSON.stringify(body_json, null, null);
  } catch (e) {
    alert("Can't provide curl format of invalid JSON syntax");
    return;
  }

  const server = selectedConnection.jsonrpc_url;

  return `curl -H 'Content-Type: application/json' -d '${body}' ${server}`;
};

export const CurlModal: React.FC<CurlProps> = ({
                                                 currentBody,
                                                 selectedConnection,
                                               }) => {
  const curlRef = useRef(null);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const footer = <>
    <ModalClipboardBtn textareaRef={curlRef} />
    <ModalCloseBtn onClick={() => {}} />
  </>

  return (
    <Modal
      id="wstool-1-curl"
      title={translate("cURL Syntax")}
      onClose={() => {}}
      footer={footer}
    >
      <form>
        <div className="form-group">
          <label htmlFor="curl-box-1">
            {translate('resources.dev-tools.websocket-api.curl.modal.desc.part1', 'Use the following syntax to make the equivalent JSON-RPC request using ')}
            <a href="https://curl.se/">cURL</a>
            {translate('resources.dev-tools.websocket-api.curl.modal.desc.part2',' from a commandline interface:')}
          </label>
          <textarea
            id="curl-box-1"
            className="form-control"
            rows={8}
            ref={curlRef}
          >
            {getCurl(currentBody, selectedConnection)}
          </textarea>
        </div>
      </form>
    </Modal>
  );
};

export const CurlButton = ({selectedConnection, currentBody}: CurlButtonProps) => {
  const [showCurlModal, setShowCurlModal] = useState(false);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <>
      <button
        className="btn btn-outline-secondary curl"
        data-toggle="modal"
        data-target="#wstool-1-curl"
        title={translate("cURL Syntax")}
        onClick={() => setShowCurlModal(true)}
      >
        <i className="fa fa-terminal"></i>
      </button>
      {showCurlModal && <CurlModal
        closeCurlModal={() => setShowCurlModal(false)}
        currentBody={currentBody}
        selectedConnection={selectedConnection}
      />}
  </>
}
