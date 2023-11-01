import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { LocalSettingsKeys, useLocalSettings } from './useLocalSettings';

export interface SettingsProps extends DivProps {}

export const Settings = ({ ...props }: SettingsProps) => {
  const localSettings = useLocalSettings();

  const [youTubeApiKey, setYouTubeApiKey] = localSettings[LocalSettingsKeys.youTubeApiKey];
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <Card>
        <Card.Header>Settings</Card.Header>
        <Card.Body>
          {youTubeApiKey}
          <Form.Control
            type="text"
            placeholder="Placeholder text"
            value={`${youTubeApiKey}`}
            onChange={(e) => setYouTubeApiKey(e.target.value)}
          />
        </Card.Body>
      </Card>
    </div>
  );
};
