import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import React from 'react';
import { Accordion, Alert, Badge, Button, ButtonGroup, Card, Dropdown, Form, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import {
  FaAlignLeft,
  FaCheck,
  FaCheckSquare,
  FaCopy,
  FaInfoCircle,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaTrashAlt,
  FaUndo,
  FaWrench,
} from 'react-icons/fa';
import { useMomentaryBool } from 'react-use-precision-timer';
import { Markdown } from './Markdown';
import { Preset, defaultAiModelOption as defaultAiModelValue, defaultPresetsMap, toSortedPresetsMap } from './Preset';
import { TextUtils } from './TextUtils';
import { AIModelInfo, defaultOpenAiModelInfos } from './AIModelInfo';
import { LocalSettingsDefaults, LocalSettingsKeys, useLocalSettings } from './useLocalSettings';

export const CHAR_LIMIT = 2000000;

export interface AITextProcessorProps extends DivProps {}

export const AITextProcessor = ({ ...props }: AITextProcessorProps) => {
  const localSettings = useLocalSettings();
  const [presets, setPresets] = localSettings[LocalSettingsKeys.presets];
  const mergedPresets = toSortedPresetsMap([...Object.values(defaultPresetsMap), ...Object.values(presets ?? {})]);
  const [presetName, setPresetName] = localSettings[LocalSettingsKeys.presetName];
  const [presetDescription, setPresetDescription] = localSettings[LocalSettingsKeys.presetDescription];
  const [openAiModel, setOpenAiModel] = localSettings[LocalSettingsKeys.openAiModel];
  const useDefaultAiModel = openAiModel === defaultAiModelValue;
  const [systemPrompt, setSystemPrompt] = localSettings[LocalSettingsKeys.systemPrompt];
  const [userPrompt, setUserPrompt] = localSettings[LocalSettingsKeys.userPrompt];
  const variables = [...new Set(`${systemPrompt}\n${userPrompt}`.match(/\{\{([\w_-]+)\}\}/g) ?? [])];
  const [variableValues, setVariableValues] = localSettings[LocalSettingsKeys.variableValues];
  const [variableOptions, setVariableOptions] = localSettings[LocalSettingsKeys.variableOptions];
  const [input, setInput] = localSettings[LocalSettingsKeys.input];
  const [outputs, setOutputs] = localSettings[LocalSettingsKeys.outputs];
  const [openAiKey] = localSettings[LocalSettingsKeys.openAiKey];
  const [customOpenAiModelInfos] = localSettings[LocalSettingsKeys.customOpenAiModelInfos];
  const mergedOpenAiModelInfos: AIModelInfo[] = [...defaultOpenAiModelInfos, ...(customOpenAiModelInfos ?? [])];
  const [defaultOpenAiModel] = localSettings[LocalSettingsKeys.defaultOpenAiModel];
  const aiModelToUse = useDefaultAiModel ? defaultOpenAiModel : openAiModel;
  const [showRawOutput, setShowRawOutput] = localSettings[LocalSettingsKeys.showRawOutput];
  const [copied, toggleCopied] = useMomentaryBool(false, 2000);
  const [xhr, setXhr] = React.useState<XMLHttpRequest | undefined>(undefined);
  const errorsRef = React.useRef<any[]>([]);
  const [renderTime, setRenderTime] = React.useState(0);
  const [selectedPresetName, setSelectedPresetName] = localSettings[LocalSettingsKeys.selectedPresetName];
  const [averageTokenLength, setAverageTokenLength] = localSettings[LocalSettingsKeys.averageTokenLength];
  const [requestMaxTokenRatio, setRequestMaxTokenRatio] = localSettings[LocalSettingsKeys.requestMaxTokenRatio];
  const [chunkOverlapWordCount, setChunkOverlapWordCount] = localSettings[LocalSettingsKeys.chunkOverlapWordCount];
  const [chunkPrefix, setChunkPrefix] = localSettings[LocalSettingsKeys.chunkPrefix];
  const [showChunkInspector] = localSettings[LocalSettingsKeys.showChunkInspector];
  const [autoShrinkEnabled, setAutoShrinkEnabled] = localSettings[LocalSettingsKeys.autoShrinkEnabled];
  const currentOpenAiModelInfo = mergedOpenAiModelInfos.find((m) => m.id === aiModelToUse);
  const [currentChunkIndex, setCurrentChunkIndex] = React.useState(-1);
  const processingRef = React.useRef(false);
  const outputsRef = React.useRef<string[]>([]);
  const inputTextFieldRef = React.useRef<HTMLTextAreaElement | null>(null);
  const retryingRef = React.useRef(false);
  const [showDeletePresetConfirmation, setShowDeletePresetConfirmation] = React.useState(false);
  const [variableDeletionConfirmationIndex, setVariableDeletionConfirmationIndex] = React.useState(-1);
  const [showDeleteOutputConfirmation, setShowDeleteOutputConfirmation] = React.useState(false);

  let preparedUserPrompt: string = userPrompt ?? '';
  variables.forEach((variable) => {
    const replacement = (variableValues ?? {})[variable] ?? '';
    preparedUserPrompt = preparedUserPrompt.split(variable).join(replacement);
  });

  const chunks = TextUtils.getChunks(
    `${systemPrompt}`,
    `${preparedUserPrompt}`,
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
            setRenderTime(Date.now());
            if (processingRef.current && !retryingRef.current) {
              setTimeout(() => {
                processChunk(chunkIndex + 1);
              }, 1000);
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
      messages.push({ role: 'user', content: `${preparedUserPrompt}\n\n${chunk}`.trim() });

      // Make the call and store a reference to the XMLHttpRequest
      const xhr = OpenAIExt.streamClientChatCompletion(
        {
          model: `${aiModelToUse}`,
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

  const handleRetryChunk = () => {
    retryingRef.current = true;
    xhr?.abort();
    errorsRef.current = [];
    processingRef.current = true;
    const newOutputs = outputsRef.current.slice(0, currentChunkIndex);
    outputsRef.current = newOutputs;
    setOutputs(newOutputs);
    setRenderTime(Date.now());
    setTimeout(() => {
      retryingRef.current = false;
      setRenderTime(Date.now());
      processChunk(currentChunkIndex);
    }, 1000);
  };

  const handleSetUserPrompt = (text: string) => {
    setUserPrompt(text);
    setVariableDeletionConfirmationIndex(-1);
  };

  const handleSetInput = (text: string) => {
    if (autoShrinkEnabled) {
      setInput(TextUtils.shrinkText(text).substring(0, CHAR_LIMIT));
    } else {
      setInput(text.substring(0, CHAR_LIMIT));
    }
  };

  const handlePaste = () => {
    navigator.permissions
      .query({
        name: 'clipboard-read',
      } as any)
      .then((permission) => {
        navigator.clipboard
          .readText()
          .then((text) => {
            handleSetInput(text);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  const handleClearInput = () => {
    setInput('');
  };

  const handleShrink = () => {
    setInput(TextUtils.shrinkText(input).trim());
  };

  const handleSelectPreset = (presetName: string) => {
    if (!presetName) {
      setSelectedPresetName('');
      setPresetName(LocalSettingsDefaults[LocalSettingsKeys.presetName]);
      setPresetDescription(LocalSettingsDefaults[LocalSettingsKeys.presetDescription]);
      setOpenAiModel(LocalSettingsDefaults[LocalSettingsKeys.openAiModel]);
      setSystemPrompt(LocalSettingsDefaults[LocalSettingsKeys.systemPrompt]);
      setUserPrompt(LocalSettingsDefaults[LocalSettingsKeys.userPrompt]);
      setAverageTokenLength(LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength]);
      setRequestMaxTokenRatio(LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio]);
      setChunkOverlapWordCount(LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount]);
      setChunkPrefix(LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix]);
      setAutoShrinkEnabled(LocalSettingsDefaults[LocalSettingsKeys.autoShrinkEnabled]);
      setVariableValues(LocalSettingsDefaults[LocalSettingsKeys.variableValues]);
      setVariableOptions(LocalSettingsDefaults[LocalSettingsKeys.variableOptions]);
    } else {
      const chosenPreset: Preset | undefined = (mergedPresets ?? {})[presetName];
      if (chosenPreset) {
        setSelectedPresetName(presetName);
        setPresetName(chosenPreset?.name ?? LocalSettingsDefaults[LocalSettingsKeys.presetName]);
        setPresetDescription(chosenPreset?.description ?? LocalSettingsDefaults[LocalSettingsKeys.presetDescription]);
        setOpenAiModel(chosenPreset?.aiModel ?? LocalSettingsDefaults[LocalSettingsKeys.openAiModel]);
        setSystemPrompt(chosenPreset?.systemPrompt ?? LocalSettingsDefaults[LocalSettingsKeys.systemPrompt]);
        setUserPrompt(chosenPreset?.userPrompt ?? LocalSettingsDefaults[LocalSettingsKeys.userPrompt]);
        setAverageTokenLength(
          chosenPreset?.averageTokenLength ?? LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength],
        );
        setRequestMaxTokenRatio(
          chosenPreset?.requestMaxTokenRatio ?? LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio],
        );
        setChunkOverlapWordCount(
          chosenPreset?.chunkOverlapWordCount ?? LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount],
        );
        setChunkPrefix(chosenPreset?.chunkPrefix ?? LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix]);
        setAutoShrinkEnabled(chosenPreset?.autoShrink ?? LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix]);
        setVariableValues(chosenPreset?.variableValues ?? LocalSettingsDefaults[LocalSettingsKeys.variableValues]);
        setVariableOptions(chosenPreset?.variableOptions ?? LocalSettingsDefaults[LocalSettingsKeys.variableOptions]);
      }
    }
    setVariableDeletionConfirmationIndex(-1);
  };

  const handleSavePreset = () => {
    const presetToSave: Preset = {
      name: presetName,
      description: presetDescription,
      aiModel: openAiModel,
      systemPrompt: systemPrompt,
      userPrompt: userPrompt,
      averageTokenLength,
      requestMaxTokenRatio,
      chunkOverlapWordCount,
      chunkPrefix,
      autoShrink: !!autoShrinkEnabled,
      variableValues: variableValues ?? {},
      variableOptions: variableOptions ?? {},
    };
    const newPresets: Preset[] = [...Object.values(mergedPresets ?? {}), presetToSave];
    const newPresetsSortedMap: Record<string, Preset> = toSortedPresetsMap(newPresets);
    setPresets(newPresetsSortedMap);
    setSelectedPresetName(presetName);
    setRenderTime(Date.now());
  };

  const handleDeletePreset = () => {
    setShowDeletePresetConfirmation(true);
  };

  const handleConfirmDeletePreset = () => {
    if (selectedPresetName) {
      const newPresets = { ...(mergedPresets ?? {}) };
      delete newPresets[selectedPresetName];
      setPresets(newPresets);
    }
    handleSelectPreset('');
    setShowDeletePresetConfirmation(false);
  };

  const handleCancelDeletePreset = () => {
    setShowDeletePresetConfirmation(false);
  };

  const handleResetPreset = () => {
    handleSelectPreset(selectedPresetName);
  };

  const handleCopy = () => {
    copy((outputs ?? []).join('\n\n'));
    toggleCopied();
  };

  const handleDeleteOutput = () => {
    setShowDeleteOutputConfirmation(true);
  };

  const handleConfirmDeleteOutput = () => {
    setOutputs([]);
    outputsRef.current = [];
    errorsRef.current = [];
    setRenderTime(Date.now());
    xhr?.abort();
    processingRef.current = false;
    setXhr(undefined);
    setShowDeleteOutputConfirmation(false);
  };

  const handleCancelDeleteOutput = () => {
    setShowDeleteOutputConfirmation(false);
  };

  const handleInputTextFieldFocus = () => {
    inputTextFieldRef.current?.select();
  };

  const openAiModelOptionElements = mergedOpenAiModelInfos.map((model, i) => {
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

  const presetKeys = Object.keys(mergedPresets ?? {});
  const presetOptionElements: JSX.Element[] = presetKeys.map((presetKey) => {
    const preset = (mergedPresets ?? {})[presetKey];
    const presetUsingDefaultAiModel = preset.aiModel === defaultAiModelValue;
    return (
      <option key={`${presetKey}`} value={presetKey}>
        {presetKey} (
        {presetUsingDefaultAiModel
          ? mergedOpenAiModelInfos.find((m) => m.id === defaultOpenAiModel)?.name ?? defaultOpenAiModel
          : `${mergedOpenAiModelInfos.find((m) => m.id === preset.aiModel)?.name ?? preset.aiModel}`}
        )
      </option>
    );
  });

  const dollarPrecision = 10000;

  const totalInputCost =
    Math.round(
      (chunks
        .map((chunk) => systemPrompt + ' ' + preparedUserPrompt + '\n\n' + chunk)
        .map((payload) => TextUtils.getEstimatedTokenCount(payload, averageTokenLength ?? 0))
        .reduce((p, c) => p + c, 0) /
        1000) *
        (currentOpenAiModelInfo?.costPer1kInput ?? 0) *
        dollarPrecision,
    ) / dollarPrecision;

  const totalOutputCost =
    Math.round(
      ((outputs ?? [])
        .map((output) => TextUtils.getEstimatedTokenCount(output, averageTokenLength ?? 0))
        .reduce((p, c) => p + c, 0) /
        1000) *
        (currentOpenAiModelInfo?.costPer1kOutput ?? 0) *
        dollarPrecision,
    ) / dollarPrecision;

  const totalCost = Math.round((totalInputCost + totalOutputCost) * dollarPrecision) / dollarPrecision;

  const chunkElements = chunks.map((chunk, i) => {
    const tokenCount = TextUtils.getEstimatedTokenCount(
      systemPrompt + ' ' + preparedUserPrompt + '\n\n' + chunk,
      averageTokenLength ?? 0,
    );
    return (
      <Alert key={`chunk-${i}`} variant="secondary">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h6 className="mb-0">
            <Badge bg="secondary">Chunk #{i + 1}</Badge>
          </h6>
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2 fw-bold">
              <div>Tokens:</div>
              <div>
                <Badge pill bg="secondary">
                  {tokenCount}
                </Badge>
              </div>
            </div>
            {currentOpenAiModelInfo && (
              <div className="d-flex align-items-center gap-2 fw-bold">
                <div>Est Cost:</div>
                <div>
                  <Badge pill bg="secondary">
                    $
                    {Math.round(((tokenCount / 1000) * currentOpenAiModelInfo?.costPer1kInput ?? 0) * dollarPrecision) /
                      dollarPrecision}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr />
        {systemPrompt && <p>{systemPrompt}</p>}
        {preparedUserPrompt && <p>{preparedUserPrompt}</p>}
        {chunk && <p>{chunk}</p>}
      </Alert>
    );
  });

  const outputElements = (outputs ?? []).map((output, i, arr) => {
    const isLastOutput = i === arr.length - 1;
    return (
      <Alert key={`output-${i}`} variant="light" className="text-black mb-0">
        <Markdown>{output && processingRef.current && isLastOutput ? `${output}│` : `${output}`}</Markdown>
      </Alert>
    );
  });

  const handleSetVariableValue = (variable: string, value: string) => {
    const newVariableValues = { ...variableValues };
    newVariableValues[variable] = value;
    setVariableValues(newVariableValues);
  };

  const handleAddVariableOption = (variable: string, option: string) => {
    const newVariableOptions = { ...variableOptions };
    let newOptions = Array.isArray(newVariableOptions[variable]) ? newVariableOptions[variable] : [];
    newOptions = [...new Set([...newOptions, option])].sort((a: string, b: string) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
    newVariableOptions[variable] = newOptions;
    setVariableOptions(newVariableOptions);
  };

  const handleDeleteVariableOption = (variableIndex: number) => {
    setVariableDeletionConfirmationIndex(variableIndex);
  };

  const handleConfirmDeleteVariableOption = (variable: string, option: string) => {
    const newVariableOptions = { ...variableOptions };
    const newOptions: string[] = Array.isArray(newVariableOptions[variable]) ? newVariableOptions[variable] : [];
    if (newOptions.includes(option)) {
      newOptions.splice(newOptions.indexOf(option), 1);
      newVariableOptions[variable] = newOptions;
      setVariableOptions(newVariableOptions);
    }
    handleSetVariableValue(variable, '');
    setVariableDeletionConfirmationIndex(-1);
  };

  const handleCancelDeleteVariableOption = () => {
    setVariableDeletionConfirmationIndex(-1);
  };

  const variableElements = variables.map((variable, i) => {
    const currVarValue = (variableValues ?? {})[variable] ?? '';
    const currVarName = variable
      .substring(2, variable.length - 2)
      .split('_')
      .join(' ');
    const currVarOpts: string[] = Array.isArray(variableOptions[variable]) ? variableOptions[variable] : [];
    const currValueDropdownItemElements = currVarOpts.map((varValue: any, j: number) => (
      <Dropdown.Item key={`var-${i}-dropdown-item-${j}`} onClick={() => handleSetVariableValue(variable, varValue)}>
        {varValue}
      </Dropdown.Item>
    ));
    const canAddVariableOption = !!currVarValue && !currVarOpts.includes(currVarValue);
    const canDeleteVariableOption = !!currVarValue;
    return (
      <div key={`variable-${i}`} className="d-flex flex-wrap gap-1 mb-1">
        <Form.Control size="sm" type="text" disabled value={currVarName} style={{ width: 150 }} />
        <Dropdown as={ButtonGroup}>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Value"
            value={currVarValue}
            onChange={(e) => handleSetVariableValue(variable, e.target.value)}
            style={{ width: 150, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <Dropdown.Toggle split variant="secondary" id={`variable-dropdown-${currVarName}`} />
          <Dropdown.Menu>{currValueDropdownItemElements}</Dropdown.Menu>
        </Dropdown>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleAddVariableOption(variable, currVarValue)}
          disabled={!canAddVariableOption}
        >
          <FaPlus className="mb-1" />
        </Button>
        {i !== variableDeletionConfirmationIndex && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteVariableOption(i)}
            disabled={!canDeleteVariableOption}
          >
            <FaTrashAlt className="mb-1" />
          </Button>
        )}
        {i === variableDeletionConfirmationIndex && (
          <div className="d-flex align-items-center gap-1">
            <Button
              size="sm"
              variant="outline-danger"
              onClick={(e) => {
                handleConfirmDeleteVariableOption(variable, currVarValue);
              }}
            >
              <FaCheck className="mb-1" />
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={(e) => {
                handleCancelDeleteVariableOption();
              }}
            >
              <FaTimes className="mb-1" />
            </Button>
          </div>
        )}
      </div>
    );
  });

  const showProcessingAlert =
    processingRef.current && ((outputs ?? []).length < currentChunkIndex + 1 || retryingRef.current);

  const selectedPreset: Preset | undefined = (mergedPresets ?? {})[selectedPresetName];
  /** Has changes the user will be interested in saving. */
  const hasMeaningfulChanges =
    !selectedPreset ||
    (selectedPreset && selectedPreset?.name !== presetName) ||
    selectedPreset?.description !== presetDescription ||
    selectedPreset?.aiModel !== openAiModel ||
    selectedPreset?.systemPrompt !== systemPrompt ||
    selectedPreset?.userPrompt !== userPrompt ||
    selectedPreset?.averageTokenLength !== averageTokenLength ||
    selectedPreset?.requestMaxTokenRatio !== requestMaxTokenRatio ||
    selectedPreset?.chunkOverlapWordCount !== chunkOverlapWordCount ||
    selectedPreset?.chunkPrefix !== chunkPrefix ||
    !!selectedPreset?.autoShrink !== !!autoShrinkEnabled ||
    JSON.stringify(selectedPreset?.variableOptions ?? {}) !== JSON.stringify(variableOptions ?? {});
  /** Has changes the user might not necessarily be interested in saving. */
  const hasSuperfluousChanges =
    JSON.stringify(selectedPreset?.variableValues ?? {}) !== JSON.stringify(variableValues ?? {});
  const showUnsavedNotification = !!presetName.trim() && hasMeaningfulChanges;
  const canSave = !!presetName.trim() && (hasMeaningfulChanges || hasSuperfluousChanges);
  const canReset = !!selectedPreset && canSave;
  const configured = !!openAiModel && !!userPrompt;
  const canExecute = configured;
  const hasInput = (input ?? '').length > 0;

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
            <Form.Group controlId="select-preset">
              <Form.Select value={selectedPresetName} onChange={(e) => handleSelectPreset(e.target.value)}>
                <option value="">✨ New Preset</option>
                {presetOptionElements}
              </Form.Select>
              <Form.Text className="text-muted">
                Select a preset, or choose New Preset to create a new one. Note that default presets cannot be deleted.
              </Form.Text>
            </Form.Group>
            {presetDescription && (
              <Alert variant="info" className="mb-0 py-1">
                <div className="d-flex gap-2">
                  <FaInfoCircle className="mt-1" /> {presetDescription}
                </div>
              </Alert>
            )}
            <Accordion
              key={`accordion-${!selectedPresetName ? 'new' : 'saved'}`}
              defaultActiveKey={!selectedPresetName ? '1' : undefined}
            >
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <div className="d-flex flex-wrap justify-content-between gap-2 w-100 me-4">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      {!configured ? <FaWrench /> : <FaCheckSquare className="text-success" />} Preset Configuration
                      {showUnsavedNotification && <Badge bg="primary">Unsaved</Badge>}
                    </div>
                    <div className="d-flex justify-content-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          handleSavePreset();
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        disabled={!canSave}
                      >
                        <FaSave className="mb-1" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={(e) => {
                          handleResetPreset();
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        disabled={!canReset}
                      >
                        <FaUndo className="mb-1" />
                      </Button>
                      {!showDeletePresetConfirmation && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            handleDeletePreset();
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <FaTrashAlt className="mb-1" />
                        </Button>
                      )}
                      {showDeletePresetConfirmation && (
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => {
                              handleConfirmDeletePreset();
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <FaCheck className="mb-1" />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={(e) => {
                              handleCancelDeletePreset();
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <FaTimes className="mb-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="d-flex flex-column gap-2">
                  <Form.Group controlId="name-group">
                    <Form.Label className="small fw-bold mb-1">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter a preset name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                    />
                    <Form.Text className="text-muted">Provide a name for this preset.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="name-group">
                    <Form.Label className="small fw-bold mb-1">Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter a description"
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                    />
                    <Form.Text className="text-muted">Provide an optional description for this preset.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="model-group">
                    <Form.Label className="small fw-bold mb-1">AI Model</Form.Label>
                    <Form.Select value={openAiModel} onChange={(e) => setOpenAiModel(e.target.value)}>
                      <option value="">AI Model...</option>
                      <option value={defaultAiModelValue}>
                        Default (
                        {mergedOpenAiModelInfos.find((m) => m.id === defaultOpenAiModel)?.name ?? defaultOpenAiModel})
                      </option>
                      {openAiModelOptionElements}
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
                      onChange={(e) => handleSetUserPrompt(e.target.value)}
                    />
                    <div className="d-flex justify-content-between gap-2">
                      <Form.Text className="text-muted">
                        Provide the prompt used to process the text. The input text will be appended to the end of this
                        prompt. You can optionally include variables in double curly braces, like so: {`{{Var_Name}}`}
                      </Form.Text>
                      <div className="d-flex align-items-center gap-1 small">
                        <Form.Text className="text-muted my-0">Tokens:</Form.Text>
                        <Badge pill bg="secondary">
                          {TextUtils.getEstimatedTokenCount(preparedUserPrompt, averageTokenLength ?? 0)}
                        </Badge>
                      </div>
                    </div>
                  </Form.Group>
                  <Accordion>
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
                        <Form.Group controlId="form-group-auto-shrink" className="mt-3">
                          <Form.Check
                            label="Auto-shrink"
                            className="user-select-none small mb-0"
                            id="auto-shrink-checkbox"
                            checked={!!autoShrinkEnabled}
                            onChange={(e) => setAutoShrinkEnabled(e.target.checked)}
                          />
                          <Form.Text className="text-muted">
                            Shrinking condenses whitespace and removes timestamps (in the format #:#) to shorten the
                            input.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="outline-primary" onClick={handleSavePreset} disabled={!canSave}>
                      <FaSave className="mb-1" />
                    </Button>
                    <Button variant="outline-secondary" onClick={handleResetPreset} disabled={!canReset}>
                      <FaUndo className="mb-1" />
                    </Button>
                    {!showDeletePresetConfirmation && (
                      <Button
                        variant="outline-danger"
                        onClick={(e) => {
                          handleDeletePreset();
                        }}
                      >
                        <FaTrashAlt className="mb-1" />
                      </Button>
                    )}
                    {showDeletePresetConfirmation && (
                      <div className="d-flex align-items-center gap-1">
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            handleConfirmDeletePreset();
                          }}
                        >
                          <FaCheck className="mb-1" />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={(e) => {
                            handleCancelDeletePreset();
                          }}
                        >
                          <FaTimes className="mb-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {variableElements.length > 0 && (
              <Form.Group controlId="variables-group">
                <Form.Label className="small fw-bold mb-1">Variables:</Form.Label>
                {variableElements}
              </Form.Group>
            )}
            <Form.Group controlId="form-group-input-text">
              <Form.Label className="small fw-bold mb-1">Input Text</Form.Label>
              <Form.Control
                ref={inputTextFieldRef}
                as="textarea"
                placeholder="Enter text to process"
                rows={8}
                value={input}
                onChange={(e) => {
                  handleSetInput(e.target.value);
                }}
                onFocus={handleInputTextFieldFocus}
              />
            </Form.Group>
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <Button variant="outline-primary" size="sm" onClick={handlePaste}>
                  Paste
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleClearInput} disabled={!hasInput}>
                  Clear
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={handleShrink} disabled={!hasInput}>
                  <div className="d-flex align-items-center gap-1">Shrink</div>
                </Button>
                <Form.Check
                  inline
                  label="Auto-shrink"
                  className="user-select-none small mb-0"
                  id="auto-shrink-checkbox"
                  checked={!!autoShrinkEnabled}
                  onChange={(e) => setAutoShrinkEnabled(e.target.checked)}
                />
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2">
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
                <div className="d-flex align-items-center gap-1 small">
                  <Form.Text className="text-muted my-0">Est Cost:</Form.Text>
                  <Badge pill bg="secondary">
                    ${totalInputCost}
                  </Badge>
                </div>
              </div>
            </div>
            {(input ?? '').length === CHAR_LIMIT && (
              <Alert variant="info">
                Input text is limited to {CHAR_LIMIT} characters. Your current input has reached the max.
              </Alert>
            )}
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
      {(xhr || processingRef.current || errorsRef.current.length > 0 || (outputs ?? []).length > 0) && (
        <div className="d-flex flex-column gap-1">
          <Card>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                {processingRef.current && (
                  <div className="d-flex align-items-center gap-2">
                    <Spinner animation="border" role="status" size="sm" />
                  </div>
                )}
                Output
                {processingRef.current && (
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="secondary" className="small fw-bold">
                      Chunk {currentChunkIndex + 1} of {chunks.length}...
                    </Badge>
                  </div>
                )}
                {currentChunkIndex >= 0 && (
                  <Button variant="outline-primary" size="sm" onClick={handleRetryChunk} disabled={retryingRef.current}>
                    Retry Chunk
                  </Button>
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
                <Button size="sm" variant="outline-primary" onClick={handleCopy}>
                  {copied ? <FaCheck className="mb-1" /> : <FaCopy className="mb-1" />}
                </Button>
                {!showDeleteOutputConfirmation && (
                  <Button size="sm" variant="outline-danger" onClick={handleDeleteOutput}>
                    <FaTrash className="mb-1" />
                  </Button>
                )}
                {showDeleteOutputConfirmation && (
                  <div className="d-flex align-items-center gap-1">
                    <Button size="sm" variant="outline-danger" onClick={handleConfirmDeleteOutput}>
                      <FaCheck className="mb-1" />
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleCancelDeleteOutput}>
                      <FaTimes className="mb-1" />
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              {!outputs && <Spinner animation="border" role="status" size="sm" />}
              {outputs && showRawOutput && <pre>{outputs.join('\n\n')}</pre>}
              {outputs && !showRawOutput && outputElements}
              {showProcessingAlert && (
                <Alert variant="light" className="text-black mb-0">
                  <div className="d-flex align-items-center small gap-2">
                    <Spinner animation="border" role="status" size="sm" /> Processing chunk {currentChunkIndex + 1}...
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>
          <div className="d-flex flex-wrap justify-content-end gap-2">
            <div className="d-flex align-items-center gap-1 small">
              <Form.Text className="text-muted my-0">Tokens:</Form.Text>
              <Badge pill bg="secondary">
                {TextUtils.getEstimatedTokenCount((outputs ?? []).join(' '), averageTokenLength ?? 0)}
              </Badge>
            </div>
            <div className="d-flex align-items-center gap-1 small">
              <Form.Text className="text-muted my-0">Output Cost:</Form.Text>
              <Badge pill bg="secondary">
                ${totalOutputCost}
              </Badge>
            </div>
            <div className="d-flex align-items-center gap-1 small">
              <Form.Text className="text-muted my-0">Total Cost:</Form.Text>
              <Badge pill bg="success">
                ${totalCost}
              </Badge>
            </div>
          </div>
        </div>
      )}
      {errorAlertElements}
      {(outputs ?? [])?.length > 0 && (
        <h5 className="text-center text-muted">
          If this project helped you, please{' '}
          <a href="https://github.com/justinmahar/ai-text-processor/">Star it on GitHub</a> so others can find it. :)
        </h5>
      )}
    </div>
  );
};
