"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextUtils = void 0;
class TextUtils {
    static shrinkText(text) {
        return text
            .split(/\d+[:]\d+/)
            .join(' ')
            .split(/\n+/)
            .join(' ')
            .split(/\s\s+/)
            .join(' ');
    }
    static getEstimatedTokenCount(text, averageTokenLength = 4) {
        return Math.ceil(text.length / averageTokenLength);
    }
    static getChunks(systemPrompt, userPrompt, input, maxTokens, options) {
        const maxTokensPerChunk = Math.floor(maxTokens * options.requestMaxTokenRatio);
        const systemPromptTokenCount = TextUtils.getEstimatedTokenCount(systemPrompt);
        const userPromptTokenCount = TextUtils.getEstimatedTokenCount(userPrompt);
        const maxInputTokenCount = maxTokensPerChunk - systemPromptTokenCount - userPromptTokenCount;
        const chunks = [];
        if (maxInputTokenCount > 0) {
            const words = input.split(' ');
            let chunkBuffer = '';
            let chunkWordCount = 0;
            for (let i = 0; i < words.length; i++) {
                if (chunkBuffer) {
                    chunkBuffer += ' ';
                }
                chunkBuffer += words[i];
                chunkWordCount++;
                const newBufferTokenCount = TextUtils.getEstimatedTokenCount(chunkBuffer, options.averageTokenLength);
                if (newBufferTokenCount >= maxInputTokenCount) {
                    chunks.push(chunkBuffer);
                    chunkBuffer = options.chunkPrefix;
                    if (chunkWordCount > options.chunkOverlapWordCount) {
                        i = i - options.chunkOverlapWordCount;
                    }
                    chunkWordCount = 0;
                }
            }
            if (chunkBuffer.length > 0) {
                chunks.push(chunkBuffer);
            }
        }
        return chunks;
    }
}
exports.TextUtils = TextUtils;
