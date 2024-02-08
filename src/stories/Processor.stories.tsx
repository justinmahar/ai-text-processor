import type { Meta, StoryObj } from '@storybook/react';
import { AITextProcessor as ProcessorComponent } from '../components/AITextProcessor';

// === Setup ===
const StoryComponent = ProcessorComponent; // <-- Set to your component
const meta: Meta<typeof StoryComponent> = {
  title: 'Utilities/AI Text Processor', // <-- Set to your story title
  component: StoryComponent,
};
export default meta;
type Story = StoryObj<typeof meta>;

// === Stories ===
export const Processor: Story = {
  args: {},
};
