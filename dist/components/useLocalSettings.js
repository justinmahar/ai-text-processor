"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalSettings = exports.LocalSettingsDefaults = exports.LocalSettingsKeys = void 0;
const react_1 = __importDefault(require("react"));
const react_storage_complete_1 = require("react-storage-complete");
const AIModelInfo_1 = require("./AIModelInfo");
const Preset_1 = require("./Preset");
/**
 * Local settings for the application.
 */
var LocalSettingsKeys;
(function (LocalSettingsKeys) {
    LocalSettingsKeys["templateState"] = "templateState";
    LocalSettingsKeys["openAiKey"] = "openAiKey";
    LocalSettingsKeys["presets"] = "presets";
    LocalSettingsKeys["selectedPresetName"] = "selectedPresetName";
    LocalSettingsKeys["customOpenAiModelInfos"] = "customOpenAiModelInfos";
    LocalSettingsKeys["presetName"] = "presetName";
    LocalSettingsKeys["presetDescription"] = "presetDescription";
    LocalSettingsKeys["openAiModel"] = "openAiModel";
    LocalSettingsKeys["systemPrompt"] = "systemPrompt";
    LocalSettingsKeys["userPrompt"] = "userPrompt";
    LocalSettingsKeys["variableValues"] = "variableValues";
    LocalSettingsKeys["variableOptions"] = "variableOptions";
    LocalSettingsKeys["input"] = "input";
    LocalSettingsKeys["outputs"] = "outputs";
    LocalSettingsKeys["showRawOutput"] = "showRawOutput";
    LocalSettingsKeys["averageTokenLength"] = "averageTokenLength";
    LocalSettingsKeys["requestMaxTokenRatio"] = "requestMaxTokenRatio";
    LocalSettingsKeys["chunkOverlapWordCount"] = "chunkOverlapWordCount";
    LocalSettingsKeys["chunkPrefix"] = "chunkPrefix";
    LocalSettingsKeys["showChunkInspector"] = "showChunkInspector";
    LocalSettingsKeys["autoShrinkEnabled"] = "autoShrinkEnabled";
})(LocalSettingsKeys = exports.LocalSettingsKeys || (exports.LocalSettingsKeys = {}));
exports.LocalSettingsDefaults = {
    [LocalSettingsKeys.templateState]: false,
    [LocalSettingsKeys.openAiKey]: '',
    [LocalSettingsKeys.presets]: Preset_1.defaultPresetsMap,
    [LocalSettingsKeys.selectedPresetName]: '',
    [LocalSettingsKeys.customOpenAiModelInfos]: [],
    [LocalSettingsKeys.presetName]: '',
    [LocalSettingsKeys.presetDescription]: '',
    [LocalSettingsKeys.openAiModel]: AIModelInfo_1.defaultOpenAiModelInfos[0].id,
    [LocalSettingsKeys.systemPrompt]: 'You are a helpful assistant.',
    [LocalSettingsKeys.userPrompt]: '',
    [LocalSettingsKeys.variableValues]: {},
    [LocalSettingsKeys.variableOptions]: {},
    [LocalSettingsKeys.input]: '',
    [LocalSettingsKeys.outputs]: [],
    [LocalSettingsKeys.showRawOutput]: false,
    [LocalSettingsKeys.averageTokenLength]: 4.5,
    [LocalSettingsKeys.requestMaxTokenRatio]: 0.6,
    [LocalSettingsKeys.chunkOverlapWordCount]: 20,
    [LocalSettingsKeys.chunkPrefix]: '',
    [LocalSettingsKeys.showChunkInspector]: false,
    [LocalSettingsKeys.autoShrinkEnabled]: false,
};
const useLocalSettings = () => {
    const storageOptions = react_1.default.useMemo(() => {
        return {
            prefix: 'ai-text-processor',
        };
    }, []);
    return {
        [LocalSettingsKeys.templateState]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.templateState, exports.LocalSettingsDefaults[LocalSettingsKeys.templateState], storageOptions),
        [LocalSettingsKeys.openAiKey]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.openAiKey, exports.LocalSettingsDefaults[LocalSettingsKeys.openAiKey], storageOptions),
        [LocalSettingsKeys.presets]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.presets, exports.LocalSettingsDefaults[LocalSettingsKeys.presets], storageOptions),
        [LocalSettingsKeys.selectedPresetName]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.selectedPresetName, exports.LocalSettingsDefaults[LocalSettingsKeys.selectedPresetName], storageOptions),
        [LocalSettingsKeys.customOpenAiModelInfos]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.customOpenAiModelInfos, exports.LocalSettingsDefaults[LocalSettingsKeys.customOpenAiModelInfos], storageOptions),
        [LocalSettingsKeys.presetName]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.presetName, exports.LocalSettingsDefaults[LocalSettingsKeys.presetName], storageOptions),
        [LocalSettingsKeys.presetDescription]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.presetDescription, exports.LocalSettingsDefaults[LocalSettingsKeys.presetDescription], storageOptions),
        [LocalSettingsKeys.openAiModel]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.openAiModel, exports.LocalSettingsDefaults[LocalSettingsKeys.openAiModel], storageOptions),
        [LocalSettingsKeys.systemPrompt]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.systemPrompt, exports.LocalSettingsDefaults[LocalSettingsKeys.systemPrompt], storageOptions),
        [LocalSettingsKeys.userPrompt]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.userPrompt, exports.LocalSettingsDefaults[LocalSettingsKeys.userPrompt], storageOptions),
        [LocalSettingsKeys.variableValues]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.variableValues, exports.LocalSettingsDefaults[LocalSettingsKeys.variableValues], storageOptions),
        [LocalSettingsKeys.variableOptions]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.variableOptions, exports.LocalSettingsDefaults[LocalSettingsKeys.variableOptions], storageOptions),
        [LocalSettingsKeys.input]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.input, exports.LocalSettingsDefaults[LocalSettingsKeys.input], storageOptions),
        [LocalSettingsKeys.outputs]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.outputs, exports.LocalSettingsDefaults[LocalSettingsKeys.outputs], storageOptions),
        [LocalSettingsKeys.showRawOutput]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.showRawOutput, exports.LocalSettingsDefaults[LocalSettingsKeys.showRawOutput], storageOptions),
        [LocalSettingsKeys.averageTokenLength]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.averageTokenLength, exports.LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength], storageOptions),
        [LocalSettingsKeys.requestMaxTokenRatio]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.requestMaxTokenRatio, exports.LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio], storageOptions),
        [LocalSettingsKeys.chunkOverlapWordCount]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.chunkOverlapWordCount, exports.LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount], storageOptions),
        [LocalSettingsKeys.chunkPrefix]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.chunkPrefix, exports.LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix], storageOptions),
        [LocalSettingsKeys.showChunkInspector]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.showChunkInspector, exports.LocalSettingsDefaults[LocalSettingsKeys.showChunkInspector], storageOptions),
        [LocalSettingsKeys.autoShrinkEnabled]: (0, react_storage_complete_1.useLocalStorage)(LocalSettingsKeys.autoShrinkEnabled, exports.LocalSettingsDefaults[LocalSettingsKeys.autoShrinkEnabled], storageOptions),
    };
};
exports.useLocalSettings = useLocalSettings;
