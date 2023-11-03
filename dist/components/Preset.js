"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPresetsMap = exports.toSortedPresetsMap = exports.defaultPresets = void 0;
exports.defaultPresets = [
    {
        name: 'Extract Main Points',
        aiModel: 'gpt-3.5-turbo',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'Extract, condense, and distill the main points from the following, and list them. Do not provide a heading or commentary. Here is the text:',
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
        userPrompt: 'For the following YouTube video transcript, add punctuation and capitalize the sentences for the text. Do not change the text in any other way and do NOT add or change any words. Transcript:',
        averageTokenLength: 4.5,
        requestMaxTokenRatio: 0.4,
        chunkOverlapWordCount: 0,
        chunkPrefix: '',
        autoShrink: true,
    },
];
const toSortedPresetsMap = (presets) => {
    return presets
        .map((preset) => ({ [preset.name]: preset }))
        .sort((a, b) => Object.keys(a)[0].toLowerCase().localeCompare(Object.keys(b)[0].toLowerCase()))
        .reduce((p, c) => (Object.assign(Object.assign({}, p), { [Object.keys(c)[0]]: c[Object.keys(c)[0]] })));
};
exports.toSortedPresetsMap = toSortedPresetsMap;
exports.defaultPresetsMap = (0, exports.toSortedPresetsMap)(exports.defaultPresets);
