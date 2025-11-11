import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Map template IDs to their download file paths
const TEMPLATE_DOWNLOADS: Record<string, string> = {
  '1': '/templates/modern-portfolio-pro.zip',
  '2': '/templates/ecommerce-dashboard.zip',
  '3': '/templates/landing-page-starter.zip',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id, template_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Verify the checkout session was successful
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(403).json({ error: 'Payment not completed' });
    }

    // Get template ID from session metadata or query param
    const templateId = template_id as string || session.metadata?.templateId;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const downloadPath = TEMPLATE_DOWNLOADS[templateId] || session.metadata?.downloadPath;
    
    if (!downloadPath) {
      return res.status(404).json({ error: 'Download not found' });
    }

    // Option 1: Redirect to the file (if it's publicly accessible)
    // return res.redirect(302, downloadPath);

    // Option 2: Generate a signed URL (if using S3 or similar)
    // const signedUrl = await generateSignedUrl(downloadPath);
    // return res.redirect(302, signedUrl);

    // Option 3: Stream the file directly (for files in public folder)
    // For Vercel, you can serve files from the public directory
    // This is a simple approach - for production, consider using signed URLs
    
    // Return download information
    return res.status(200).json({
      downloadUrl: downloadPath,
      templateId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  } catch (error: any) {
    console.error('Error processing download:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

