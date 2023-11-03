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
exports.Settings = void 0;
require("bootstrap/dist/css/bootstrap.css");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const fa_1 = require("react-icons/fa");
const useLocalSettings_1 = require("./useLocalSettings");
const AIModelInfo_1 = require("./AIModelInfo");
const ImportExportModal_1 = require("./ImportExportModal");
const Settings = (_a) => {
    var props = __rest(_a, []);
    const localSettings = (0, useLocalSettings_1.useLocalSettings)();
    const [openAiKey, setOpenAiKey] = localSettings[useLocalSettings_1.LocalSettingsKeys.openAiKey];
    const [showOpenAiKey, setShowOpenAiKey] = react_1.default.useState(false);
    const [customOpenAiModelInfos, setCustomOpenAiModelInfos] = localSettings[useLocalSettings_1.LocalSettingsKeys.customOpenAiModelInfos];
    const [newOpenAiModelName, setNewOpenAiModelName] = react_1.default.useState('');
    const [newOpenAiModelId, setNewOpenAiModelId] = react_1.default.useState('');
    const [newOpenAiModelMaxTokens, setNewOpenAiModelMaxTokens] = react_1.default.useState('');
    const [showChunkInspector, setShowChunkInspector] = localSettings[useLocalSettings_1.LocalSettingsKeys.showChunkInspector];
    const [showImportExportModal, setShowImportExportModal] = react_1.default.useState(false);
    const mergedOpenAiModelInfos = [...AIModelInfo_1.defaultOpenAiModelInfos, ...(customOpenAiModelInfos !== null && customOpenAiModelInfos !== void 0 ? customOpenAiModelInfos : [])];
    const handleDeleteOpenAiModel = (id) => {
        const newCustomOpenAiModels = [...(customOpenAiModelInfos !== null && customOpenAiModelInfos !== void 0 ? customOpenAiModelInfos : [])];
        const index = newCustomOpenAiModels.findIndex((m) => m.id === id);
        if (index >= 0) {
            newCustomOpenAiModels.splice(index, 1);
            setCustomOpenAiModelInfos(newCustomOpenAiModels);
        }
    };
    const handleAddNewOpenAiModel = () => {
        const newCustomOpenAiModels = [...(customOpenAiModelInfos !== null && customOpenAiModelInfos !== void 0 ? customOpenAiModelInfos : [])];
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
    const aiModelElements = mergedOpenAiModelInfos.map((model, i) => {
        const disabled = !(customOpenAiModelInfos !== null && customOpenAiModelInfos !== void 0 ? customOpenAiModelInfos : []).find((m) => m.id === model.id);
        return (react_1.default.createElement("div", { key: `model-${i}`, className: "d-flex align-items-center gap-1" },
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Name", value: model.name, disabled: true, readOnly: true }),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Model ID", className: "font-monospace", value: model.id, disabled: true, readOnly: true }),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", min: 0, step: 1, placeholder: "Max Tokens", value: model.maxTokens, disabled: true, style: { width: 150 } }),
            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", disabled: disabled, onClick: () => handleDeleteOpenAiModel(model.id) },
                react_1.default.createElement(fa_1.FaTrashAlt, null))));
    });
    const canAddOpenAiModel = !mergedOpenAiModelInfos.find((m) => m.id === newOpenAiModelId) &&
        newOpenAiModelName &&
        newOpenAiModelId &&
        newOpenAiModelMaxTokens;
    return (react_1.default.createElement("div", Object.assign({}, props, { className: (0, classnames_1.default)(props.className), style: Object.assign({}, props.style) }),
        showImportExportModal && react_1.default.createElement(ImportExportModal_1.ImportExportModal, { show: showImportExportModal, setShow: setShowImportExportModal }),
        react_1.default.createElement(react_bootstrap_1.Card, null,
            react_1.default.createElement(react_bootstrap_1.Card.Header, null, "Settings"),
            react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-2" },
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, null, "OpenAI"),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-2" },
                        !openAiKey && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "primary", className: "mb-0" },
                            "You must ",
                            react_1.default.createElement("a", { href: "https://platform.openai.com/account/api-keys" }, "generate an OpenAI API key"),
                            " to perform text processing with this utility. Copy your key and paste it below.")),
                        react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "form-group-openai-api-key" },
                            react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small fw-bold mb-1" }, "API Key"),
                            react_1.default.createElement("div", { className: "d-flex align-items-center gap-1" },
                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: showOpenAiKey ? 'text' : 'password', placeholder: "Paste OpenAI API Key here", value: openAiKey !== null && openAiKey !== void 0 ? openAiKey : '', onChange: (e) => setOpenAiKey(e.target.value), className: "w-100" }),
                                react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => setShowOpenAiKey(!showOpenAiKey) }, !showOpenAiKey ? react_1.default.createElement(fa_1.FaEye, { className: "mb-1" }) : react_1.default.createElement(fa_1.FaEyeSlash, { className: "mb-1" }))),
                            react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                                "Your ",
                                react_1.default.createElement("a", { href: "https://platform.openai.com/account/api-keys" }, "API key"),
                                " will be stored in your browser's local storage, on your device only (not in the cloud).")),
                        react_1.default.createElement(react_bootstrap_1.Card, null,
                            react_1.default.createElement(react_bootstrap_1.Card.Header, null, "AI Models"),
                            react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                                react_1.default.createElement("div", { className: "d-flex flex-column gap-1" },
                                    aiModelElements,
                                    react_1.default.createElement("div", { className: "d-flex align-items-center gap-1" },
                                        react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Name", value: newOpenAiModelName, onChange: (e) => setNewOpenAiModelName(e.target.value) }),
                                        react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Model ID", className: "font-monospace", 
                                            // style={{ fontSize: '80%' }}
                                            value: newOpenAiModelId, onChange: (e) => setNewOpenAiModelId(e.target.value) }),
                                        react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", min: 0, step: 1, placeholder: "Max Tokens", value: newOpenAiModelMaxTokens, onChange: (e) => setNewOpenAiModelMaxTokens(e.target.value), style: { width: 150 } }),
                                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: handleAddNewOpenAiModel, disabled: !canAddOpenAiModel },
                                            react_1.default.createElement(fa_1.FaPlus, null)))))))),
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, null, "Text Processing"),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-2" },
                        react_1.default.createElement(react_bootstrap_1.Form.Check, { label: "Show chunk inspector", className: "user-select-none", id: "show-chunk-inspector", checked: !!showChunkInspector, onChange: (e) => setShowChunkInspector(e.target.checked) }))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => setShowImportExportModal(true) }, "Import/Export Settings"))))));
};
exports.Settings = Settings;
