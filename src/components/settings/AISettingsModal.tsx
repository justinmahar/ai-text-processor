import classNames from 'classnames';
import React from 'react';
import { Button, Card, Form, Modal, ModalProps } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { AIModel, LocalSettingsKeys, defaultOpenAiModels, useLocalSettings } from '../useLocalSettings';

export interface YouTubeSettingsModalProps extends ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const AISettingsModal = ({ show, setShow, ...props }: YouTubeSettingsModalProps) => {
  const localSettings = useLocalSettings();
  const [openAiKey, setOpenAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [showOpenAiKey, setShowOpenAiKey] = React.useState(false);
  const [customOpenAiModels, setCustomOpenAiModels] = localSettings[LocalSettingsKeys.customOpenAiModels];
  const [renderTime, setRenderTime] = React.useState(0);
  const [newOpenAiModelName, setNewOpenAiModelName] = React.useState('');
  const [newOpenAiModelId, setNewOpenAiModelId] = React.useState('');
  const [newOpenAiModelMaxTokens, setNewOpenAiModelMaxTokens] = React.useState('');

  const mergedOpenAiModels: AIModel[] = [...defaultOpenAiModels, ...customOpenAiModels];

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleDeleteOpenAiModel = (id: string) => {
    const newCustomOpenAiModels = [...customOpenAiModels];
    const index = newCustomOpenAiModels.findIndex((m: AIModel) => m.id === id);
    if (index >= 0) {
      newCustomOpenAiModels.splice(index, 1);
      setCustomOpenAiModels(newCustomOpenAiModels);
    }
  };

  const handleAddNewOpenAiModel = () => {
    const newCustomOpenAiModels: AIModel[] = [...customOpenAiModels];
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

  const handleEditOpenAiModel = (id: string, prop: string, value: string) => {
    console.log(id, prop, value);
    const newCustomOpenAiModels: AIModel[] = [...customOpenAiModels];
    const index = newCustomOpenAiModels.findIndex((m: AIModel) => m.id === id);
    if (index >= 0) {
      const model = newCustomOpenAiModels[index];
      (model as any)[prop] = value;
      console.log(model);
      newCustomOpenAiModels.splice(index, 1, model);
      console.log(newCustomOpenAiModels);
      setCustomOpenAiModels(newCustomOpenAiModels);
      setRenderTime(Date.now());
    }
  };

  const aiModelElements = mergedOpenAiModels.map((model, i) => {
    const disabled = !customOpenAiModels.find((m: AIModel) => m.id === model.id);
    return (
      <div key={`model-${i}`} className="d-flex align-items-center gap-1">
        <Form.Control
          type="text"
          placeholder="Name"
          value={model.name}
          disabled={disabled}
          onChange={(e) => handleEditOpenAiModel(model.id, 'name', e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Model ID"
          className="font-monospace"
          value={model.id}
          disabled={disabled}
          onChange={(e) => handleEditOpenAiModel(model.id, 'id', e.target.value)}
        />
        <Form.Control
          type="number"
          min={0}
          step={1}
          placeholder="Max Tokens"
          value={model.maxTokens}
          disabled={disabled}
          onChange={(e) => handleEditOpenAiModel(model.id, 'maxTokens', e.target.value)}
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
    <Modal
      size="lg"
      show={show}
      onHide={handleCloseModal}
      {...props}
      className={classNames(props.className)}
      style={{ ...props.style }}
    >
      <Modal.Header closeButton>
        <Modal.Title>AI Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-2">
        <Card>
          <Card.Header>OpenAI</Card.Header>
          <Card.Body className="d-flex flex-column gap-2">
            <p className="mb-0">Sign into OpenAI and generate an API key to perform text processing.</p>
            <div className="d-flex align-items-center gap-1">
              <Form.Control
                type={showOpenAiKey ? 'text' : 'password'}
                placeholder="Enter OpenAI API Key"
                value={openAiKey ?? ''}
                onChange={(e) => setOpenAiKey(e.target.value)}
                className="w-100"
              />
              <Button variant="primary" onClick={() => setShowOpenAiKey(!showOpenAiKey)}>
                {!showOpenAiKey ? <FaEye className="mb-1" /> : <FaEyeSlash className="mb-1" />}
              </Button>
            </div>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
