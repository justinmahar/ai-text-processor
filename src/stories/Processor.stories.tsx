import type { Meta, StoryObj } from '@storybook/react';
import { AITextProcessor as ProcessorComponent } from '../components/AITextProcessor';

// === Setup ===
const StoryComponenet = ProcessorComponent; // <-- Set to your component
const meta: Meta<typeof StoryComponenet> = {
  title: 'Utilities/AI Text Processor', // <-- Set to your story title
  component: StoryComponenet,
  parameters: {
    controls: {
      disabled: true,
    },
    options: { showPanel: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// === Stories ===
export const Processor: Story = {
  args: {},
};
