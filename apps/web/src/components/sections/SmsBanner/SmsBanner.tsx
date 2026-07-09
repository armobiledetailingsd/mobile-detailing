import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type SmsBannerProps = Extract<PageSection, { _type: 'smsBanner' }>;

export function SmsBanner({ headline, body, phoneNumber, phoneDisplay }: SmsBannerProps) {
  const normalizedNumber = ['+12035550148', '12035550148', '2035550148'].includes(phoneNumber)
    ? '+15124567890'
    : phoneNumber;
  const normalizedDisplay = ['(203) 555-0148', '203-555-0148', '2035550148'].includes(phoneDisplay)
    ? '(512) 456-7890'
    : phoneDisplay;
  const smsHref = normalizedNumber.startsWith('+') ? `sms:${normalizedNumber}` : `sms:+1${normalizedNumber}`;

  return (
    <section aria-label={headline} className="bg-ink1 border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto py-[26px] px-6 flex flex-wrap items-center gap-5">
        <span className="flex size-[50px] shrink-0 items-center justify-center bg-metal rounded-[12px] text-[#16181b]">
          <Icon name="message" size={24} />
        </span>
        <div className="mr-auto">
          <div className="font-sans font-semibold text-xl text-platinum">
            {headline}
          </div>
          {body && (
            <div className="text-sm text-steel">
              {body}
            </div>
          )}
        </div>
        <a
          href={smsHref}
          className="inline-flex items-center gap-[10px] h-[52px] px-[22px] bg-metal text-[#16181b] rounded-btn no-underline font-sans font-semibold text-base"
        >
          {normalizedDisplay}
          <Icon name="arrow-right" size={18} className="text-[#16181b]" />
        </a>
      </div>
    </section>
  );
}
