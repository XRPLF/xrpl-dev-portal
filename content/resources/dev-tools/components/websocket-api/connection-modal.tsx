import { useTranslate } from "@portal/hooks";
import { Connection } from './types';
import { ChangeEvent } from 'react';

interface ConnectionButtonProps {
  selectedConnection: Connection;
  setSelectedConnection: (value: Connection) => void;
  connections: Connection[];
}

interface ConnectionProps extends ConnectionButtonProps {
  closeConnectionModal: any;
}

export const ConnectionModal: React.FC<ConnectionProps> = ({
                                                             selectedConnection,
                                                             setSelectedConnection,
                                                             closeConnectionModal,
                                                             connections,
                                                           }) => {
  const { translate } = useTranslate();
  const handleConnectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const foundConnection = connections.find(
      (conn) => conn.id === selectedValue
    );

    setSelectedConnection(foundConnection);
  };

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

