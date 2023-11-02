import copy from 'copy-to-clipboard';
import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Alert, Badge, Button, Card, Form, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { AIModel, LocalSettingsKeys, defaultOpenAiModels, useLocalSettings } from './useLocalSettings';
import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import { Markdown } from './Markdown';
import { useMomentaryBool } from 'react-use-precision-timer';
import { FaCheck, FaCopy, FaTrash } from 'react-icons/fa';

export interface ProcessorProps extends DivProps {}

export const Processor = ({ ...props }: ProcessorProps) => {
  const localSettings = useLocalSettings();
  const [name, setName] = React.useState('Untitled Processor');
  const [openAiModel, setOpenAiModel] = React.useState('gpt-3.5-turbo');
  const [prompt, setPrompt] = localSettings[LocalSettingsKeys.prompt];
  const [input, setInput] = localSettings[LocalSettingsKeys.input];
  const [output, setOutput] = localSettings[LocalSettingsKeys.output];
  const [openAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [customOpenAiModels, setCustomOpenAiModels] = localSettings[LocalSettingsKeys.customOpenAiModels];
  const mergedOpenAiModels: AIModel[] = [...defaultOpenAiModels, ...customOpenAiModels];
  const [showRawOutput, setShowRawOutput] = localSettings[LocalSettingsKeys.showRawOutput];
  const [copied, toggleCopied] = useMomentaryBool(false, 2000);
  const [xhr, setXhr] = React.useState<XMLHttpRequest | undefined>(undefined);
  const errors = React.useRef<any[]>([]);
  const [renderTime, setRenderTime] = React.useState(0);

  const handleExecute = () => {
    setOutput('');
    errors.current = [];
    setRenderTime(Date.now());
    // Configure the stream
    const streamConfig: ClientStreamChatCompletionConfig = {
      apiKey: `${openAiKey}`, // Your API key
      handler: {
        // Content contains the string draft, which may be partial. When isFinal is true, the completion is done.
        onContent(content, isFinal, xhr) {
          setOutput(content);
        },
        onDone(xhr) {
          setXhr(undefined);
        },
        onError(error, status, xhr) {
          console.error(error);
          setXhr(undefined);
          errors.current = [...errors.current, error];
          setRenderTime(Date.now());
        },
      },
    };

    // Make the call and store a reference to the XMLHttpRequest
    const xhr = OpenAIExt.streamClientChatCompletion(
      {
        model: `${openAiModel}`,
        messages: [
          { role: 'system', content: 'You are a text processor.' },
          { role: 'user', content: `${prompt}\n\n${input}` },
        ],
      },
      streamConfig,
    );
    setXhr(xhr);
  };

  const handleSave = () => {
    //
  };

  const handleCopy = () => {
    copy(output);
    toggleCopied();
  };

  const handleClear = () => {
    setOutput('');
    errors.current = [];
    setRenderTime(Date.now());
    xhr?.abort();
    setXhr(undefined);
  };

  const openAiModelOptions = mergedOpenAiModels.map((model, i) => {
    return (
      <option key={`open-ai-model-${i}`} value={model.id}>
        {model.name}
      </option>
    );
  });

  const errorAlertElements = errors.current.map((error, i) => {
    let messageString = `${error}`;
    try {
      const errorObj = JSON.parse(error.message);
      messageString = errorObj.error?.message ?? messageString;
    } catch (e) {
      // Ignore
    }
    return (
      <Alert variant="danger" key={`error-${i}`} className="mb-0">
        {messageString}
      </Alert>
    );
  });

  return (
    <div {...props} className={classNames('d-flex flex-column gap-3', props.className)} style={{ ...props.style }}>
      <Card>
        <Card.Header>AI Text Processor</Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-2">
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            <Form.Select value={openAiModel} onChange={(e) => setOpenAiModel(e.target.value)}>
              <option value="">AI Model...</option>
              {openAiModelOptions}
            </Form.Select>
            <Form.Control
              as="textarea"
              placeholder="Processing prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Form.Control
              as="textarea"
              placeholder="Enter text to process"
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div>
              <Form.Text className="text-muted">
                Estimated Token Count:{' '}
                <Badge pill bg="secondary">
                  {Math.ceil(`${input}`.length / 5)}
                </Badge>
              </Form.Text>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleExecute}>
                Execute
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      {(xhr || output) && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center gap-2">
            <div>Output</div>
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                inline
                label="Raw"
                className="user-select-none"
                id="raw-checkbox"
                checked={showRawOutput}
                onChange={(e) => setShowRawOutput(e.target.checked)}
              />
              <Button variant="outline-primary" onClick={handleCopy}>
                {copied ? <FaCheck className="mb-1" /> : <FaCopy className="mb-1" />}
              </Button>
              <Button variant="outline-danger" onClick={handleClear}>
                <FaTrash className="mb-1" />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {!output && <Spinner animation="border" role="status" size="sm" />}
            {output && showRawOutput && <pre>{output}</pre>}
            {output && !showRawOutput && <Markdown>{output}</Markdown>}
          </Card.Body>
        </Card>
      )}
      {errorAlertElements}
    </div>
  );
};
