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
const useLocalSettings_1 = require("./useLocalSettings");
const Settings = (_a) => {
    var props = __rest(_a, []);
    const localSettings = (0, useLocalSettings_1.useLocalSettings)();
    const [youTubeApiKey, setYouTubeApiKey] = localSettings[useLocalSettings_1.LocalSettingsKeys.youTubeApiKey];
    return (react_1.default.createElement("div", Object.assign({}, props, { className: (0, classnames_1.default)(props.className), style: Object.assign({}, props.style) }),
        react_1.default.createElement(react_bootstrap_1.Card, null,
            react_1.default.createElement(react_bootstrap_1.Card.Header, null, "Settings"),
            react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                youTubeApiKey,
                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Placeholder text", value: `${youTubeApiKey}`, onChange: (e) => setYouTubeApiKey(e.target.value) })))));
};
exports.Settings = Settings;
