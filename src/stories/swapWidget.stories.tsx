import { SwapWidgets } from "@/components/widgets/SwapWidget";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Widgets/SwapWidgets",
  component: SwapWidgets,
  argTypes: {},
  parameters: {
    layout: "centered",
  },
  args: {
    token: "",
  },
} satisfies Meta<typeof SwapWidgets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
