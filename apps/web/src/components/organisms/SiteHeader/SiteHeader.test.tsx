import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader booking CTAs', () => {
  it('links the desktop Book now CTA to /book', () => {
    render(<SiteHeader navigation={null} />);
    const cta = screen.getByRole('link', { name: /book now/i });
    expect(cta).toHaveAttribute('href', '/book');
  });

  it('links the mobile drawer Book now CTA to /book', async () => {
    const user = userEvent.setup();
    render(<SiteHeader navigation={null} />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const ctas = screen.getAllByRole('link', { name: /book now/i });
    for (const cta of ctas) {
      expect(cta).toHaveAttribute('href', '/book');
    }
    expect(ctas.length).toBeGreaterThanOrEqual(2);
  });
});
