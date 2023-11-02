import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { LocalSettingsKeys, useLocalSettings } from './useLocalSettings';
import { AISettingsModal } from './settings/AISettingsModal';

export interface SettingsProps extends DivProps {}

export const Settings = ({ ...props }: SettingsProps) => {
  const localSettings = useLocalSettings();
  const [showAISettings, setShowAISettings] = React.useState(false);
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <AISettingsModal show={showAISettings} setShow={setShowAISettings} />
      <Card>
        <Card.Header>Settings</Card.Header>
        <Card.Body>
          <Button variant="primary" onClick={() => setShowAISettings(true)}>
            AI Settings
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};
