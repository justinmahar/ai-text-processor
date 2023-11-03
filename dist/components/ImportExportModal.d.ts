import React from 'react';
import { ModalProps } from 'react-bootstrap';
export interface ImportExportModalProps extends ModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}
export declare const ImportExportModal: ({ show, setShow, ...props }: ImportExportModalProps) => React.JSX.Element;
