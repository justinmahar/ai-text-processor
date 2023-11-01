import React from 'react';
import { useLocalStorage } from 'react-storage-complete';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  templateState = 'templateState',
  youTubeApiKey = 'youTubeApiKey',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.youTubeApiKey]: '',
};

export const useLocalSettings = () => {
  const storageOptions = React.useMemo(() => {
    return {};
  }, []);

  return {
    [LocalSettingsKeys.templateState]: useLocalStorage(
      LocalSettingsKeys.templateState,
      LocalSettingsDefaults[LocalSettingsKeys.templateState],
      storageOptions,
    ),
    [LocalSettingsKeys.youTubeApiKey]: useLocalStorage(
      LocalSettingsKeys.youTubeApiKey,
      LocalSettingsDefaults[LocalSettingsKeys.youTubeApiKey],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
