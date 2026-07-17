import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Alex Detailing collects, uses, and protects your information.',
};

const EFFECTIVE_DATE = 'July 16, 2026';
const CONTACT_EMAIL = '[CONTACT_EMAIL]';

export default function PrivacyPage() {
  return (
    <main className="bg-ink1 px-6 py-16">
      <article className="mx-auto w-full max-w-[720px] text-[15px] leading-[1.7] text-silver">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Privacy Policy
        </h1>
        <p className="m-0 mb-10 text-[14px] text-muted">Effective date: {EFFECTIVE_DATE}</p>

        <Section title="1. Who we are">
          <p>
            Alex Detailing (&ldquo;Alex Detailing,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) provides mobile vehicle detailing services throughout North County
            San Diego, California, including Carlsbad, Oceanside, Vista, San Marcos, Escondido,
            Encinitas, Solana Beach, Del Mar, Rancho Santa Fe, and Fallbrook. This Privacy Policy
            explains how we collect, use, and share information when you visit our website or book
            a service with us.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <p>When you book a detail through our website, we collect:</p>
          <ul className="pl-5 my-3 space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your ZIP code (used to confirm you&rsquo;re in our service area)</li>
            <li>
              Scheduling details you provide through our appointment scheduler (Calendly), such as
              your chosen date and time
            </li>
            <li>
              Payment information you provide to process a booking deposit, which is collected and
              processed directly by Stripe &mdash; we do not receive or store your full card
              details
            </li>
          </ul>
          <p>
            If you contact us by phone, text, or email, we&rsquo;ll also have whatever information
            you choose to share with us in that conversation.
          </p>
        </Section>

        <Section title="3. How we use your information">
          <p>We use the information we collect to:</p>
          <ul className="pl-5 my-3 space-y-1">
            <li>Confirm you&rsquo;re located within our service area</li>
            <li>Schedule and manage your appointment</li>
            <li>Process your booking deposit and match it to your reservation</li>
            <li>Communicate with you about your booking, including confirmations and reminders</li>
            <li>Provide customer support and respond to questions</li>
            <li>Improve our services and website</li>
          </ul>
          <p>We do not sell your personal information, and we do not use it for advertising.</p>
        </Section>

        <Section title="4. Third-party services">
          <p>
            Booking a detail requires sharing limited information with a small number of trusted
            service providers who help us run our business:
          </p>
          <ul className="pl-5 my-3 space-y-1">
            <li>
              <strong className="text-platinum">Calendly</strong> &mdash; used to schedule your
              appointment. Your name and email are passed to Calendly to pre-fill the scheduler.
              Calendly&rsquo;s use of your information is governed by its own privacy policy.
            </li>
            <li>
              <strong className="text-platinum">Stripe</strong> &mdash; used to securely process
              booking deposits. Stripe handles your payment details directly; we never see or
              store your full card number. Stripe&rsquo;s use of your information is governed by
              its own privacy policy.
            </li>
          </ul>
          <p>
            These providers may set their own cookies or use their own tracking technologies when
            their scheduling or payment tools are loaded on our site. We don&rsquo;t control those
            technologies and encourage you to review each provider&rsquo;s privacy policy.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            Our website itself does not use analytics or advertising cookies. Embedded third-party
            tools (like the Calendly scheduler or Stripe checkout) may set their own cookies as
            described above.
          </p>
        </Section>

        <Section title="6. Data retention">
          <p>
            We retain booking information for as long as reasonably necessary to provide our
            services, maintain business records, and comply with legal and tax obligations. You
            can ask us to delete information we hold about you at any time by contacting us using
            the details below.
          </p>
        </Section>

        <Section title="7. Your privacy rights (California residents)">
          <p>
            If you&rsquo;re a California resident, you have rights under the California Consumer
            Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), including
            the right to know what personal information we&rsquo;ve collected about you, request
            deletion of your information, and not be discriminated against for exercising these
            rights. We do not sell or share personal information for cross-context behavioral
            advertising. To exercise any of these rights, contact us using the details below.
          </p>
        </Section>

        <Section title="8. Children's privacy">
          <p>
            Our services are not directed to children, and we do not knowingly collect personal
            information from anyone under 18.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. We&rsquo;ll update the effective
            date above when we do. Continued use of our website or services after changes are
            posted means you accept the updated policy.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            Questions about this Privacy Policy or your information? Reach us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-d underline">
              {CONTACT_EMAIL}
            </a>{' '}
            or by phone/text at{' '}
            <a href="tel:+14429991980" className="text-accent-d underline">
              (442) 999-1980
            </a>
            .
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="m-0 mb-3 font-sans font-semibold text-[19px] text-platinum">{title}</h2>
      {children}
    </section>
  );
}
