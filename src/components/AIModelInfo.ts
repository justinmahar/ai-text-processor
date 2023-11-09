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
    costPer1kInput: 0.0015,
    costPer1kOutput: 0.002,
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
];
