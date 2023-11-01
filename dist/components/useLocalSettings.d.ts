/**
 * Local settings for the application.
 */
export declare enum LocalSettingsKeys {
    templateState = "templateState",
    youTubeApiKey = "youTubeApiKey"
}
export declare const LocalSettingsDefaults: {
    templateState: boolean;
    youTubeApiKey: string;
};
export declare const useLocalSettings: () => {
    templateState: import("react-storage-complete").StorageState<any>;
    youTubeApiKey: import("react-storage-complete").StorageState<any>;
};
export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
