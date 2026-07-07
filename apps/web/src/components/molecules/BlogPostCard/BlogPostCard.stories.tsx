import type { Meta, StoryObj } from '@storybook/react-vite';
import { BlogPostCard } from './BlogPostCard';

const meta = {
  title: 'Molecules/BlogPostCard',
  component: BlogPostCard,
} satisfies Meta<typeof BlogPostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'How long do tires actually last?',
    slug: 'how-long-do-tires-last',
    excerpt:
      'Tread depth, age, and driving habits all factor in. Here is how to know when it is time to replace your tires.',
    publishedAt: '2026-06-15T12:00:00Z',
  },
};

export const WithoutDate: Story = {
  args: {
    ...Default.args,
    publishedAt: undefined,
  },
};
