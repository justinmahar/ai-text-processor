import React from 'react';
import { StorageOptions, useLocalStorage } from 'react-storage-complete';
import { AIModel, defaultOpenAiModels } from './open-ai-models';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  templateState = 'templateState',
  openAiKey = 'openAiKey',
  processors = 'processors',
  selectedProcessorName = 'selectedProcessorName',
  customOpenAiModels = 'customOpenAiModels',
  processorName = 'processorName',
  openAiModel = 'openAiModel',
  systemPrompt = 'systemPrompt',
  userPrompt = 'userPrompt',
  input = 'input',
  outputs = 'outputs',
  showRawOutput = 'showRawOutput',
  averageTokenLength = 'averageTokenLength',
  requestMaxTokenRatio = 'requestMaxTokenRatio',
  chunkOverlapWordCount = 'chunkOverlapWordCount',
  chunkPrefix = 'chunkPrefix',
  showChunkInspector = 'showChunkInspector',
  autoScrubEnabled = 'autoScrubEnabled',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.openAiKey]: '',
  [LocalSettingsKeys.processors]: [] as Record<string, any>,
  [LocalSettingsKeys.selectedProcessorName]: '',
  [LocalSettingsKeys.customOpenAiModels]: [] as AIModel[],
  [LocalSettingsKeys.processorName]: '',
  [LocalSettingsKeys.openAiModel]: defaultOpenAiModels[0].id,
  [LocalSettingsKeys.systemPrompt]: 'You are a helpful assistant.',
  [LocalSettingsKeys.userPrompt]: '',
  [LocalSettingsKeys.input]: '',
  [LocalSettingsKeys.outputs]: [],
  [LocalSettingsKeys.showRawOutput]: false,
  [LocalSettingsKeys.averageTokenLength]: 4.5,
  [LocalSettingsKeys.requestMaxTokenRatio]: 0.6,
  [LocalSettingsKeys.chunkOverlapWordCount]: 20,
  [LocalSettingsKeys.chunkPrefix]: '(continued...) ',
  [LocalSettingsKeys.showChunkInspector]: false,
  [LocalSettingsKeys.autoScrubEnabled]: false,
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
    [LocalSettingsKeys.processors]: useLocalStorage<Record<string, TextProcessor>>(
      LocalSettingsKeys.processors,
      LocalSettingsDefaults[LocalSettingsKeys.processors],
      storageOptions,
    ),
    [LocalSettingsKeys.selectedProcessorName]: useLocalStorage(
      LocalSettingsKeys.selectedProcessorName,
      LocalSettingsDefaults[LocalSettingsKeys.selectedProcessorName],
      storageOptions,
    ),
    [LocalSettingsKeys.customOpenAiModels]: useLocalStorage<AIModel[]>(
      LocalSettingsKeys.customOpenAiModels,
      LocalSettingsDefaults[LocalSettingsKeys.customOpenAiModels],
      storageOptions,
    ),
    [LocalSettingsKeys.processorName]: useLocalStorage(
      LocalSettingsKeys.processorName,
      LocalSettingsDefaults[LocalSettingsKeys.processorName],
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
    [LocalSettingsKeys.autoScrubEnabled]: useLocalStorage(
      LocalSettingsKeys.autoScrubEnabled,
      LocalSettingsDefaults[LocalSettingsKeys.autoScrubEnabled],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;

export interface TextProcessor {
  name: string;
  aiModel: string;
  systemPrompt: string;
  userPrompt: string;
  averageTokenLength: number;
  requestMaxTokenRatio: number;
  chunkOverlapWordCount: number;
  chunkPrefix: string;
}
