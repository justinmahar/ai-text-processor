export declare class TextUtils {
    static shrinkText(text: string): string;
    static getEstimatedTokenCount(text: string, averageTokenLength?: number): number;
    static getChunks(systemPrompt: string, userPrompt: string, input: string, maxTokens: number, options: {
        averageTokenLength: number;
        requestMaxTokenRatio: number;
        chunkOverlapWordCount: number;
        chunkPrefix: string;
    }): string[];
}
