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
exports.ImportExportModal = void 0;
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const useLocalSettings_1 = require("./useLocalSettings");
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const react_use_precision_timer_1 = require("react-use-precision-timer");
const ImportExportModal = (_a) => {
    var { show, setShow } = _a, props = __rest(_a, ["show", "setShow"]);
    const localSettings = (0, useLocalSettings_1.useLocalSettings)();
    const [presets, setPresets] = localSettings[useLocalSettings_1.LocalSettingsKeys.presets];
    const [customOpenAiModels, setCustomOpenAiModels] = localSettings[useLocalSettings_1.LocalSettingsKeys.customOpenAiModelInfos];
    const enteredValueTextAreaRef = react_1.default.useRef(null);
    const getSettingsJsonString = () => {
        let settingsJson = '';
        try {
            settingsJson = JSON.stringify({
                presets,
                customOpenAiModels,
            });
        }
        catch (e) {
            console.error(e);
        }
        return settingsJson;
    };
    const [enteredValue, setEnteredValue] = react_1.default.useState(getSettingsJsonString());
    const [copied, toggleCopied] = (0, react_use_precision_timer_1.useMomentaryBool)(false, 2000);
    const [error, setError] = react_1.default.useState(undefined);
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
        }
        catch (e) {
            console.error(e);
            setError(e);
        }
    };
    const handleCopy = () => {
        var _a;
        (0, copy_to_clipboard_1.default)(enteredValue);
        toggleCopied();
        (_a = enteredValueTextAreaRef.current) === null || _a === void 0 ? void 0 : _a.select();
    };
    const handleReset = () => {
        setEnteredValue(getSettingsJsonString());
    };
    react_1.default.useEffect(() => {
        try {
            JSON.parse(enteredValue);
            setError(undefined);
        }
        catch (e) {
            setError(e);
        }
    }, [enteredValue]);
    const canImport = getSettingsJsonString() !== enteredValue && !error;
    const canReset = error || canImport;
    return (react_1.default.createElement(react_bootstrap_1.Modal, Object.assign({ show: show, onHide: handleCloseModal, size: "lg" }, props, { className: (0, classnames_1.default)(props.className), style: Object.assign({}, props.style) }),
        react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
            react_1.default.createElement(react_bootstrap_1.Modal.Title, null, "Import/Export Settings")),
        react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
            react_1.default.createElement("p", null, "Import or export your AI settings and presets below."),
            react_1.default.createElement("p", null, "To export, click Copy and paste the clipboard contents into a text file or notes application. (Note: Your OpenAI API key will not be exported.)"),
            react_1.default.createElement("p", null, "To import, paste the saved settings and click Import."),
            react_1.default.createElement("div", { className: "d-flex flex-column gap-2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_bootstrap_1.Form.Control, { ref: enteredValueTextAreaRef, as: "textarea", placeholder: "Paste settings here", rows: 6, value: enteredValue, className: "font-monospace", style: { fontSize: '80%' }, onChange: (e) => setEnteredValue(e.target.value), onFocus: () => {
                            var _a;
                            (_a = enteredValueTextAreaRef.current) === null || _a === void 0 ? void 0 : _a.select();
                        } })),
                react_1.default.createElement("div", { className: "d-flex flex-wrap align-items-center gap-2" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: handleCopy }, copied ? 'Copied!' : 'Copy'),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: handleImport, disabled: !canImport }, "Import"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: handleReset, disabled: !canReset }, "Reset")),
                enteredValue && error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger" }, "Invalid settings. Please check the entered value and try again, or click Reset to reset the entered value back to the current settings.")))),
        react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
            react_1.default.createElement(react_bootstrap_1.Button, { variant: "secondary", onClick: handleCloseModal }, "Close"))));
};
exports.ImportExportModal = ImportExportModal;
