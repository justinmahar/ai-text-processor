export interface AIModel {
  name: string;
  id: string;
  maxTokens: number;
  avgTokenLength: number;
}

export const defaultOpenAiModels: AIModel[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 (4K)',
    maxTokens: 4097,
    avgTokenLength: 4.5,
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 (16K)',
    maxTokens: 16385,
    avgTokenLength: 4.5,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4 (8K)',
    maxTokens: 8192,
    avgTokenLength: 4.5,
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 (32K)',
    maxTokens: 32768,
    avgTokenLength: 4.5,
  },
];
