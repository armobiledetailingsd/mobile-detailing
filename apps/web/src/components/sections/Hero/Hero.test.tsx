import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero, type HeroSectionProps } from './Hero';

const PROPS: HeroSectionProps = {
  _type: 'heroSection',
  _key: 'hero',
  eyebrow: 'Mobile detailing',
  headlineMain: 'Premium detailing,',
  headlineAccent: 'delivered to you.',
  body: 'We come to you.',
  trustMarkers: [],
};

describe('Hero booking CTAs', () => {
  it('links the primary Book your detail CTA to /book', () => {
    render(<Hero {...PROPS} />);
    const ctas = screen.getAllByRole('link', { name: /book your detail/i });
    expect(ctas.some((a) => a.getAttribute('href') === '/book')).toBe(true);
  });

  it('links View services to the services section', () => {
    render(<Hero {...PROPS} />);
    const cta = screen.getByRole('link', { name: /view services/i });
    expect(cta).toHaveAttribute('href', '/#services');
  });
});
