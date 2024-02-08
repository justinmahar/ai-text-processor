import type { Meta, StoryObj } from '@storybook/react';
import { Settings as SettingsComponent } from '../components/Settings';

// === Setup ===
const StoryComponenet = SettingsComponent; // <-- Set to your component
const meta: Meta<typeof StoryComponenet> = {
  title: 'Utilities/AI Text Processor', // <-- Set to your story title
  component: StoryComponenet,
  parameters: {
    options: { showPanel: false }, // Don't show addons panel
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// === Stories ===
export const Settings: Story = {
  args: {},
};
