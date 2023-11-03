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
  variableValues: Record<string, string>;
  variableOptions: Record<string, string[]>;
}

export const defaultPresets: Preset[] = [
  {
    name: 'Extract Data',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt:
      'Extract, condense, and distill the {{Data_To_Extract}} from the following {{Document_Type}}, and list them. Do not provide a heading or commentary. Here is the {{Document_Type}}:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.7,
    chunkOverlapWordCount: 20,
    chunkPrefix: '(continued...) ',
    autoShrink: false,
    variableValues: { '{{Data_To_Extract}}': 'main points', '{{Document_Type}}': 'text' },
    variableOptions: {
      '{{Data_To_Extract}}': ['key ideas', 'main points', 'strategies'],
      '{{Document_Type}}': ['text', 'transcript'],
    },
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
    variableValues: {},
    variableOptions: {},
  },
  {
    name: 'Translate Text',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt: 'Translate the following from {{Start_Language}} to {{End_Language}}:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.4,
    chunkOverlapWordCount: 0,
    chunkPrefix: '',
    autoShrink: true,
    variableValues: {
      '{{Start_Language}}': 'English',
      '{{End_Language}}': 'German',
    },
    variableOptions: {
      '{{Start_Language}}': [
        'Arabic',
        'Bengali',
        'Bulgarian',
        'Catalan',
        'Czech',
        'Danish',
        'Dutch',
        'English',
        'Estonian',
        'Finnish',
        'French',
        'German',
        'Greek',
        'Hindi',
        'Hungarian',
        'Indonesian',
        'Italian',
        'Japanese',
        'Korean',
        'Mandarin Chinese',
        'Polish',
        'Portuguese',
        'Russian',
        'Spanish',
        'Tamil',
        'Turkish',
      ],
      '{{End_Language}}': [
        'Arabic',
        'Bengali',
        'Bulgarian',
        'Catalan',
        'Czech',
        'Danish',
        'Dutch',
        'English',
        'Estonian',
        'Finnish',
        'French',
        'German',
        'Greek',
        'Hindi',
        'Hungarian',
        'Indonesian',
        'Italian',
        'Japanese',
        'Korean',
        'Mandarin Chinese',
        'Polish',
        'Portuguese',
        'Russian',
        'Spanish',
        'Tamil',
        'Turkish',
      ],
    },
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
    variableValues: {},
    variableOptions: {},
  },
];

export const toSortedPresetsMap = (presets: Preset[]): Record<string, Preset> => {
  return presets
    .map((preset): Record<string, Preset> => ({ [preset.name]: preset }))
    .sort((a, b) => Object.keys(a)[0].toLowerCase().localeCompare(Object.keys(b)[0].toLowerCase()))
    .reduce((p, c) => ({ ...p, [Object.keys(c)[0]]: c[Object.keys(c)[0]] }));
};

export const defaultPresetsMap = toSortedPresetsMap(defaultPresets);
