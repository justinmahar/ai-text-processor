import React from 'react';
import { StorageOptions, useLocalStorage, useSessionStorage } from 'react-storage-complete';
import { AIModelInfo, defaultOpenAiModelInfos } from './AIModelInfo';
import { Preset, defaultAiModelOption, defaultPresets, defaultPresetsMap } from './Preset';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  templateState = 'templateState',
  openAiKey = 'openAiKey',
  presets = 'presets',
  selectedPresetName = 'selectedPresetName',
  customOpenAiModelInfos = 'customOpenAiModelInfos',
  defaultOpenAiModel = 'defaultOpenAiModel',
  presetName = 'presetName',
  presetDescription = 'presetDescription',
  openAiModel = 'openAiModel',
  systemPrompt = 'systemPrompt',
  userPrompt = 'userPrompt',
  variableValues = 'variableValues',
  variableOptions = 'variableOptions',
  inputDisabled = 'inputDisabled',
  input = 'input',
  outputs = 'outputs',
  showRawOutput = 'showRawOutput',
  averageTokenLength = 'averageTokenLength',
  requestMaxTokenRatio = 'requestMaxTokenRatio',
  chunkOverlapWordCount = 'chunkOverlapWordCount',
  chunkPrefix = 'chunkPrefix',
  showChunkInspector = 'showChunkInspector',
  autoShrinkEnabled = 'autoShrinkEnabled',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.openAiKey]: '',
  [LocalSettingsKeys.presets]: defaultPresetsMap,
  [LocalSettingsKeys.selectedPresetName]: '',
  [LocalSettingsKeys.customOpenAiModelInfos]: [] as AIModelInfo[],
  [LocalSettingsKeys.defaultOpenAiModel]: 'gpt-4o',
  [LocalSettingsKeys.presetName]: '',
  [LocalSettingsKeys.presetDescription]: '',
  [LocalSettingsKeys.openAiModel]: defaultAiModelOption,
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
  [LocalSettingsKeys.inputDisabled]: false,
};

export const useLocalSettings = () => {
  const storageOptions: StorageOptions<any> = React.useMemo(() => {
    return {
      prefix: 'ai-text-processor',
    };
  }, []);

  return {
    [LocalSettingsKeys.templateState]: useLocalStorage(
      LocalSettingsKeys.templateState,
      LocalSettingsDefaults[LocalSettingsKeys.templateState],
      storageOptions,
    ),
    [LocalSettingsKeys.openAiKey]: useLocalStorage(
      LocalSettingsKeys.openAiKey,
      LocalSettingsDefaults[LocalSettingsKeys.openAiKey],
      storageOptions,
    ),
    [LocalSettingsKeys.presets]: useLocalStorage<Record<string, Preset>>(
      LocalSettingsKeys.presets,
      LocalSettingsDefaults[LocalSettingsKeys.presets],
      storageOptions,
    ),
    [LocalSettingsKeys.selectedPresetName]: useSessionStorage(
      LocalSettingsKeys.selectedPresetName,
      LocalSettingsDefaults[LocalSettingsKeys.selectedPresetName],
      storageOptions,
    ),
    [LocalSettingsKeys.customOpenAiModelInfos]: useLocalStorage<AIModelInfo[]>(
      LocalSettingsKeys.customOpenAiModelInfos,
      LocalSettingsDefaults[LocalSettingsKeys.customOpenAiModelInfos],
      storageOptions,
    ),
    [LocalSettingsKeys.defaultOpenAiModel]: useLocalStorage(
      LocalSettingsKeys.defaultOpenAiModel,
      LocalSettingsDefaults[LocalSettingsKeys.defaultOpenAiModel],
      storageOptions,
    ),
    [LocalSettingsKeys.presetName]: useSessionStorage(
      LocalSettingsKeys.presetName,
      LocalSettingsDefaults[LocalSettingsKeys.presetName],
      storageOptions,
    ),
    [LocalSettingsKeys.presetDescription]: useSessionStorage(
      LocalSettingsKeys.presetDescription,
      LocalSettingsDefaults[LocalSettingsKeys.presetDescription],
      storageOptions,
    ),
    [LocalSettingsKeys.openAiModel]: useSessionStorage(
      LocalSettingsKeys.openAiModel,
      LocalSettingsDefaults[LocalSettingsKeys.openAiModel],
      storageOptions,
    ),
    [LocalSettingsKeys.systemPrompt]: useSessionStorage(
      LocalSettingsKeys.systemPrompt,
      LocalSettingsDefaults[LocalSettingsKeys.systemPrompt],
      storageOptions,
    ),
    [LocalSettingsKeys.userPrompt]: useSessionStorage(
      LocalSettingsKeys.userPrompt,
      LocalSettingsDefaults[LocalSettingsKeys.userPrompt],
      storageOptions,
    ),
    [LocalSettingsKeys.variableValues]: useSessionStorage(
      LocalSettingsKeys.variableValues,
      LocalSettingsDefaults[LocalSettingsKeys.variableValues],
      storageOptions,
    ),
    [LocalSettingsKeys.variableOptions]: useSessionStorage(
      LocalSettingsKeys.variableOptions,
      LocalSettingsDefaults[LocalSettingsKeys.variableOptions],
      storageOptions,
    ),
    [LocalSettingsKeys.input]: useSessionStorage(
      LocalSettingsKeys.input,
      LocalSettingsDefaults[LocalSettingsKeys.input],
      storageOptions,
    ),
    [LocalSettingsKeys.outputs]: useSessionStorage<string[]>(
      LocalSettingsKeys.outputs,
      LocalSettingsDefaults[LocalSettingsKeys.outputs],
      storageOptions,
    ),
    [LocalSettingsKeys.showRawOutput]: useSessionStorage(
      LocalSettingsKeys.showRawOutput,
      LocalSettingsDefaults[LocalSettingsKeys.showRawOutput],
      storageOptions,
    ),
    [LocalSettingsKeys.averageTokenLength]: useSessionStorage(
      LocalSettingsKeys.averageTokenLength,
      LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength],
      storageOptions,
    ),
    [LocalSettingsKeys.requestMaxTokenRatio]: useSessionStorage(
      LocalSettingsKeys.requestMaxTokenRatio,
      LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio],
      storageOptions,
    ),
    [LocalSettingsKeys.chunkOverlapWordCount]: useSessionStorage(
      LocalSettingsKeys.chunkOverlapWordCount,
      LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount],
      storageOptions,
    ),
    [LocalSettingsKeys.chunkPrefix]: useSessionStorage(
      LocalSettingsKeys.chunkPrefix,
      LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix],
      storageOptions,
    ),
    [LocalSettingsKeys.showChunkInspector]: useSessionStorage(
      LocalSettingsKeys.showChunkInspector,
      LocalSettingsDefaults[LocalSettingsKeys.showChunkInspector],
      storageOptions,
    ),
    [LocalSettingsKeys.autoShrinkEnabled]: useSessionStorage(
      LocalSettingsKeys.autoShrinkEnabled,
      LocalSettingsDefaults[LocalSettingsKeys.autoShrinkEnabled],
      storageOptions,
    ),
    [LocalSettingsKeys.inputDisabled]: useSessionStorage(
      LocalSettingsKeys.inputDisabled,
      LocalSettingsDefaults[LocalSettingsKeys.inputDisabled],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
