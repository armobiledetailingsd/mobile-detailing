import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/sections/BookingFlow';
import { getSiteSettings } from '@/lib/sanity/queries/global';

export const metadata: Metadata = {
  title: 'Book Your Detail',
  description:
    'Check your ZIP, pick a time, and reserve your mobile detail with a deposit.',
};

export default async function BookPage() {
  const settings = await getSiteSettings();
  if (!settings?.calendlyUrl || !settings?.stripeDepositLink) notFound();

  return (
    <main className="min-h-screen bg-ink1 px-6 py-16">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Book your detail
        </h1>
        <p className="m-0 mb-8 text-[16px] text-steel">
          Three quick steps: your info, a time that works, and a deposit to lock it in.
        </p>
        <BookingFlow
          calendlyUrl={settings.calendlyUrl}
          stripeDepositLink={settings.stripeDepositLink}
        />
      </div>
    </main>
  );
}
