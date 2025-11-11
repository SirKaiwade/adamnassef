import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// This endpoint handles Stripe webhooks for payment events
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    // For Vercel, the body is already parsed, but we need the raw body for signature verification
    // In production, Vercel provides the raw body in req.body
    // If using raw body middleware, adjust accordingly
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Payment was successful
        const templateId = session.metadata?.templateId;
        const customerEmail = session.customer_email || session.customer_details?.email;
        
        console.log(`Payment successful for template ${templateId} by ${customerEmail}`);
        
        // Here you could:
        // 1. Send a confirmation email with download link
        // 2. Store purchase in a database
        // 3. Grant access to download
        // 4. Send to analytics service
        
        // Example: Store purchase (you'd need a database for this)
        // await storePurchase({
        //   sessionId: session.id,
        //   templateId,
        //   customerEmail,
        //   amount: session.amount_total,
        //   timestamp: new Date(),
        // });
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

