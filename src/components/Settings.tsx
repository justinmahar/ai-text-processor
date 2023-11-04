import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { FaEye, FaEyeSlash, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { LocalSettingsKeys, useLocalSettings } from './useLocalSettings';
import { AIModelInfo, defaultOpenAiModelInfos } from './AIModelInfo';
import { ImportExportModal } from './ImportExportModal';

export interface SettingsProps extends DivProps {}

export const Settings = ({ ...props }: SettingsProps) => {
  const localSettings = useLocalSettings();
  const [openAiKey, setOpenAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [showOpenAiKey, setShowOpenAiKey] = React.useState(false);
  const [customOpenAiModelInfos, setCustomOpenAiModelInfos] = localSettings[LocalSettingsKeys.customOpenAiModelInfos];
  const [newOpenAiModelName, setNewOpenAiModelName] = React.useState('');
  const [newOpenAiModelId, setNewOpenAiModelId] = React.useState('');
  const [newOpenAiModelMaxTokens, setNewOpenAiModelMaxTokens] = React.useState('');
  const [showChunkInspector, setShowChunkInspector] = localSettings[LocalSettingsKeys.showChunkInspector];
  const [showImportExportModal, setShowImportExportModal] = React.useState(false);

  const mergedOpenAiModelInfos: AIModelInfo[] = [...defaultOpenAiModelInfos, ...(customOpenAiModelInfos ?? [])];

  const handleDeleteOpenAiModel = (id: string) => {
    const newCustomOpenAiModels = [...(customOpenAiModelInfos ?? [])];
    const index = newCustomOpenAiModels.findIndex((m: AIModelInfo) => m.id === id);
    if (index >= 0) {
      newCustomOpenAiModels.splice(index, 1);
      setCustomOpenAiModelInfos(newCustomOpenAiModels);
    }
  };

  const handleAddNewOpenAiModel = () => {
    const newCustomOpenAiModels: AIModelInfo[] = [...(customOpenAiModelInfos ?? [])];
    newCustomOpenAiModels.push({
      name: newOpenAiModelName,
      id: newOpenAiModelId,
      maxTokens: parseInt(newOpenAiModelMaxTokens),
    });
    setCustomOpenAiModelInfos(newCustomOpenAiModels);
    setNewOpenAiModelName('');
    setNewOpenAiModelId('');
    setNewOpenAiModelMaxTokens('');
  };

  const aiModelElements = mergedOpenAiModelInfos.map((model, i, arr) => {
    const disabled = !(customOpenAiModelInfos ?? []).find((m: AIModelInfo) => m.id === model.id);
    return (
      <div key={`model-${i}`} className="d-flex flex-column gap-1">
        <div className="d-flex flex-wrap align-items-center gap-1">
          <Form.Control
            type="text"
            placeholder="Name"
            value={model.name}
            disabled={true}
            style={{ maxWidth: 200 }}
            className="w-100"
            readOnly
          />
          <Form.Control
            type="text"
            placeholder="Model ID"
            className="font-monospace w-100"
            value={model.id}
            disabled={true}
            style={{ maxWidth: 200 }}
            readOnly
          />
          <Form.Control
            type="number"
            min={0}
            step={1}
            placeholder="Max Tokens"
            value={model.maxTokens}
            disabled={true}
            style={{ maxWidth: 150 }}
            className="w-100"
          />
          <Button variant="outline-danger" disabled={disabled} onClick={() => handleDeleteOpenAiModel(model.id)}>
            <FaTrashAlt />
          </Button>
        </div>
        {i < arr.length - 1 && <hr className="my-1" />}
      </div>
    );
  });

  const canAddOpenAiModel =
    !mergedOpenAiModelInfos.find((m) => m.id === newOpenAiModelId) &&
    newOpenAiModelName &&
    newOpenAiModelId &&
    newOpenAiModelMaxTokens;

  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      {showImportExportModal && <ImportExportModal show={showImportExportModal} setShow={setShowImportExportModal} />}
      <Card>
        <Card.Header>Settings</Card.Header>
        <Card.Body className="d-flex flex-column gap-2">
          <Card>
            <Card.Header>OpenAI</Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              {!openAiKey && (
                <Alert variant="primary" className="mb-0">
                  You must <a href="https://platform.openai.com/account/api-keys">generate an OpenAI API key</a> to
                  perform text processing with this utility. Copy your key and paste it below.
                </Alert>
              )}
              <Form.Group controlId="form-group-openai-api-key">
                <Form.Label className="small fw-bold mb-1">API Key</Form.Label>
                <div className="d-flex align-items-center gap-1">
                  <Form.Control
                    type={showOpenAiKey ? 'text' : 'password'}
                    placeholder="Paste OpenAI API Key here"
                    value={openAiKey ?? ''}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    className="w-100"
                  />
                  <Button variant="primary" onClick={() => setShowOpenAiKey(!showOpenAiKey)}>
                    {!showOpenAiKey ? <FaEye className="mb-1" /> : <FaEyeSlash className="mb-1" />}
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  Your <a href="https://platform.openai.com/account/api-keys">API key</a> will be stored in your
                  browser's local storage, on your device only (not in the cloud).
                </Form.Text>
              </Form.Group>
              <Card>
                <Card.Header>AI Models</Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-1">
                    {aiModelElements}
                    {aiModelElements.length > 0 && <hr className="my-1" />}
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      <Form.Control
                        type="text"
                        placeholder="Display name"
                        value={newOpenAiModelName}
                        style={{ maxWidth: 200 }}
                        className="w-100"
                        onChange={(e) => setNewOpenAiModelName(e.target.value)}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Model ID"
                        className="font-monospace w-100"
                        // style={{ fontSize: '80%' }}
                        value={newOpenAiModelId}
                        style={{ maxWidth: 200 }}
                        onChange={(e) => setNewOpenAiModelId(e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        min={0}
                        step={1}
                        placeholder="Max Tokens"
                        value={newOpenAiModelMaxTokens}
                        onChange={(e) => setNewOpenAiModelMaxTokens(e.target.value)}
                        style={{ maxWidth: 150 }}
                        className="w-100"
                      />
                      <Button variant="outline-primary" onClick={handleAddNewOpenAiModel} disabled={!canAddOpenAiModel}>
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
                  <Form.Text className="text-muted">
                    Supports all OpenAI chat models (legacy not supported). Enter a display name, model ID, and the max
                    number of tokens for the model.
                  </Form.Text>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>Text Processing</Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <Form.Check
                label="Show chunk inspector"
                className="user-select-none"
                id="show-chunk-inspector"
                checked={!!showChunkInspector}
                onChange={(e) => setShowChunkInspector(e.target.checked)}
              />
            </Card.Body>
          </Card>
          <div>
            <Button variant="primary" onClick={() => setShowImportExportModal(true)}>
              Import/Export Settings
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
