import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Services, type ServicesSectionProps } from './Services';

const PROPS: ServicesSectionProps = {
  _type: 'servicesSection',
  _key: 'services',
  eyebrow: 'Services',
  heading: 'Services & Pricing',
  packages: [
    {
      _key: 'pkg-1',
      name: 'Full Detail',
      duration: '3 hrs',
      description: 'Inside and out.',
      price: 199,
      popular: true,
      includes: ['Hand wash'],
    },
  ],
  addons: [],
};

describe('Services booking CTAs', () => {
  it('links each package Book now CTA to /book', () => {
    render(<Services {...PROPS} />);
    const cta = screen.getByRole('link', { name: /book now: full detail/i });
    expect(cta).toHaveAttribute('href', '/book');
  });
});
