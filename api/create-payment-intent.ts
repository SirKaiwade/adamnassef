import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Map template IDs to Stripe price IDs
const TEMPLATE_PRICES: Record<string, string> = {
  '1': process.env.STRIPE_PRICE_ID_TEMPLATE_1 || 'price_xxxxx',
  '2': process.env.STRIPE_PRICE_ID_TEMPLATE_2 || 'price_xxxxx',
  '3': process.env.STRIPE_PRICE_ID_TEMPLATE_3 || 'price_xxxxx',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Calculate total amount
    const amount = Math.round(items.reduce((sum: number, item: { price: number }) => sum + item.price, 0) * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        items: JSON.stringify(items),
      },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

