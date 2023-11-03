"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITextProcessor = exports.CHAR_LIMIT = void 0;
require("bootstrap/dist/css/bootstrap.css");
const classnames_1 = __importDefault(require("classnames"));
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const openai_ext_1 = require("openai-ext");
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const fa_1 = require("react-icons/fa");
const react_use_precision_timer_1 = require("react-use-precision-timer");
const Markdown_1 = require("./Markdown");
const Preset_1 = require("./Preset");
const TextUtils_1 = require("./TextUtils");
const AIModelInfo_1 = require("./AIModelInfo");
const useLocalSettings_1 = require("./useLocalSettings");
exports.CHAR_LIMIT = 2000000;
const AITextProcessor = (_a) => {
    var _b, _c, _d, _e, _f, _g;
    var props = __rest(_a, []);
    const localSettings = (0, useLocalSettings_1.useLocalSettings)();
    const [presets, setPresets] = localSettings[useLocalSettings_1.LocalSettingsKeys.presets];
    const mergedPresets = (0, Preset_1.toSortedPresetsMap)([...Object.values(Preset_1.defaultPresetsMap), ...Object.values(presets !== null && presets !== void 0 ? presets : {})]);
    const [presetName, setPresetName] = localSettings[useLocalSettings_1.LocalSettingsKeys.presetName];
    const [openAiModel, setOpenAiModel] = localSettings[useLocalSettings_1.LocalSettingsKeys.openAiModel];
    const [systemPrompt, setSystemPrompt] = localSettings[useLocalSettings_1.LocalSettingsKeys.systemPrompt];
    const [userPrompt, setUserPrompt] = localSettings[useLocalSettings_1.LocalSettingsKeys.userPrompt];
    const [input, setInput] = localSettings[useLocalSettings_1.LocalSettingsKeys.input];
    const [outputs, setOutputs] = localSettings[useLocalSettings_1.LocalSettingsKeys.outputs];
    const [openAiKey] = localSettings[useLocalSettings_1.LocalSettingsKeys.openAiKey];
    const [customOpenAiModels] = localSettings[useLocalSettings_1.LocalSettingsKeys.customOpenAiModelInfos];
    const mergedOpenAiModels = [...AIModelInfo_1.defaultOpenAiModelInfos, ...(customOpenAiModels !== null && customOpenAiModels !== void 0 ? customOpenAiModels : [])];
    const [showRawOutput, setShowRawOutput] = localSettings[useLocalSettings_1.LocalSettingsKeys.showRawOutput];
    const [copied, toggleCopied] = (0, react_use_precision_timer_1.useMomentaryBool)(false, 2000);
    const [xhr, setXhr] = react_1.default.useState(undefined);
    const errorsRef = react_1.default.useRef([]);
    const [renderTime, setRenderTime] = react_1.default.useState(0);
    const [selectedPresetName, setSelectedPresetName] = localSettings[useLocalSettings_1.LocalSettingsKeys.selectedPresetName];
    const [averageTokenLength, setAverageTokenLength] = localSettings[useLocalSettings_1.LocalSettingsKeys.averageTokenLength];
    const [requestMaxTokenRatio, setRequestMaxTokenRatio] = localSettings[useLocalSettings_1.LocalSettingsKeys.requestMaxTokenRatio];
    const [chunkOverlapWordCount, setChunkOverlapWordCount] = localSettings[useLocalSettings_1.LocalSettingsKeys.chunkOverlapWordCount];
    const [chunkPrefix, setChunkPrefix] = localSettings[useLocalSettings_1.LocalSettingsKeys.chunkPrefix];
    const [showChunkInspector] = localSettings[useLocalSettings_1.LocalSettingsKeys.showChunkInspector];
    const [autoShrinkEnabled, setAutoShrinkEnabled] = localSettings[useLocalSettings_1.LocalSettingsKeys.autoShrinkEnabled];
    const currentOpenAiModelInfo = mergedOpenAiModels.find((m) => m.id === openAiModel);
    const [currentChunkIndex, setCurrentChunkIndex] = react_1.default.useState(-1);
    const processingRef = react_1.default.useRef(false);
    const outputsRef = react_1.default.useRef([]);
    const inputTextFieldRef = react_1.default.useRef(null);
    const retryingRef = react_1.default.useRef(false);
    const chunks = TextUtils_1.TextUtils.getChunks(`${systemPrompt}`, `${userPrompt}`, `${input}`, (_b = currentOpenAiModelInfo === null || currentOpenAiModelInfo === void 0 ? void 0 : currentOpenAiModelInfo.maxTokens) !== null && _b !== void 0 ? _b : 0, {
        averageTokenLength: averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 4,
        requestMaxTokenRatio: requestMaxTokenRatio !== null && requestMaxTokenRatio !== void 0 ? requestMaxTokenRatio : 0.6,
        chunkOverlapWordCount: chunkOverlapWordCount !== null && chunkOverlapWordCount !== void 0 ? chunkOverlapWordCount : 20,
        chunkPrefix: `${chunkPrefix}`,
    });
    const processChunk = (chunkIndex) => {
        const chunk = chunks[chunkIndex];
        if (chunk) {
            setCurrentChunkIndex(chunkIndex);
            processingRef.current = true;
            setRenderTime(Date.now());
            // Configure the stream
            const streamConfig = {
                apiKey: `${openAiKey}`,
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
            messages.push({ role: 'user', content: `${userPrompt}\n\n${chunk}`.trim() });
            // Make the call and store a reference to the XMLHttpRequest
            const xhr = openai_ext_1.OpenAIExt.streamClientChatCompletion({
                model: `${openAiModel}`,
                messages,
            }, streamConfig);
            setXhr(xhr);
        }
        else {
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
        xhr === null || xhr === void 0 ? void 0 : xhr.abort();
        setRenderTime(Date.now());
    };
    const handleRetryChunk = () => {
        retryingRef.current = true;
        xhr === null || xhr === void 0 ? void 0 : xhr.abort();
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
    const handleClearInput = () => {
        setInput('');
    };
    const handleShrink = () => {
        setInput(TextUtils_1.TextUtils.shrinkText(input).trim());
    };
    const handleSelectPreset = (presetName) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!presetName) {
            setSelectedPresetName('');
            setPresetName(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.presetName]);
            setOpenAiModel(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.openAiModel]);
            setSystemPrompt(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.systemPrompt]);
            setUserPrompt(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.userPrompt]);
            setAverageTokenLength(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.averageTokenLength]);
            setRequestMaxTokenRatio(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.requestMaxTokenRatio]);
            setChunkOverlapWordCount(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.chunkOverlapWordCount]);
            setChunkPrefix(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.chunkPrefix]);
            setAutoShrinkEnabled(useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.autoShrinkEnabled]);
        }
        else {
            const selectedPreset = (mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {})[presetName];
            if (selectedPreset) {
                setSelectedPresetName(presetName);
                setPresetName((_a = selectedPreset.name) !== null && _a !== void 0 ? _a : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.presetName]);
                setOpenAiModel((_b = selectedPreset.aiModel) !== null && _b !== void 0 ? _b : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.openAiModel]);
                setSystemPrompt((_c = selectedPreset.systemPrompt) !== null && _c !== void 0 ? _c : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.systemPrompt]);
                setUserPrompt((_d = selectedPreset.userPrompt) !== null && _d !== void 0 ? _d : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.userPrompt]);
                setAverageTokenLength((_e = selectedPreset.averageTokenLength) !== null && _e !== void 0 ? _e : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.averageTokenLength]);
                setRequestMaxTokenRatio((_f = selectedPreset.requestMaxTokenRatio) !== null && _f !== void 0 ? _f : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.requestMaxTokenRatio]);
                setChunkOverlapWordCount((_g = selectedPreset.chunkOverlapWordCount) !== null && _g !== void 0 ? _g : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.chunkOverlapWordCount]);
                setChunkPrefix((_h = selectedPreset.chunkPrefix) !== null && _h !== void 0 ? _h : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.chunkPrefix]);
                setAutoShrinkEnabled((_j = selectedPreset.autoShrink) !== null && _j !== void 0 ? _j : useLocalSettings_1.LocalSettingsDefaults[useLocalSettings_1.LocalSettingsKeys.chunkPrefix]);
                (_k = inputTextFieldRef.current) === null || _k === void 0 ? void 0 : _k.select();
            }
        }
    };
    const handleSavePreset = () => {
        const presetToSave = {
            name: presetName,
            aiModel: openAiModel,
            systemPrompt: systemPrompt,
            userPrompt: userPrompt,
            averageTokenLength,
            requestMaxTokenRatio,
            chunkOverlapWordCount,
            chunkPrefix,
            autoShrink: !!autoShrinkEnabled,
        };
        const newPresets = [...Object.values(mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {}), presetToSave];
        const newPresetsSortedMap = (0, Preset_1.toSortedPresetsMap)(newPresets);
        setPresets(newPresetsSortedMap);
        setSelectedPresetName(presetName);
        setRenderTime(Date.now());
    };
    const handleDeletePreset = () => {
        if (selectedPresetName) {
            const newPresets = Object.assign({}, (mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {}));
            delete newPresets[selectedPresetName];
            setPresets(newPresets);
        }
        handleSelectPreset('');
    };
    const handleCopy = () => {
        (0, copy_to_clipboard_1.default)((outputs !== null && outputs !== void 0 ? outputs : []).join('\n\n'));
        toggleCopied();
    };
    const handleClear = () => {
        setOutputs([]);
        outputsRef.current = [];
        errorsRef.current = [];
        setRenderTime(Date.now());
        xhr === null || xhr === void 0 ? void 0 : xhr.abort();
        processingRef.current = false;
        setXhr(undefined);
    };
    const handleInputTextFieldFocus = () => {
        var _a;
        (_a = inputTextFieldRef.current) === null || _a === void 0 ? void 0 : _a.select();
    };
    const openAiModelOptions = mergedOpenAiModels.map((model, i) => {
        return (react_1.default.createElement("option", { key: `open-ai-model-${i}`, value: model.id }, model.name));
    });
    const errorAlertElements = errorsRef.current.map((error, i) => {
        var _a, _b;
        let messageString = `${error}`;
        try {
            const errorObj = JSON.parse(error.message);
            messageString = (_b = (_a = errorObj.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : messageString;
        }
        catch (e) {
            // Ignore
        }
        return (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", key: `error-${i}`, className: "mb-0" },
            react_1.default.createElement(Markdown_1.Markdown, null, messageString)));
    });
    const presetKeys = Object.keys(mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {});
    const presetOptionElements = presetKeys.map((presetKey) => {
        var _a, _b;
        const preset = (mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {})[presetKey];
        return (react_1.default.createElement("option", { key: `${presetKey}`, value: presetKey },
            presetKey,
            " (", (_b = (_a = mergedOpenAiModels.find((m) => m.id === preset.aiModel)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : preset.aiModel,
            ")"));
    });
    const chunkElements = chunks.map((chunk, i) => {
        return (react_1.default.createElement(react_bootstrap_1.Alert, { key: `chunk-${i}`, variant: "secondary" },
            react_1.default.createElement("div", { className: "d-flex align-items-center justify-content-between gap-2" },
                react_1.default.createElement("h6", { className: "mb-0" },
                    react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary" },
                        "Chunk #",
                        i + 1)),
                react_1.default.createElement("div", { className: "d-flex align-items-center gap-2 fw-bold" },
                    react_1.default.createElement("div", null, "Tokens:"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, TextUtils_1.TextUtils.getEstimatedTokenCount(systemPrompt + userPrompt + chunk, averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 0))))),
            react_1.default.createElement("hr", null),
            systemPrompt && react_1.default.createElement("p", null, systemPrompt),
            userPrompt && react_1.default.createElement("p", null, userPrompt),
            chunk && react_1.default.createElement("p", null, chunk)));
    });
    const outputElements = (outputs !== null && outputs !== void 0 ? outputs : []).map((output, i, arr) => {
        return (react_1.default.createElement(react_bootstrap_1.Alert, { key: `output-${i}`, variant: "light", className: "text-black mb-0" },
            react_1.default.createElement(Markdown_1.Markdown, null, output)));
    });
    const showProcessingAlert = processingRef.current && ((outputs !== null && outputs !== void 0 ? outputs : []).length < currentChunkIndex + 1 || retryingRef.current);
    const selectedPreset = (mergedPresets !== null && mergedPresets !== void 0 ? mergedPresets : {})[selectedPresetName];
    const hasChanges = !selectedPreset ||
        (selectedPreset && selectedPreset.name !== presetName) ||
        selectedPreset.aiModel !== openAiModel ||
        selectedPreset.systemPrompt !== systemPrompt ||
        selectedPreset.userPrompt !== userPrompt ||
        selectedPreset.averageTokenLength !== averageTokenLength ||
        selectedPreset.requestMaxTokenRatio !== requestMaxTokenRatio ||
        selectedPreset.chunkOverlapWordCount !== chunkOverlapWordCount ||
        selectedPreset.chunkPrefix !== chunkPrefix ||
        !!selectedPreset.autoShrink !== !!autoShrinkEnabled;
    const canSave = !!presetName.trim() && hasChanges;
    const configured = !!openAiModel && !!userPrompt;
    const canExecute = configured && !!input;
    const hasInput = (input !== null && input !== void 0 ? input : '').length > 0;
    return (react_1.default.createElement("div", Object.assign({}, props, { className: (0, classnames_1.default)('d-flex flex-column gap-3', props.className), style: Object.assign({}, props.style) }),
        react_1.default.createElement(react_bootstrap_1.Card, null,
            react_1.default.createElement(react_bootstrap_1.Card.Header, null, "AI Text Processor"),
            react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                react_1.default.createElement("div", { className: "d-flex flex-column gap-2" },
                    !openAiKey && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger" },
                        "You must add your OpenAI API key in",
                        ' ',
                        react_1.default.createElement("a", { href: "https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--settings" }, "Settings"),
                        ' ',
                        "before using this utility.")),
                    react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "select-preset" },
                        react_1.default.createElement(react_bootstrap_1.Form.Select, { value: selectedPresetName, onChange: (e) => handleSelectPreset(e.target.value) },
                            react_1.default.createElement("option", { value: "" }, "\u2728 New Preset"),
                            presetOptionElements),
                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Select a preset, or choose New Preset to create a new one. Note that default presets cannot be deleted.")),
                    react_1.default.createElement(react_bootstrap_1.Accordion, { key: `accordion-${!selectedPresetName ? 'new' : 'saved'}`, defaultActiveKey: !selectedPresetName ? '1' : undefined },
                        react_1.default.createElement(react_bootstrap_1.Accordion.Item, { eventKey: "1" },
                            react_1.default.createElement(react_bootstrap_1.Accordion.Header, null,
                                react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                                    !configured ? react_1.default.createElement(fa_1.FaWrench, null) : react_1.default.createElement(fa_1.FaCheckSquare, { className: "text-success" }),
                                    " Preset Configuration",
                                    canSave && react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary" }, "Unsaved"))),
                            react_1.default.createElement(react_bootstrap_1.Accordion.Body, { className: "d-flex flex-column gap-2" },
                                react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "name-group" },
                                    react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Name"),
                                    react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Enter a preset name", value: presetName, onChange: (e) => setPresetName(e.target.value) }),
                                    react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Provide a name for this preset.")),
                                react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "model-group" },
                                    react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "AI Model"),
                                    react_1.default.createElement(react_bootstrap_1.Form.Select, { value: openAiModel, onChange: (e) => setOpenAiModel(e.target.value) },
                                        react_1.default.createElement("option", { value: "" }, "AI Model..."),
                                        openAiModelOptions),
                                    react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Select the AI model to use.")),
                                react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "system-prompt-group" },
                                    react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "System Prompt"),
                                    react_1.default.createElement(react_bootstrap_1.Form.Control, { as: "textarea", placeholder: "Enter the system prompt", rows: 1, value: systemPrompt, onChange: (e) => setSystemPrompt(e.target.value) }),
                                    react_1.default.createElement("div", { className: "d-flex justify-content-between gap-2" },
                                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Provide a system prompt for the language model."),
                                        react_1.default.createElement("div", { className: "d-flex align-items-center gap-1 small" },
                                            react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted my-0" }, "Tokens:"),
                                            react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, TextUtils_1.TextUtils.getEstimatedTokenCount(systemPrompt, averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 0))))),
                                react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "user-prompt-group" },
                                    react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "User Prompt"),
                                    react_1.default.createElement(react_bootstrap_1.Form.Control, { as: "textarea", placeholder: "Enter the user prompt", rows: 3, value: userPrompt, onChange: (e) => setUserPrompt(e.target.value) }),
                                    react_1.default.createElement("div", { className: "d-flex justify-content-between gap-2" },
                                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Provide the prompt used to process the text. The input text will be appended to the end of this prompt."),
                                        react_1.default.createElement("div", { className: "d-flex align-items-center gap-1 small" },
                                            react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted my-0" }, "Tokens:"),
                                            react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, TextUtils_1.TextUtils.getEstimatedTokenCount(userPrompt, averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 0))))),
                                react_1.default.createElement(react_bootstrap_1.Accordion, null,
                                    react_1.default.createElement(react_bootstrap_1.Accordion.Item, { eventKey: "0" },
                                        react_1.default.createElement(react_bootstrap_1.Accordion.Header, null, "Advanced Config"),
                                        react_1.default.createElement(react_bootstrap_1.Accordion.Body, null,
                                            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-averageTokenLength" },
                                                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Average token length:"),
                                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", min: 0, step: 0.1, value: averageTokenLength, onChange: (e) => setAverageTokenLength(parseFloat(e.target.value)) }),
                                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                                                    "This value will be used to estimate the amount of tokens for a given request. Use OpenAI's",
                                                    ' ',
                                                    react_1.default.createElement("a", { href: "https://platform.openai.com/tokenizer" }, "tokenizer"),
                                                    " to estimate this value by dividing characters by tokens for a given input. OpenAI suggests ",
                                                    react_1.default.createElement("code", null, "4"),
                                                    " as a conservative average.")),
                                            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-requestMaxTokenRatio" },
                                                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Request max token ratio:"),
                                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", min: 0, step: 0.1, max: 0.99, value: requestMaxTokenRatio, onChange: (e) => setRequestMaxTokenRatio(parseFloat(e.target.value)) }),
                                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                                                    "Requests will not send more than this ratio of the max tokens for the model, and will be chunked if exceeded. If the ratio is ",
                                                    requestMaxTokenRatio,
                                                    " (",
                                                    `${Math.round(requestMaxTokenRatio * 100)}%`,
                                                    "), and the max tokens for the model is",
                                                    ' ', (_c = currentOpenAiModelInfo === null || currentOpenAiModelInfo === void 0 ? void 0 : currentOpenAiModelInfo.maxTokens) !== null && _c !== void 0 ? _c : 4000,
                                                    ", each request (chunk) will have",
                                                    ' ',
                                                    Math.ceil(((_d = currentOpenAiModelInfo === null || currentOpenAiModelInfo === void 0 ? void 0 : currentOpenAiModelInfo.maxTokens) !== null && _d !== void 0 ? _d : 4000) * requestMaxTokenRatio),
                                                    " tokens max. This would leave about",
                                                    ' ',
                                                    ((_e = currentOpenAiModelInfo === null || currentOpenAiModelInfo === void 0 ? void 0 : currentOpenAiModelInfo.maxTokens) !== null && _e !== void 0 ? _e : 4000) -
                                                        Math.ceil(((_f = currentOpenAiModelInfo === null || currentOpenAiModelInfo === void 0 ? void 0 : currentOpenAiModelInfo.maxTokens) !== null && _f !== void 0 ? _f : 4000) * requestMaxTokenRatio),
                                                    ' ',
                                                    "tokens for a meaningful response, per request. For each chunk, we want to make sure there is still a decent amount of tokens left for the response.")),
                                            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-chunkOverlapWordCount" },
                                                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Chunk overlap word count:"),
                                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", min: 0, step: 1, value: chunkOverlapWordCount, onChange: (e) => setChunkOverlapWordCount(parseInt(e.target.value)) }),
                                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "When chunking, chunks will overlap by this many words to help preserve meaning. Words are delimited by spaces.")),
                                            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-chunkPrefix" },
                                                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Chunk prefix:"),
                                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", value: chunkPrefix, onChange: (e) => setChunkPrefix(e.target.value) }),
                                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "When chunking, subsequent chunks will be prefixed with this text to indicate a continuation.")),
                                            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-auto-shrink", className: "mt-3" },
                                                react_1.default.createElement(react_bootstrap_1.Form.Check, { label: "Auto-shrink", className: "user-select-none small mb-0", id: "auto-shrink-checkbox", checked: !!autoShrinkEnabled, onChange: (e) => setAutoShrinkEnabled(e.target.checked) }),
                                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Shrinking condenses whitespace and removes timestamps (in the format #:#) to shorten the input."))))),
                                react_1.default.createElement("div", { className: "d-flex justify-content-end gap-2" },
                                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: handleSavePreset, disabled: !canSave },
                                        react_1.default.createElement(fa_1.FaSave, { className: "mb-1" })),
                                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", onClick: handleDeletePreset },
                                        react_1.default.createElement(fa_1.FaTrashAlt, { className: "mb-1" })))))),
                    react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-input-text" },
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "Input Text"),
                        react_1.default.createElement(react_bootstrap_1.Form.Control, { ref: inputTextFieldRef, as: "textarea", placeholder: "Enter text to process", rows: 8, value: input, onChange: (e) => {
                                if (autoShrinkEnabled) {
                                    setInput(TextUtils_1.TextUtils.shrinkText(e.target.value).substring(0, exports.CHAR_LIMIT));
                                }
                                else {
                                    setInput(e.target.value.substring(0, exports.CHAR_LIMIT));
                                }
                            }, onFocus: handleInputTextFieldFocus })),
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start gap-2" },
                        react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", size: "sm", onClick: handleClearInput, disabled: !hasInput }, "Clear"),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", size: "sm", onClick: handleShrink, disabled: !hasInput },
                                react_1.default.createElement("div", { className: "d-flex align-items-center gap-1" }, "Shrink")),
                            react_1.default.createElement(react_bootstrap_1.Form.Check, { inline: true, label: "Auto-shrink", className: "user-select-none small mb-0", id: "auto-shrink-checkbox", checked: !!autoShrinkEnabled, onChange: (e) => setAutoShrinkEnabled(e.target.checked) })),
                        react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("div", { className: "d-flex align-items-center gap-1 small" },
                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted my-0" }, "Chunks:"),
                                react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, chunks.length)),
                            react_1.default.createElement("div", { className: "d-flex align-items-center gap-1 small" },
                                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted my-0" }, "Tokens:"),
                                react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, TextUtils_1.TextUtils.getEstimatedTokenCount(input, averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 0))))),
                    (input !== null && input !== void 0 ? input : '').length === exports.CHAR_LIMIT && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" },
                        "Input text is limited to ",
                        exports.CHAR_LIMIT,
                        " characters. Your current input has reached the max.")),
                    showChunkInspector && (react_1.default.createElement(react_bootstrap_1.Accordion, null,
                        react_1.default.createElement(react_bootstrap_1.Accordion.Item, { eventKey: "0" },
                            react_1.default.createElement(react_bootstrap_1.Accordion.Header, null,
                                react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                                    react_1.default.createElement(fa_1.FaAlignLeft, null),
                                    " Chunk Inspector",
                                    ' ',
                                    react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "primary" }, chunks.length))),
                            react_1.default.createElement(react_bootstrap_1.Accordion.Body, null,
                                chunkElements,
                                chunkElements.length === 0 && react_1.default.createElement("div", null, "No chunks to display."))))),
                    react_1.default.createElement("div", { className: "d-flex justify-content-center gap-2" },
                        !processingRef.current && (react_1.default.createElement(react_bootstrap_1.Button, { size: "lg", variant: "primary", onClick: handleExecute, disabled: !canExecute }, "Execute")),
                        processingRef.current && (react_1.default.createElement(react_bootstrap_1.Button, { size: "lg", variant: "danger", onClick: handleStop }, "Stop")))))),
        (xhr || processingRef.current || errorsRef.current.length > 0 || (outputs !== null && outputs !== void 0 ? outputs : []).length > 0) && (react_1.default.createElement("div", { className: "d-flex flex-column gap-1" },
            react_1.default.createElement(react_bootstrap_1.Card, null,
                react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "d-flex justify-content-between align-items-center gap-2" },
                    react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                        processingRef.current && (react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status", size: "sm" }))),
                        "Output",
                        processingRef.current && (react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary", className: "small fw-bold" },
                                "Chunk ",
                                currentChunkIndex + 1,
                                " of ",
                                chunks.length,
                                "..."))),
                        currentChunkIndex >= 0 && (react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", size: "sm", onClick: handleRetryChunk, disabled: retryingRef.current }, "Retry Chunk"))),
                    react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                        react_1.default.createElement(react_bootstrap_1.Form.Check, { inline: true, label: "Raw", className: "user-select-none", id: "raw-checkbox", checked: showRawOutput, onChange: (e) => setShowRawOutput(e.target.checked) }),
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: handleCopy }, copied ? react_1.default.createElement(fa_1.FaCheck, { className: "mb-1" }) : react_1.default.createElement(fa_1.FaCopy, { className: "mb-1" })),
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", onClick: handleClear },
                            react_1.default.createElement(fa_1.FaTrash, { className: "mb-1" })))),
                react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-2" },
                    !outputs && react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status", size: "sm" }),
                    outputs && showRawOutput && react_1.default.createElement("pre", null, outputs.join('\n\n')),
                    outputs && !showRawOutput && outputElements,
                    showProcessingAlert && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "light", className: "text-black mb-0" },
                        react_1.default.createElement("div", { className: "d-flex align-items-center small gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status", size: "sm" }),
                            " Processing chunk ",
                            currentChunkIndex + 1,
                            "..."))))),
            react_1.default.createElement("div", { className: "d-flex justify-content-end" },
                react_1.default.createElement("div", { className: "d-flex align-items-center gap-1 small" },
                    react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted my-0" }, "Tokens:"),
                    react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: "secondary" }, TextUtils_1.TextUtils.getEstimatedTokenCount((outputs !== null && outputs !== void 0 ? outputs : []).join(' '), averageTokenLength !== null && averageTokenLength !== void 0 ? averageTokenLength : 0)))))),
        errorAlertElements,
        ((_g = (outputs !== null && outputs !== void 0 ? outputs : [])) === null || _g === void 0 ? void 0 : _g.length) > 0 && (react_1.default.createElement("h5", { className: "text-center text-muted" },
            "If this project helped you, please",
            ' ',
            react_1.default.createElement("a", { href: "https://github.com/justinmahar/ai-text-processor/" }, "Star it on GitHub"),
            " so others can find it. :)"))));
};
exports.AITextProcessor = AITextProcessor;
