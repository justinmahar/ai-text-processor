/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Processor as ProcessorComponent } from '../components/Processor';

export default {
  title: 'Utilities/AI Text Processor',
  component: ProcessorComponent,
  parameters: {
    controls: {
      disabled: true,
    },
    options: { showPanel: false },
  },
} as ComponentMeta<typeof ProcessorComponent>;

const Template: ComponentStory<typeof ProcessorComponent> = (args) => <ProcessorComponent {...args} />;

export const Processor = Template.bind({});
Processor.args = {};
