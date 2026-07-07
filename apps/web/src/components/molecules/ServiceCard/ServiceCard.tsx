import type { CSSProperties, HTMLAttributes } from 'react';
import { Card } from '@/components/atoms/Card';
import { Icon, type IconName } from '@/components/atoms/Icon';
import Image from 'next/image';

/* ServiceCard — a service in the services grid. Icon, title, one-line
   description, optional "from $XX" starting price. Corner-bracket framed. */
type ServiceCardProps = {
  icon: IconName;
  title: string;
  description: string;
  price?: string;
  imageSrc?: string;
  imageAlt?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function ServiceCard({ icon, title, description, price, imageSrc, imageAlt, style, ...rest }: ServiceCardProps) {
  return (
    <Card brackets padding={22} style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }} {...rest}>
      {imageSrc && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
          <Image src={imageSrc} alt={imageAlt ?? title} fill sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
        </div>
      )}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--graphite-800)',
          color: 'var(--signal-orange)',
          border: '1px solid var(--border-default)',
        }}
      >
        <Icon name={icon} size={26} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-condensed)',
            fontWeight: 700,
            fontSize: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: 'var(--off-white)',
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--steel-300)', lineHeight: 1.5 }}>{description}</p>
      </div>
      {price && (
        <div style={{ marginTop: 'auto', paddingTop: 4 }}>
          <span
            style={{
              fontSize: 13,
              color: 'var(--steel-300)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-condensed)',
              fontWeight: 600,
            }}
          >
            From{' '}
          </span>
          <span className="rr-numeric" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--caution-yellow)' }}>
            {price}
          </span>
        </div>
      )}
    </Card>
  );
}
