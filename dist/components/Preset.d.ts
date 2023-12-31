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
export declare const defaultPresets: Preset[];
export declare const toSortedPresetsMap: (presets: Preset[]) => Record<string, Preset>;
export declare const defaultPresetsMap: Record<string, Preset>;
