
import { useTranslate } from "@portal/hooks";
import { Connection } from './types';

interface ConnectionProps {
  selectedConnection: Connection;
  handleConnectionChange: any;
  closeConnectionModal: any;
  connections: Connection[];
}

export const ConnectionModal: React.FC<ConnectionProps> = ({
                                                             selectedConnection,
                                                             handleConnectionChange,
                                                             closeConnectionModal,
                                                             connections,
                                                           }) => {
  const { translate } = useTranslate();

  return (
    <div
      className="modal fade"
      id="wstool-1-connection-settings"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{translate('Connection Settings')}</h5>
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
            {connections.map((conn) => (
              <div className="form-check" key={conn.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="wstool-1-connection"
                  id={conn.id}
                  value={conn.id}
                  data-jsonrpcurl={conn.jsonrpc_url}
                  data-shortname={conn.shortname}
                  checked={selectedConnection.id === conn.id}
                  onChange={handleConnectionChange}
                />
                <label className="form-check-label" htmlFor={conn.id}>
                  <div dangerouslySetInnerHTML={{ __html: conn.longname }} />
                </label>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-dismiss="modal"
              onClick={closeConnectionModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
