export interface AIModel {
  name: string;
  id: string;
  maxTokens: number;
}

export const defaultOpenAiModels: AIModel[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
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
