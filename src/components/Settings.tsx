import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { FaEye, FaEyeSlash, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { LocalSettingsKeys, useLocalSettings } from './useLocalSettings';
import { AIModel, defaultOpenAiModels } from './open-ai-models';

export interface SettingsProps extends DivProps {}

export const Settings = ({ ...props }: SettingsProps) => {
  const localSettings = useLocalSettings();
  const [openAiKey, setOpenAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [showOpenAiKey, setShowOpenAiKey] = React.useState(false);
  const [customOpenAiModels, setCustomOpenAiModels] = localSettings[LocalSettingsKeys.customOpenAiModels];
  const [newOpenAiModelName, setNewOpenAiModelName] = React.useState('');
  const [newOpenAiModelId, setNewOpenAiModelId] = React.useState('');
  const [newOpenAiModelMaxTokens, setNewOpenAiModelMaxTokens] = React.useState('');
  const [averageTokenLength, setAverageTokenLength] = localSettings[LocalSettingsKeys.averageTokenLength];
  const [requestMaxTokenRatio, setRequestMaxTokenRatio] = localSettings[LocalSettingsKeys.requestMaxTokenRatio];
  const [chunkOverlapWordCount, setChunkOverlapWordCount] = localSettings[LocalSettingsKeys.chunkOverlapWordCount];
  const [chunkPrefix, setChunkPrefix] = localSettings[LocalSettingsKeys.chunkPrefix];
  const [showChunkInspector, setShowChunkInspector] = localSettings[LocalSettingsKeys.showChunkInspector];

  const mergedOpenAiModels: AIModel[] = [...defaultOpenAiModels, ...(customOpenAiModels ?? [])];

  const handleDeleteOpenAiModel = (id: string) => {
    const newCustomOpenAiModels = [...(customOpenAiModels ?? [])];
    const index = newCustomOpenAiModels.findIndex((m: AIModel) => m.id === id);
    if (index >= 0) {
      newCustomOpenAiModels.splice(index, 1);
      setCustomOpenAiModels(newCustomOpenAiModels);
    }
  };

  const handleAddNewOpenAiModel = () => {
    const newCustomOpenAiModels: AIModel[] = [...(customOpenAiModels ?? [])];
    newCustomOpenAiModels.push({
      name: newOpenAiModelName,
      id: newOpenAiModelId,
      maxTokens: parseInt(newOpenAiModelMaxTokens),
    });
    setCustomOpenAiModels(newCustomOpenAiModels);
    setNewOpenAiModelName('');
    setNewOpenAiModelId('');
    setNewOpenAiModelMaxTokens('');
  };

  const aiModelElements = mergedOpenAiModels.map((model, i) => {
    const disabled = !(customOpenAiModels ?? []).find((m: AIModel) => m.id === model.id);
    return (
      <div key={`model-${i}`} className="d-flex align-items-center gap-1">
        <Form.Control type="text" placeholder="Name" value={model.name} disabled={true} readOnly />
        <Form.Control
          type="text"
          placeholder="Model ID"
          className="font-monospace"
          value={model.id}
          disabled={true}
          readOnly
        />
        <Form.Control
          type="number"
          min={0}
          step={1}
          placeholder="Max Tokens"
          value={model.maxTokens}
          disabled={true}
          style={{ width: 150 }}
        />
        <Button variant="outline-danger" disabled={disabled} onClick={() => handleDeleteOpenAiModel(model.id)}>
          <FaTrashAlt />
        </Button>
      </div>
    );
  });

  const canAddOpenAiModel =
    !mergedOpenAiModels.find((m) => m.id === newOpenAiModelId) &&
    newOpenAiModelName &&
    newOpenAiModelId &&
    newOpenAiModelMaxTokens;

  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
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
              </Form.Group>
              <Form.Text className="text-muted">
                Your API key will be stored in your browser's local storage, on your device only (not in the cloud).
              </Form.Text>
              <Card>
                <Card.Header>AI Models</Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-1">
                    {aiModelElements}
                    <div className="d-flex align-items-center gap-1">
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        value={newOpenAiModelName}
                        onChange={(e) => setNewOpenAiModelName(e.target.value)}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Model ID"
                        className="font-monospace"
                        // style={{ fontSize: '80%' }}
                        value={newOpenAiModelId}
                        onChange={(e) => setNewOpenAiModelId(e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        min={0}
                        step={1}
                        placeholder="Max Tokens"
                        value={newOpenAiModelMaxTokens}
                        onChange={(e) => setNewOpenAiModelMaxTokens(e.target.value)}
                        style={{ width: 150 }}
                      />
                      <Button variant="outline-primary" onClick={handleAddNewOpenAiModel} disabled={!canAddOpenAiModel}>
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
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
        </Card.Body>
      </Card>
    </div>
  );
};
