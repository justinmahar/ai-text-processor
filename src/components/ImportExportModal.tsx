import classNames from 'classnames';
import React from 'react';
import { Alert, Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { LocalSettingsKeys, useLocalSettings } from './useLocalSettings';
import copy from 'copy-to-clipboard';
import { useMomentaryBool } from 'react-use-precision-timer';

export interface ImportExportModalProps extends ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const ImportExportModal = ({ show, setShow, ...props }: ImportExportModalProps) => {
  const localSettings = useLocalSettings();
  const [presets, setPresets] = localSettings[LocalSettingsKeys.presets];
  const [customOpenAiModels, setCustomOpenAiModels] = localSettings[LocalSettingsKeys.customOpenAiModels];
  const enteredValueTextAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const getSettingsJsonString = () => {
    let settingsJson = '';
    try {
      settingsJson = JSON.stringify({
        presets,
        customOpenAiModels,
      });
    } catch (e) {
      console.error(e);
    }
    return settingsJson;
  };
  const [enteredValue, setEnteredValue] = React.useState(getSettingsJsonString());
  const [copied, toggleCopied] = useMomentaryBool(false, 2000);
  const [error, setError] = React.useState<any>(undefined);

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleImport = () => {
    try {
      const parsedSettings = JSON.parse(enteredValue);
      if (parsedSettings.presets) {
        setPresets(parsedSettings.presets);
      }
      if (parsedSettings.customOpenAiModels) {
        setCustomOpenAiModels(parsedSettings.customOpenAiModels);
      }
    } catch (e) {
      console.error(e);
      setError(e);
    }
  };

  const handleCopy = () => {
    copy(enteredValue);
    toggleCopied();
    enteredValueTextAreaRef.current?.select();
  };

  const handleReset = () => {
    setEnteredValue(getSettingsJsonString());
  };

  React.useEffect(() => {
    try {
      JSON.parse(enteredValue);
      setError(undefined);
    } catch (e) {
      setError(e);
    }
  }, [enteredValue]);

  const canImport = getSettingsJsonString() !== enteredValue && !error;
  const canReset = error || canImport;

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      size="lg"
      {...props}
      className={classNames(props.className)}
      style={{ ...props.style }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Import/Export Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Import or export your AI settings and presets below.</p>
        <p>
          To export, click Copy and paste the clipboard contents into a text file or notes application. (Note: Your
          OpenAI API key will not be exported.)
        </p>
        <p>To import, paste the saved settings and click Import.</p>
        <div className="d-flex flex-column gap-2">
          <div>
            <Form.Control
              ref={enteredValueTextAreaRef}
              as="textarea"
              placeholder="Paste settings here"
              rows={6}
              value={enteredValue}
              className="font-monospace"
              style={{ fontSize: '80%' }}
              onChange={(e) => setEnteredValue(e.target.value)}
              onFocus={() => {
                enteredValueTextAreaRef.current?.select();
              }}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="primary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="primary" onClick={handleImport} disabled={!canImport}>
              Import
            </Button>
            <Button variant="outline-primary" onClick={handleReset} disabled={!canReset}>
              Reset
            </Button>
          </div>
          {enteredValue && error && (
            <Alert variant="danger">
              Invalid settings. Please check the entered value and try again, or click Reset to reset the entered value
              back to the current settings.
            </Alert>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
