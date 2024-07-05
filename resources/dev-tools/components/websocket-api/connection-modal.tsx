import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Connection } from './types';
import { ChangeEvent } from 'react';
import { Modal } from '../Modal';

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
  const { useTranslate } = useThemeHooks();                                                  
  const { translate } = useTranslate();
  const handleConnectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const foundConnection = connections.find(
      (conn) => conn.id === selectedValue
    );

    setSelectedConnection(foundConnection);
  };

  return (
    <Modal id="wstool-1-connection-settings" title={translate('Connection Settings')} onClose={closeConnectionModal}>
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
    </Modal>
  );
};

