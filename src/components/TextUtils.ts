export class TextUtils {
  public static shrinkText(text: string) {
    return text
      .split(/\d+[:]\d+/)
      .join(' ')
      .split(/\n+/)
      .join(' ')
      .split(/\s\s+/)
      .join(' ');
  }

  public static getEstimatedTokenCount(text: string, averageTokenLength = 4) {
    return Math.ceil(text.length / averageTokenLength);
  }

  public static getChunks(
    systemPrompt: string,
    userPrompt: string,
    input: string,
    maxTokens: number,
    options: {
      averageTokenLength: number;
      requestMaxTokenRatio: number;
      chunkOverlapWordCount: number;
      chunkPrefix: string;
    },
  ): string[] {
    const maxTokensPerChunk = Math.floor(maxTokens * options.requestMaxTokenRatio);
    const systemPromptTokenCount = TextUtils.getEstimatedTokenCount(systemPrompt);
    const userPromptTokenCount = TextUtils.getEstimatedTokenCount(userPrompt);
    const maxInputTokenCount = maxTokensPerChunk - systemPromptTokenCount - userPromptTokenCount;
    const chunks: string[] = [];
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

      if (
        chunkBuffer.length > 0 ||
        // Allow empty inputs
        input.trim() === ''
      ) {
        chunks.push(chunkBuffer);
      }
    }
    return chunks;
  }
}
