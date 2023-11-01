"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalSettings = exports.LocalSettingsDefaults = exports.LocalSettingsKeys = void 0;
const react_1 = __importDefault(require("react"));
const react_storage_complete_1 = require("react-storage-complete");
/**
 * Local settings for the application.
 */
var LocalSettingsKeys;
(function (LocalSettingsKeys) {
    LocalSettingsKeys["templateState"] = "templateState";
    LocalSettingsKeys["youTubeApiKey"] = "youTubeApiKey";
})(LocalSettingsKeys = exports.LocalSettingsKeys || (exports.LocalSettingsKeys = {}));
exports.LocalSettingsDefaults = {
    [LocalSettingsKeys.templateState]: false,
    [LocalSettingsKeys.youTubeApiKey]: '',
};
const useLocalSettings = () => {
    const storageOptions = react_1.default.useMemo(() => {
        return {
            prefix: 'ai-text-processor',
        };
    }, []);
    return {
        [LocalSettingsKeys.templateState]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.templateState, exports.LocalSettingsDefaults[LocalSettingsKeys.templateState], storageOptions),
        [LocalSettingsKeys.youTubeApiKey]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.youTubeApiKey, exports.LocalSettingsDefaults[LocalSettingsKeys.youTubeApiKey], storageOptions),
    };
};
exports.useLocalSettings = useLocalSettings;
