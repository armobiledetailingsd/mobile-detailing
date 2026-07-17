import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern booking and using mobile detailing services from Alex Detailing.',
};

const EFFECTIVE_DATE = 'July 16, 2026';
const CONTACT_EMAIL = '[CONTACT_EMAIL]';

export default function TermsPage() {
  return (
    <main className="bg-ink1 px-6 py-16">
      <article className="mx-auto w-full max-w-[720px] text-[15px] leading-[1.7] text-silver">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Terms of Service
        </h1>
        <p className="m-0 mb-10 text-[14px] text-muted">Effective date: {EFFECTIVE_DATE}</p>

        <Section title="1. Agreement to terms">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Alex Detailing
            website and your booking of mobile detailing services from Alex Detailing (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By booking a service or using our website, you
            agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use our site or book
            a service.
          </p>
        </Section>

        <Section title="2. Our services">
          <p>
            We provide mobile vehicle detailing services performed at a location you specify,
            within our published service area in North County San Diego, California. Service
            packages, pricing, and estimated durations are described on our website and are
            subject to change. Final pricing may vary based on vehicle size, condition, and any
            add-ons selected at booking.
          </p>
        </Section>

        <Section title="3. Booking and deposits">
          <p>
            Bookings are made by selecting a package, providing your contact information and ZIP
            code, choosing an appointment time through our scheduler, and paying a refundable
            deposit to reserve your appointment. Your deposit is applied to your total service
            cost at checkout.
          </p>
          <p>
            We only service the ZIP codes listed as part of our coverage area at the time of
            booking. If your address falls outside that area, we may be unable to complete your
            booking or may need to apply an additional travel fee, which will be disclosed before
            you confirm.
          </p>
        </Section>

        <Section title="4. Cancellations and rescheduling">
          <p>
            You may cancel or reschedule your appointment up to 24 hours before your scheduled
            start time for a full refund of your deposit. Cancellations made with less than 24
            hours&rsquo; notice, or appointments where we&rsquo;re unable to access the vehicle or
            complete the service due to circumstances within your control (for example, an
            inaccessible or unavailable vehicle), may forfeit the deposit.
          </p>
          <p>
            We&rsquo;ll do our best to accommodate schedule changes on our end, but weather,
            traffic, or prior appointments may occasionally require us to reschedule your
            appointment. We&rsquo;ll contact you as soon as possible if that happens.
          </p>
        </Section>

        <Section title="5. Payment">
          <p>
            Deposits and final payments are processed through Stripe. By paying a deposit, you
            authorize us to charge the payment method you provide for the deposit amount, and,
            where applicable, the remaining balance due at completion of service. We do not store
            your full payment card details.
          </p>
        </Section>

        <Section title="6. Your responsibilities">
          <p>When booking a service, you agree to:</p>
          <ul className="pl-5 my-3 space-y-1">
            <li>Provide accurate contact, address, and vehicle information</li>
            <li>Ensure the vehicle is accessible at the agreed time and location</li>
            <li>Remove personal belongings and valuables from the vehicle before service</li>
            <li>Disclose any known pre-existing damage, mechanical issues, or unusual conditions</li>
          </ul>
        </Section>

        <Section title="7. Vehicle condition and liability">
          <p>
            We take care to protect your vehicle&rsquo;s interior and exterior while performing
            our services. However, we are not responsible for pre-existing damage, mechanical
            failures, or wear-related issues (such as aged paint, prior scratches, cracked
            trim, or deteriorated upholstery) that may become more visible or that may be affected
            during the detailing process. If you believe damage occurred as a direct result of our
            service, please notify us within 24 hours of your appointment so we can review the
            issue.
          </p>
          <p>
            To the fullest extent permitted by law, our liability for any claim arising from our
            services is limited to the amount you paid for the service giving rise to the claim.
          </p>
        </Section>

        <Section title="8. Website use">
          <p>
            You agree not to misuse our website, including attempting to interfere with its normal
            operation, submitting false booking information, or using it for any unlawful purpose.
          </p>
        </Section>

        <Section title="9. Changes to these terms">
          <p>
            We may update these Terms from time to time. We&rsquo;ll update the effective date
            above when we do. Continued use of our website or booking of services after changes
            are posted means you accept the updated Terms.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These Terms are governed by the laws of the State of California, without regard to
            conflict-of-law principles.
          </p>
        </Section>

        <Section title="11. Contact us">
          <p>
            Questions about these Terms? Reach us at{' '}
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
