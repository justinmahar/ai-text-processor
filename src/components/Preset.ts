export interface Preset {
  name: string;
  aiModel: string;
  systemPrompt: string;
  userPrompt: string;
  averageTokenLength: number;
  requestMaxTokenRatio: number;
  chunkOverlapWordCount: number;
  chunkPrefix: string;
  autoShrink: boolean;
}

export const defaultPresets: Preset[] = [
  {
    name: 'Extract Main Points',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt:
      'Extract, condense, and distill the main points from the following, and list them. Do not provide a heading or commentary. Here is the text:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.7,
    chunkOverlapWordCount: 20,
    chunkPrefix: '(continued...) ',
    autoShrink: false,
  },
  {
    name: 'Quick Summary',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt: 'Provide a concise 1-paragraph summary of the following:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.7,
    chunkOverlapWordCount: 20,
    chunkPrefix: '(continued...) ',
    autoShrink: false,
  },
  {
    name: 'YouTube Transcript Formatter',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt:
      'For the following YouTube video transcript, add punctuation and capitalize the sentences for the text. Do not change the text in any other way and do NOT add or change any words. Transcript:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.4,
    chunkOverlapWordCount: 0,
    chunkPrefix: '',
    autoShrink: true,
  },
];

export const toSortedPresetsMap = (presets: Preset[]): Record<string, Preset> => {
  return presets
    .map((preset): Record<string, Preset> => ({ [preset.name]: preset }))
    .sort((a, b) => Object.keys(a)[0].toLowerCase().localeCompare(Object.keys(b)[0].toLowerCase()))
    .reduce((p, c) => ({ ...p, [Object.keys(c)[0]]: c[Object.keys(c)[0]] }));
};

export const defaultPresetsMap = toSortedPresetsMap(defaultPresets);
