import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Template configuration - map template IDs to Stripe product/price IDs
// You'll need to create these in your Stripe dashboard
const TEMPLATE_CONFIG: Record<string, { priceId: string; downloadPath: string }> = {
  '1': {
    priceId: process.env.STRIPE_PRICE_ID_TEMPLATE_1 || 'price_xxxxx',
    downloadPath: '/templates/modern-portfolio-pro.zip',
  },
  '2': {
    priceId: process.env.STRIPE_PRICE_ID_TEMPLATE_2 || 'price_xxxxx',
    downloadPath: '/templates/ecommerce-dashboard.zip',
  },
  '3': {
    priceId: process.env.STRIPE_PRICE_ID_TEMPLATE_3 || 'price_xxxxx',
    downloadPath: '/templates/landing-page-starter.zip',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return res.status(500).json({ error: 'Stripe configuration error: Secret key not found' });
    }

    const { templateId, successUrl, cancelUrl } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const templateConfig = TEMPLATE_CONFIG[templateId];
    if (!templateConfig) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Check if price ID is configured
    if (!templateConfig.priceId || templateConfig.priceId === 'price_xxxxx') {
      console.error(`Price ID not configured for template ${templateId}`);
      return res.status(500).json({ error: 'Template price not configured. Please set STRIPE_PRICE_ID_TEMPLATE_1 in environment variables.' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: templateConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/checkout/cancel`,
      metadata: {
        templateId,
        downloadPath: templateConfig.downloadPath,
      },
      // Enable automatic tax calculation if needed
      // automatic_tax: { enabled: true },
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

