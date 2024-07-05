import React, { JSX, ReactElement, ReactNode } from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';

interface ModalProps {
  id: string // used for targeting animations
  title: string,
  children: ReactNode,
  footer?: ReactNode,
  onClose: () => void;
}

/**
 * Reusable component that leverages bootstrap's jquery library
 */
export const Modal = ({title, footer, children, onClose, id}: ModalProps) => {
  return <div
    className="modal fade"
    id={id}
    tabIndex={-1}
    role="dialog"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={onClose}
            data-dismiss="modal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          { footer ? footer : (
            <ModalCloseBtn onClick={onClose} />
          )}
        </div>
      </div>
    </div>
  </div>
}

export const ModalCloseBtn = ({onClick}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <button
    type="button"
    className="btn btn-outline-secondary"
    data-dismiss="modal"
    onClick={onClick}
  >
    {translate('Close')}
  </button>
}

export const ModalClipboardBtn = ({textareaRef}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <button
    title={translate('Copy to clipboard')}
    className="btn btn-outline-secondary clipboard-btn"
    onClick={() => copyToClipboard(textareaRef)}
  >
    <i className="fa fa-clipboard"></i>
  </button>
}

const copyToClipboard = async (textareaRef) => {
  if (textareaRef.current) {
    textareaRef.current.select();
    textareaRef.current.focus();
    await navigator.clipboard.writeText(textareaRef.current.value);
  }
};
