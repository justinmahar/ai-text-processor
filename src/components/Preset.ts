export interface Preset {
  name: string;
  description: string;
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
    name: '📖 Extract Data',
    description: 'Extracts data from a body of text.',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt:
      'Extract {{Data_To_Extract}} from the following {{Document_Type}}, and format the results as {{Formatted_As}}. Do not provide a heading or commentary. Here is the {{Document_Type}}:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.7,
    chunkOverlapWordCount: 20,
    chunkPrefix: '(continued...) ',
    autoShrink: false,
    variableValues: {
      '{{Data_To_Extract}}': 'the main points',
      '{{Document_Type}}': 'text',
      '{{Formatted_As}}': 'bullet points',
    },
    variableOptions: {
      '{{Data_To_Extract}}': ['the key ideas', 'the main points', 'the strategies'],
      '{{Document_Type}}': ['text', 'video transcript'],
      '{{Formatted_As}}': ['a numbered list', 'a markdown table', 'bullet points'],
    },
  },
  {
    name: '📖 Summarize',
    description: 'Summarizes a body of text.',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt: 'In {{Length_of_Summary}} or less, provide a concise summary of the following:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.7,
    chunkOverlapWordCount: 20,
    chunkPrefix: '(continued...) ',
    autoShrink: false,
    variableValues: { '{{Length_of_Summary}}': '1 paragraph' },
    variableOptions: { '{{Length_of_Summary}}': ['1 sentence', '1 paragraph', '2 paragraphs', '3 paragraphs'] },
  },
  {
    name: '📖 Translate Text',
    description: 'Translates text from one language to another.',
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
    name: '📖 Format Text',
    description: 'Adds capitalization and punctuation to a body of text, without changing any words.',
    aiModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    userPrompt:
      'For the following {{Document_Type}}, add punctuation and capitalize the sentences of the text. Do not change the text in any other way and do NOT add or change any words. Here is the {{Document_Type}}:',
    averageTokenLength: 4.5,
    requestMaxTokenRatio: 0.4,
    chunkOverlapWordCount: 0,
    chunkPrefix: '',
    autoShrink: true,
    variableValues: { '{{Document_Type}}': 'text' },
    variableOptions: {
      '{{Document_Type}}': ['text', 'video transcript'],
    },
  },
];

export const toSortedPresetsMap = (presets: Preset[]): Record<string, Preset> => {
  return presets
    .map((preset): Record<string, Preset> => ({ [preset.name]: preset }))
    .sort((a, b) => Object.keys(a)[0].toLowerCase().localeCompare(Object.keys(b)[0].toLowerCase()))
    .reduce((p, c) => ({ ...p, [Object.keys(c)[0]]: c[Object.keys(c)[0]] }));
};

export const defaultPresetsMap = toSortedPresetsMap(defaultPresets);
