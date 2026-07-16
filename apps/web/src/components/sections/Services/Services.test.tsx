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
      priceSedan: 199,
      priceTruckSuv: 249.99,
      popular: true,
      includes: ['Hand wash'],
    },
  ],
  addons: [],
};

describe('Services booking CTAs', () => {
  it('links a known package Book now CTA to /book with its slug', () => {
    const props: ServicesSectionProps = {
      ...PROPS,
      packages: [{ ...PROPS.packages![0]!, name: 'Silver' }],
    };
    render(<Services {...props} />);
    const cta = screen.getByRole('link', { name: /book now: silver/i });
    expect(cta).toHaveAttribute('href', '/book?package=silver');
  });

  it('falls back to plain /book when the package name is unknown', () => {
    render(<Services {...PROPS} />);
    const cta = screen.getByRole('link', { name: /book now: full detail/i });
    expect(cta).toHaveAttribute('href', '/book');
  });
});

describe('Services vehicle-size rates', () => {
  it('renders sedan and truck/SUV rates for each package', () => {
    render(<Services {...PROPS} />);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$199')).toBeInTheDocument();
    expect(screen.getByText('Truck or SUV')).toBeInTheDocument();
    expect(screen.getByText('$249.99')).toBeInTheDocument();
  });
});
