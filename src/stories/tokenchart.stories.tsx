import { Meta, StoryObj } from "@storybook/react";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";
import { TokenChartProps, TokenCharts } from "@/components/widgets/tokenchart";

const tokensOption = [
  "solana",
  "ethereum",
  "wrapped-bitcoin",
  "wrapped-bitcoin-celer",
  "wrapped-bitcoin-pulsechain",
  "wrapped-bitcoin-sollet",
  "wrapped-bitcoin-stacks",
  "wrapped-bitcoin-universal",
  "dogwifhat-base",
  "dogwifhat-eth",
];

const meta = {
  title: "Widgets/TokenCharts",
  component: TokenCharts,
  argTypes: {
    token: {
      control: {
        type: "select",
      },
      options: tokensOption,
    },
  },
  parameters: {
    layout: "centered",
  },
  args: {
    token: "",
  },
  render: (arg) => (
    <ResponsiveContainer viewport={(arg as any).viewport}>
      <TokenCharts {...arg} />
    </ResponsiveContainer>
  ),
} satisfies Meta<typeof TokenCharts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SizeSM: Story = {};

export const SizeMD: Story = {
  args: {
    viewport: "md",
  } as Partial<TokenChartProps> & { viewport: string },
};

export const Stacked: Story = {
  args: {
    variant: "stacked",
    viewport: "md",
  } as Partial<TokenChartProps> & { viewport: string },
};

export const Loading: Story = {
  args: {
    token: "",
  },
  argTypes: {
    token: {
      control: false,
    },
  },
};
