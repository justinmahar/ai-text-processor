import React from 'react';
import { StorageOptions, useLocalStorage } from 'react-storage-complete';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  templateState = 'templateState',
  openAiKey = 'openAiKey',
  processors = 'processors',
  selectedProcessor = 'selectedProcessor',
  customOpenAiModels = 'customOpenAiModels',
  prompt = 'prompt',
  input = 'input',
  output = 'output',
  showRawOutput = 'showRawOutput',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.openAiKey]: '',
  [LocalSettingsKeys.processors]: [],
  [LocalSettingsKeys.selectedProcessor]: '',
  [LocalSettingsKeys.customOpenAiModels]: [] as AIModel[],
  [LocalSettingsKeys.prompt]: '',
  [LocalSettingsKeys.input]: '',
  [LocalSettingsKeys.output]: '',
  [LocalSettingsKeys.showRawOutput]: false,
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
    [LocalSettingsKeys.processors]: useLocalStorage(
      LocalSettingsKeys.processors,
      LocalSettingsDefaults[LocalSettingsKeys.processors],
      storageOptions,
    ),
    [LocalSettingsKeys.selectedProcessor]: useLocalStorage(
      LocalSettingsKeys.selectedProcessor,
      LocalSettingsDefaults[LocalSettingsKeys.selectedProcessor],
      storageOptions,
    ),
    [LocalSettingsKeys.customOpenAiModels]: useLocalStorage(
      LocalSettingsKeys.customOpenAiModels,
      LocalSettingsDefaults[LocalSettingsKeys.customOpenAiModels] as AIModel[],
      storageOptions,
    ),
    [LocalSettingsKeys.prompt]: useLocalStorage(
      LocalSettingsKeys.prompt,
      LocalSettingsDefaults[LocalSettingsKeys.prompt],
      storageOptions,
    ),
    [LocalSettingsKeys.input]: useLocalStorage(
      LocalSettingsKeys.input,
      LocalSettingsDefaults[LocalSettingsKeys.input],
      storageOptions,
    ),
    [LocalSettingsKeys.output]: useLocalStorage(
      LocalSettingsKeys.output,
      LocalSettingsDefaults[LocalSettingsKeys.output],
      storageOptions,
    ),
    [LocalSettingsKeys.showRawOutput]: useLocalStorage(
      LocalSettingsKeys.showRawOutput,
      LocalSettingsDefaults[LocalSettingsKeys.showRawOutput],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;

export interface Processor {
  name: string;
  ai: string;
  modelId: string;
  prompt: string;
}

export interface AIModel {
  name: string;
  id: string;
  maxTokens: number;
}

export const defaultOpenAiModels: AIModel[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 4K',
    maxTokens: 4097,
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 16K',
    maxTokens: 16385,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    maxTokens: 8192,
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 32K',
    maxTokens: 32768,
  },
];
