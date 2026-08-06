import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { message: 'Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET' },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[stripe] deposit paid', {
        email: session.customer_details?.email,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentLinkId: session.payment_link,
      });
      break;
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[stripe] deposit payment failed', {
        email: session.customer_details?.email,
        paymentLinkId: session.payment_link,
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
