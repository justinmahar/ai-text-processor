import { AIModelInfo } from './AIModelInfo';
import { Preset } from './Preset';
/**
 * Local settings for the application.
 */
export declare enum LocalSettingsKeys {
    templateState = "templateState",
    openAiKey = "openAiKey",
    presets = "presets",
    selectedPresetName = "selectedPresetName",
    customOpenAiModelInfos = "customOpenAiModelInfos",
    presetName = "presetName",
    openAiModel = "openAiModel",
    systemPrompt = "systemPrompt",
    userPrompt = "userPrompt",
    variableValues = "variableValues",
    variableOptions = "variableOptions",
    input = "input",
    outputs = "outputs",
    showRawOutput = "showRawOutput",
    averageTokenLength = "averageTokenLength",
    requestMaxTokenRatio = "requestMaxTokenRatio",
    chunkOverlapWordCount = "chunkOverlapWordCount",
    chunkPrefix = "chunkPrefix",
    showChunkInspector = "showChunkInspector",
    autoShrinkEnabled = "autoShrinkEnabled"
}
export declare const LocalSettingsDefaults: {
    templateState: boolean;
    openAiKey: string;
    presets: Record<string, Preset>;
    selectedPresetName: string;
    customOpenAiModelInfos: AIModelInfo[];
    presetName: string;
    openAiModel: string;
    systemPrompt: string;
    userPrompt: string;
    variableValues: {};
    variableOptions: {};
    input: string;
    outputs: never[];
    showRawOutput: boolean;
    averageTokenLength: number;
    requestMaxTokenRatio: number;
    chunkOverlapWordCount: number;
    chunkPrefix: string;
    showChunkInspector: boolean;
    autoShrinkEnabled: boolean;
};
export declare const useLocalSettings: () => {
    templateState: import("react-storage-complete").StorageState<any>;
    openAiKey: import("react-storage-complete").StorageState<any>;
    presets: import("react-storage-complete").StorageState<Record<string, Preset>>;
    selectedPresetName: import("react-storage-complete").StorageState<any>;
    customOpenAiModelInfos: import("react-storage-complete").StorageState<AIModelInfo[]>;
    presetName: import("react-storage-complete").StorageState<any>;
    openAiModel: import("react-storage-complete").StorageState<any>;
    systemPrompt: import("react-storage-complete").StorageState<any>;
    userPrompt: import("react-storage-complete").StorageState<any>;
    variableValues: import("react-storage-complete").StorageState<any>;
    variableOptions: import("react-storage-complete").StorageState<any>;
    input: import("react-storage-complete").StorageState<any>;
    outputs: import("react-storage-complete").StorageState<string[]>;
    showRawOutput: import("react-storage-complete").StorageState<any>;
    averageTokenLength: import("react-storage-complete").StorageState<any>;
    requestMaxTokenRatio: import("react-storage-complete").StorageState<any>;
    chunkOverlapWordCount: import("react-storage-complete").StorageState<any>;
    chunkPrefix: import("react-storage-complete").StorageState<any>;
    showChunkInspector: import("react-storage-complete").StorageState<any>;
    autoShrinkEnabled: import("react-storage-complete").StorageState<any>;
};
export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
