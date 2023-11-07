import React from 'react';
import { StorageOptions, useLocalStorage } from 'react-storage-complete';
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
  [LocalSettingsKeys.defaultOpenAiModel]: 'gpt-3.5-turbo',
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
    [LocalSettingsKeys.selectedPresetName]: useLocalStorage(
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
    [LocalSettingsKeys.presetName]: useLocalStorage(
      LocalSettingsKeys.presetName,
      LocalSettingsDefaults[LocalSettingsKeys.presetName],
      storageOptions,
    ),
    [LocalSettingsKeys.presetDescription]: useLocalStorage(
      LocalSettingsKeys.presetDescription,
      LocalSettingsDefaults[LocalSettingsKeys.presetDescription],
      storageOptions,
    ),
    [LocalSettingsKeys.openAiModel]: useLocalStorage(
      LocalSettingsKeys.openAiModel,
      LocalSettingsDefaults[LocalSettingsKeys.openAiModel],
      storageOptions,
    ),
    [LocalSettingsKeys.systemPrompt]: useLocalStorage(
      LocalSettingsKeys.systemPrompt,
      LocalSettingsDefaults[LocalSettingsKeys.systemPrompt],
      storageOptions,
    ),
    [LocalSettingsKeys.userPrompt]: useLocalStorage(
      LocalSettingsKeys.userPrompt,
      LocalSettingsDefaults[LocalSettingsKeys.userPrompt],
      storageOptions,
    ),
    [LocalSettingsKeys.variableValues]: useLocalStorage(
      LocalSettingsKeys.variableValues,
      LocalSettingsDefaults[LocalSettingsKeys.variableValues],
      storageOptions,
    ),
    [LocalSettingsKeys.variableOptions]: useLocalStorage(
      LocalSettingsKeys.variableOptions,
      LocalSettingsDefaults[LocalSettingsKeys.variableOptions],
      storageOptions,
    ),
    [LocalSettingsKeys.input]: useLocalStorage(
      LocalSettingsKeys.input,
      LocalSettingsDefaults[LocalSettingsKeys.input],
      storageOptions,
    ),
    [LocalSettingsKeys.outputs]: useLocalStorage<string[]>(
      LocalSettingsKeys.outputs,
      LocalSettingsDefaults[LocalSettingsKeys.outputs],
      storageOptions,
    ),
    [LocalSettingsKeys.showRawOutput]: useLocalStorage(
      LocalSettingsKeys.showRawOutput,
      LocalSettingsDefaults[LocalSettingsKeys.showRawOutput],
      storageOptions,
    ),
    [LocalSettingsKeys.averageTokenLength]: useLocalStorage(
      LocalSettingsKeys.averageTokenLength,
      LocalSettingsDefaults[LocalSettingsKeys.averageTokenLength],
      storageOptions,
    ),
    [LocalSettingsKeys.requestMaxTokenRatio]: useLocalStorage(
      LocalSettingsKeys.requestMaxTokenRatio,
      LocalSettingsDefaults[LocalSettingsKeys.requestMaxTokenRatio],
      storageOptions,
    ),
    [LocalSettingsKeys.chunkOverlapWordCount]: useLocalStorage(
      LocalSettingsKeys.chunkOverlapWordCount,
      LocalSettingsDefaults[LocalSettingsKeys.chunkOverlapWordCount],
      storageOptions,
    ),
    [LocalSettingsKeys.chunkPrefix]: useLocalStorage(
      LocalSettingsKeys.chunkPrefix,
      LocalSettingsDefaults[LocalSettingsKeys.chunkPrefix],
      storageOptions,
    ),
    [LocalSettingsKeys.showChunkInspector]: useLocalStorage(
      LocalSettingsKeys.showChunkInspector,
      LocalSettingsDefaults[LocalSettingsKeys.showChunkInspector],
      storageOptions,
    ),
    [LocalSettingsKeys.autoShrinkEnabled]: useLocalStorage(
      LocalSettingsKeys.autoShrinkEnabled,
      LocalSettingsDefaults[LocalSettingsKeys.autoShrinkEnabled],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
