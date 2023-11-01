/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Settings as SettingsComponent } from '../components/Settings';

export default {
  title: 'Utilities/AI Text Processor',
  component: SettingsComponent,
  parameters: {
    controls: {
      disabled: true,
    },
    options: { showPanel: false },
  },
} as ComponentMeta<typeof SettingsComponent>;

const Template: ComponentStory<typeof SettingsComponent> = (args) => <SettingsComponent {...args} />;

export const Settings = Template.bind({});
Settings.args = {};
