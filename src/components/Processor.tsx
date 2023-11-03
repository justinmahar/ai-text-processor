import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import React from 'react';
import { Accordion, Alert, Badge, Button, Card, Form, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import {
  FaAlignLeft,
  FaCheck,
  FaCheckSquare,
  FaCopy,
  FaSave,
  FaSoap,
  FaTrash,
  FaTrashAlt,
  FaWrench,
} from 'react-icons/fa';
import { useMomentaryBool } from 'react-use-precision-timer';
import { Markdown } from './Markdown';
import { AIModel, defaultOpenAiModels } from './open-ai-models';
import { TextUtils } from './TextUtils';
import { LocalSettingsDefaults, LocalSettingsKeys, TextProcessor, useLocalSettings } from './useLocalSettings';

export interface ProcessorProps extends DivProps {}

export const Processor = ({ ...props }: ProcessorProps) => {
  const localSettings = useLocalSettings();
  const [processors, setProcessors] = localSettings[LocalSettingsKeys.processors];
  const [processorName, setProcessorName] = localSettings[LocalSettingsKeys.processorName];
  const [openAiModel, setOpenAiModel] = localSettings[LocalSettingsKeys.openAiModel];
  const [systemPrompt, setSystemPrompt] = localSettings[LocalSettingsKeys.systemPrompt];
  const [userPrompt, setUserPrompt] = localSettings[LocalSettingsKeys.userPrompt];
  const [input, setInput] = localSettings[LocalSettingsKeys.input];
  const [outputs, setOutputs] = localSettings[LocalSettingsKeys.outputs];
  const [openAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [customOpenAiModels] = localSettings[LocalSettingsKeys.customOpenAiModels];
  const mergedOpenAiModels: AIModel[] = [...defaultOpenAiModels, ...(customOpenAiModels ?? [])];
  const [showRawOutput, setShowRawOutput] = localSettings[LocalSettingsKeys.showRawOutput];
  const [copied, toggleCopied] = useMomentaryBool(false, 2000);
  const [xhr, setXhr] = React.useState<XMLHttpRequest | undefined>(undefined);
  const errorsRef = React.useRef<any[]>([]);
  const [renderTime, setRenderTime] = React.useState(0);
  const [selectedProcessorName, setSelectedProcessorName] = localSettings[LocalSettingsKeys.selectedProcessorName];
  const [averageTokenLength, setAverageTokenLength] = localSettings[LocalSettingsKeys.averageTokenLength];
  const [requestMaxTokenRatio, setRequestMaxTokenRatio] = localSettings[LocalSettingsKeys.requestMaxTokenRatio];
  const [chunkOverlapWordCount, setChunkOverlapWordCount] = localSettings[LocalSettingsKeys.chunkOverlapWordCount];
  const [chunkPrefix, setChunkPrefix] = localSettings[LocalSettingsKeys.chunkPrefix];
  const [showChunkInspector] = localSettings[LocalSettingsKeys.showChunkInspector];
  const [autoScrubEnabled, setAutoScrubEnabled] = localSettings[LocalSettingsKeys.autoScrubEnabled];
  const currentOpenAiModelInfo = mergedOpenAiModels.find((m) => m.id === openAiModel);
  const [currentChunkIndex, setCurrentChunkIndex] = React.useState(-1);
  const processingRef = React.useRef(false);
  const outputsRef = React.useRef<string[]>([]);
  const inputTextFieldRef = React.useRef<HTMLTextAreaElement | null>(null);

  const chunks = TextUtils.getChunks(
    `${systemPrompt}`,
    `${userPrompt}`,
    `${input}`,
    currentOpenAiModelInfo?.maxTokens ?? 0,
    {
      averageTokenLength: averageTokenLength ?? 4,
      requestMaxTokenRatio: requestMaxTokenRatio ?? 0.6,
      chunkOverlapWordCount: chunkOverlapWordCount ?? 20,
      chunkPrefix: `${chunkPrefix}`,
    },
  );

  const processChunk = (chunkIndex: number) => {
    const chunk = chunks[chunkIndex];
    if (chunk) {
      setCurrentChunkIndex(chunkIndex);
      processingRef.current = true;
      setRenderTime(Date.now());
      // Configure the stream
      const streamConfig: ClientStreamChatCompletionConfig = {
        apiKey: `${openAiKey}`, // Your API key
        handler: {
          // Content contains the string draft, which may be partial. When isFinal is true, the completion is done.
          onContent(content, isFinal, xhr) {
            const newOutputs = [...outputsRef.current.slice(0, chunkIndex), content];
            outputsRef.current = newOutputs;
            setOutputs(newOutputs);
          },
          onDone(xhr) {
            setXhr(undefined);
            if (processingRef.current) {
              processChunk(chunkIndex + 1);
            }
          },
          onError(error, status, xhr) {
            console.error(error);
            setXhr(undefined);
            processingRef.current = false;
            errorsRef.current = [...errorsRef.current, error];
            setRenderTime(Date.now());
          },
        },
      };

      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: `${userPrompt}\n\n${chunk}`.trim() });

      // Make the call and store a reference to the XMLHttpRequest
      const xhr = OpenAIExt.streamClientChatCompletion(
        {
          model: `${openAiModel}`,
          messages,
        },
        streamConfig,
      );
      setXhr(xhr);
    } else {
      processingRef.current = false;
      setRenderTime(Date.now());
      setXhr(undefined);
    }
  };

  const handleExecute = () => {
    setOutputs([]);
    outputsRef.current = [];
    errorsRef.current = [];
    processingRef.current = true;
    setRenderTime(Date.now());
    processChunk(0);
  };

  const handleStop = () => {
    processingRef.current = false;
    xhr?.abort();
    setRenderTime(Date.now());
  };

  const handleClearInput = () => {
    setInput('');
  };

  const handleScrub = () => {
    setInput(TextUtils.scrubText(input));
  };

  const handleSelectProcessor = (processorName: string) => {
    if (!processorName) {
      setSelectedProcessorName('');
      setProcessorName(LocalSettingsDefaults[LocalSettingsKeys.processorName]);
      setOpenAiModel(LocalSettingsDefaults[LocalSettingsKeys.openAiModel]);
      setSystemPrompt(LocalSettingsDefaults[LocalSettingsKeys.systemPrompt]);
      setUserPrompt(LocalSettingsDefaults[LocalSettingsKeys.userPrompt]);
      setAverageTokenLength(LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength]);
      setRequestMaxTokenRatio(LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio]);
      setChunkOverlapWordCount(LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount]);
      setChunkPrefix(LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix]);
    } else {
      const selectedProcessor = (processors ?? {})[processorName];
      if (selectedProcessor) {
        setSelectedProcessorName(processorName);
        setProcessorName(selectedProcessor.name ?? LocalSettingsDefaults[LocalSettingsKeys.processorName]);
        setOpenAiModel(selectedProcessor.aiModel ?? LocalSettingsDefaults[LocalSettingsKeys.openAiModel]);
        setSystemPrompt(selectedProcessor.systemPrompt ?? LocalSettingsDefaults[LocalSettingsKeys.systemPrompt]);
        setUserPrompt(selectedProcessor.userPrompt ?? LocalSettingsDefaults[LocalSettingsKeys.userPrompt]);
        setAverageTokenLength(
          selectedProcessor.averageTokenLength ?? LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength],
        );
        setRequestMaxTokenRatio(
          selectedProcessor.requestMaxTokenRatio ?? LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio],
        );
        setChunkOverlapWordCount(
          selectedProcessor.chunkOverlapWordCount ?? LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount],
        );
        setChunkPrefix(selectedProcessor.chunkPrefix ?? LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix]);
        inputTextFieldRef.current?.select();
      }
    }
  };

  const handleSaveProcessor = () => {
    const processorToSave: TextProcessor = {
      name: processorName,
      aiModel: openAiModel,
      systemPrompt: systemPrompt,
      userPrompt: userPrompt,
      averageTokenLength,
      requestMaxTokenRatio,
      chunkOverlapWordCount,
      chunkPrefix,
    };
    const newProcessors: Record<string, any> = { ...(processors ?? {}), [processorToSave.name]: processorToSave };
    const newProcessorsSorted: Record<string, any> = {};
    Object.keys(newProcessors)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        newProcessorsSorted[key] = newProcessors[key];
      });
    setProcessors(newProcessorsSorted);
    setSelectedProcessorName(processorName);
    setRenderTime(Date.now());
  };

  const handleDeleteProcessor = () => {
    if (selectedProcessorName) {
      const newProcessors = { ...(processors ?? {}) };
      delete newProcessors[selectedProcessorName];
      setProcessors(newProcessors);
    }
    handleSelectProcessor('');
  };

  const handleCopy = () => {
    copy((outputs ?? []).join('\n\n'));
    toggleCopied();
  };

  const handleClear = () => {
    setOutputs([]);
    outputsRef.current = [];
    errorsRef.current = [];
    setRenderTime(Date.now());
    xhr?.abort();
    processingRef.current = false;
    setXhr(undefined);
  };

  const handleInputTextFieldFocus = () => {
    inputTextFieldRef.current?.select();
  };

  const openAiModelOptions = mergedOpenAiModels.map((model, i) => {
    return (
      <option key={`open-ai-model-${i}`} value={model.id}>
        {model.name}
      </option>
    );
  });

  const errorAlertElements = errorsRef.current.map((error, i) => {
    let messageString = `${error}`;
    try {
      const errorObj = JSON.parse(error.message);
      messageString = errorObj.error?.message ?? messageString;
    } catch (e) {
      // Ignore
    }
    return (
      <Alert variant="danger" key={`error-${i}`} className="mb-0">
        <Markdown>{messageString}</Markdown>
      </Alert>
    );
  });

  const processorKeys = Object.keys(processors ?? {});
  const processorOptionElements: JSX.Element[] = processorKeys.map((processorKey) => {
    return (
      <option key={`${processorKey}`} value={processorKey}>
        {processorKey}
      </option>
    );
  });

  const chunkElements = chunks.map((chunk, i) => {
    return (
      <Alert key={`chunk-${i}`} variant="secondary">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <h6 className="mb-0">
            <Badge bg="secondary">Chunk #{i + 1}</Badge>
          </h6>
          <div className="d-flex align-items-center gap-2 fw-bold">
            <div>Tokens:</div>
            <div>
              <Badge pill bg="secondary">
                {TextUtils.getEstimatedTokenCount(systemPrompt + userPrompt + chunk, averageTokenLength ?? 0)}
              </Badge>
            </div>
          </div>
        </div>
        <hr />
        {systemPrompt && <p>{systemPrompt}</p>}
        {userPrompt && <p>{userPrompt}</p>}
        {chunk && <p>{chunk}</p>}
      </Alert>
    );
  });

  const outputElements = (outputs ?? []).map((output, i) => {
    return (
      <Alert key={`output-${i}`} variant="light" className="text-black">
        <Markdown>{output}</Markdown>
      </Alert>
    );
  });

  const canSave = !!processorName.trim();
  const configured = !!openAiModel && !!userPrompt;
  const canExecute = configured && !!input;

  return (
    <div {...props} className={classNames('d-flex flex-column gap-3', props.className)} style={{ ...props.style }}>
      <Card>
        <Card.Header>AI Text Processor</Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-2">
            {!openAiKey && (
              <Alert variant="danger">
                You must add your OpenAI API key in{' '}
                <a href="https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--settings">
                  Settings
                </a>{' '}
                before using this utility.
              </Alert>
            )}
            <Form.Select value={selectedProcessorName} onChange={(e) => handleSelectProcessor(e.target.value)}>
              <option value="">New Processor</option>
              {processorOptionElements}
            </Form.Select>
            <Accordion
              key={`accordion-${!selectedProcessorName ? 'new' : 'saved'}`}
              defaultActiveKey={!selectedProcessorName ? '1' : undefined}
            >
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <div className="d-flex align-items-center gap-2">
                    {!configured ? <FaWrench /> : <FaCheckSquare className="text-success" />} Processor Configuration
                  </div>
                </Accordion.Header>
                <Accordion.Body className="d-flex flex-column gap-2">
                  <Form.Group controlId="name-group">
                    <Form.Label className="small fw-bold mb-1">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter a processor name"
                      value={processorName}
                      onChange={(e) => setProcessorName(e.target.value)}
                    />
                    <Form.Text className="text-muted">Provide a name for this processor.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="model-group">
                    <Form.Label className="small fw-bold mb-1">AI Model</Form.Label>
                    <Form.Select value={openAiModel} onChange={(e) => setOpenAiModel(e.target.value)}>
                      <option value="">AI Model...</option>
                      {openAiModelOptions}
                    </Form.Select>
                    <Form.Text className="text-muted">Select the AI model to use.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="system-prompt-group">
                    <Form.Label className="small fw-bold mb-1">System Prompt</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter the system prompt"
                      rows={1}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                    <div className="d-flex justify-content-between gap-2">
                      <Form.Text className="text-muted">Provide a system prompt for the language model.</Form.Text>
                      <div className="d-flex align-items-center gap-1 small">
                        <Form.Text className="text-muted my-0">Tokens:</Form.Text>
                        <Badge pill bg="secondary">
                          {TextUtils.getEstimatedTokenCount(systemPrompt, averageTokenLength ?? 0)}
                        </Badge>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="user-prompt-group">
                    <Form.Label className="small fw-bold mb-1">User Prompt</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter the user prompt"
                      rows={3}
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                    />
                    <div className="d-flex justify-content-between gap-2">
                      <Form.Text className="text-muted">
                        Provide the prompt used to process the text. The input text will be appended to the end of this
                        prompt.
                      </Form.Text>
                      <div className="d-flex align-items-center gap-1 small">
                        <Form.Text className="text-muted my-0">Tokens:</Form.Text>
                        <Badge pill bg="secondary">
                          {TextUtils.getEstimatedTokenCount(userPrompt, averageTokenLength ?? 0)}
                        </Badge>
                      </div>
                    </div>
                  </Form.Group>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Advanced Config</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group controlId="form-group-averageTokenLength">
                          <Form.Label className="small fw-bold mb-1">Average token length:</Form.Label>
                          <Form.Control
                            type="number"
                            min={0}
                            step={0.1}
                            value={averageTokenLength}
                            onChange={(e) => setAverageTokenLength(parseFloat(e.target.value))}
                          />
                          <Form.Text className="text-muted">
                            This value will be used to estimate the amount of tokens for a given request. Use OpenAI's{' '}
                            <a href="https://platform.openai.com/tokenizer">tokenizer</a> to estimate this value by
                            dividing characters by tokens for a given input. OpenAI suggests <code>4</code> as a
                            conservative average.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="form-group-requestMaxTokenRatio">
                          <Form.Label className="small fw-bold mb-1">Request max token ratio:</Form.Label>
                          <Form.Control
                            type="number"
                            min={0}
                            step={0.1}
                            max={0.99}
                            value={requestMaxTokenRatio}
                            onChange={(e) => setRequestMaxTokenRatio(parseFloat(e.target.value))}
                          />
                          <Form.Text className="text-muted">
                            Requests will not send more than this ratio of the max tokens for the model, and will be
                            chunked if exceeded. If the ratio is {requestMaxTokenRatio} (
                            {`${Math.round(requestMaxTokenRatio * 100)}%`}), and the max tokens for the model is{' '}
                            {currentOpenAiModelInfo?.maxTokens ?? 4000}, each request (chunk) will have{' '}
                            {Math.ceil((currentOpenAiModelInfo?.maxTokens ?? 4000) * requestMaxTokenRatio)} tokens max.
                            This would leave about{' '}
                            {(currentOpenAiModelInfo?.maxTokens ?? 4000) -
                              Math.ceil((currentOpenAiModelInfo?.maxTokens ?? 4000) * requestMaxTokenRatio)}{' '}
                            tokens for a meaningful response, per request. For each chunk, we want to make sure there is
                            still a decent amount of tokens left for the response.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="form-group-chunkOverlapWordCount">
                          <Form.Label className="small fw-bold mb-1">Chunk overlap word count:</Form.Label>
                          <Form.Control
                            type="number"
                            min={0}
                            step={1}
                            value={chunkOverlapWordCount}
                            onChange={(e) => setChunkOverlapWordCount(parseInt(e.target.value))}
                          />
                          <Form.Text className="text-muted">
                            When chunking, chunks will overlap by this many words to help preserve meaning. Words are
                            delimited by spaces.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="form-group-chunkPrefix">
                          <Form.Label className="small fw-bold mb-1">Chunk prefix:</Form.Label>
                          <Form.Control
                            type="text"
                            value={chunkPrefix}
                            onChange={(e) => setChunkPrefix(e.target.value)}
                          />
                          <Form.Text className="text-muted">
                            When chunking, subsequent chunks will be prefixed with this text to indicate a continuation.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="outline-primary" onClick={handleSaveProcessor} disabled={!canSave}>
                      <FaSave className="mb-1" />
                    </Button>
                    <Button variant="outline-danger" onClick={handleDeleteProcessor}>
                      <FaTrashAlt className="mb-1" />
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Form.Group controlId="form-group-input-text">
              <Form.Label className="small fw-bold mb-1">Input Text</Form.Label>
              <Form.Control
                ref={inputTextFieldRef}
                as="textarea"
                placeholder="Enter text to process"
                rows={8}
                value={input}
                onChange={(e) => {
                  if (autoScrubEnabled) {
                    setInput(TextUtils.scrubText(e.target.value));
                  } else {
                    setInput(e.target.value);
                  }
                }}
                onFocus={handleInputTextFieldFocus}
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div className="d-flex align-items-center gap-2">
                <Button variant="outline-danger" size="sm" onClick={handleClearInput}>
                  Clear
                </Button>
                <Button variant="outline-primary" size="sm" onClick={handleScrub}>
                  <div className="d-flex align-items-center gap-1">
                    <FaSoap />
                    Scrub
                  </div>
                </Button>
                <Form.Check
                  inline
                  label="Auto-scrub"
                  className="user-select-none small mb-0"
                  id="auto-scrub-checkbox"
                  checked={!!autoScrubEnabled}
                  onChange={(e) => setAutoScrubEnabled(e.target.checked)}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-1 small">
                  <Form.Text className="text-muted my-0">Chunks:</Form.Text>
                  <Badge pill bg="secondary">
                    {chunks.length}
                  </Badge>
                </div>
                <div className="d-flex align-items-center gap-1 small">
                  <Form.Text className="text-muted my-0">Tokens:</Form.Text>
                  <Badge pill bg="secondary">
                    {TextUtils.getEstimatedTokenCount(input, averageTokenLength ?? 0)}
                  </Badge>
                </div>
              </div>
            </div>
            {showChunkInspector && (
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <FaAlignLeft /> Chunk Inspector{' '}
                      <Badge pill bg="primary">
                        {chunks.length}
                      </Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {chunkElements}
                    {chunkElements.length === 0 && <div>No chunks to display.</div>}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            <div className="d-flex justify-content-center gap-2">
              {!processingRef.current && (
                <Button size="lg" variant="primary" onClick={handleExecute} disabled={!canExecute}>
                  Execute
                </Button>
              )}
              {processingRef.current && (
                <Button size="lg" variant="danger" onClick={handleStop}>
                  Stop
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      {(xhr || (outputs ?? []).length > 0) && (
        <div className="d-flex flex-column gap-1">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                Output
                {processingRef.current && (
                  <div className="d-flex align-items-center gap-2">
                    <Spinner animation="border" role="status" size="sm" />
                    <div className="small fw-bold">
                      Chunk {currentChunkIndex + 1} of {chunks.length}...
                    </div>
                  </div>
                )}
              </div>
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
              {!outputs && <Spinner animation="border" role="status" size="sm" />}
              {outputs && showRawOutput && <pre>{outputs.join('\n\n')}</pre>}
              {outputs && !showRawOutput && outputElements}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-end">
            <div className="d-flex align-items-center gap-1 small">
              <Form.Text className="text-muted my-0">Tokens:</Form.Text>
              <Badge pill bg="secondary">
                {TextUtils.getEstimatedTokenCount((outputs ?? []).join(' '), averageTokenLength ?? 0)}
              </Badge>
            </div>
          </div>
        </div>
      )}
      {errorAlertElements}
    </div>
  );
};
