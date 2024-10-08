export interface AIModelInfo {
  name: string;
  id: string;
  maxTokens: number;
  costPer1kInput: number;
  costPer1kOutput: number;
}

export const defaultOpenAiModelInfos: AIModelInfo[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    maxTokens: 4097,
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.0015,
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 16K',
    maxTokens: 16385,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.004,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    maxTokens: 8192,
    costPer1kInput: 0.03,
    costPer1kOutput: 0.06,
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 32K',
    maxTokens: 32768,
    costPer1kInput: 0.06,
    costPer1kOutput: 0.12,
  },
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo Preview 128K',
    maxTokens: 128000,
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4 Omni 128K',
    maxTokens: 128000,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4 Omni Mini 128K',
    maxTokens: 128000,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
  },
];
