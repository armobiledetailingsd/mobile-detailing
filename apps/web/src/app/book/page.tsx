import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/sections/BookingFlow';
import { resolvePackageSlug } from '@/lib/booking/packages';
import { getSiteSettings } from '@/lib/sanity/queries/global';

export const metadata: Metadata = {
  title: 'Book Your Detail',
  description:
    'Pick a package, check your ZIP, choose a time, and reserve your mobile detail with a deposit.',
};

type BookPageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);

  if (
    !settings?.stripeDepositLink ||
    (!settings?.calendlyUrlBronze && !settings?.calendlyUrlSilver && !settings?.calendlyUrlGold)
  ) {
    notFound();
  }

  // Invalid or missing ?package= values fall back to the in-flow picker.
  const initialPackage = resolvePackageSlug(params.package) ?? undefined;

  return (
    <main className="min-h-screen bg-ink1 px-6 py-16">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Book your detail
        </h1>
        <p className="m-0 mb-8 text-[16px] text-steel">
          Four quick steps: your package, your info, a time that works, and a deposit to lock it in.
        </p>
        <BookingFlow
          calendlyUrls={{
            bronze: settings.calendlyUrlBronze ?? undefined,
            silver: settings.calendlyUrlSilver ?? undefined,
            gold: settings.calendlyUrlGold ?? undefined,
          }}
          stripeDepositLink={settings.stripeDepositLink}
          initialPackage={initialPackage}
        />
      </div>
    </main>
  );
}
