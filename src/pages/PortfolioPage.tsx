import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Download, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

// Template type definition
interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  previewUrl?: string;
  tags: string[];
  featured?: boolean;
}

// Sample templates - replace with your actual templates
const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Modern Portfolio Pro',
    description: 'Modern portfolio template with command palette navigation, theme switching, and smooth animations. Built with React, Tailwind CSS, and Framer Motion. Fully responsive and production-ready.',
    category: 'Portfolio',
    price: 49.00,
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Command Palette', 'Theme Toggle'],
    featured: true,
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Complete e-commerce dashboard with analytics, order management, and inventory tracking.',
    category: 'Dashboard',
    price: 49.99,
    tags: ['React', 'TypeScript', 'Charts'],
    featured: true,
  },
  {
    id: '3',
    title: 'Landing Page Starter',
    description: 'High-converting landing page template with A/B testing capabilities and analytics integration.',
    category: 'Landing Page',
    price: 24.99,
    tags: ['Next.js', 'Analytics', 'SEO'],
  },
];

export default function PortfolioPage() {
  const { theme } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Portfolio – Templates by Adam Nassef';
    setIsVisible(true);

    return () => {
      document.title = 'Adam Nassef Personal Portfolio Website';
    };
  }, []);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handlePurchase = async (template: Template) => {
    try {
      // Show loading state (you could add a loading spinner here)
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/checkout/cancel`;

      // Call API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          successUrl,
          cancelUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error initiating purchase:', error);
      alert(`Error: ${error.message || 'Failed to start checkout. Please try again.'}`);
    }
  };

  const handlePreview = (template: Template) => {
    if (template.previewUrl) {
      window.open(template.previewUrl, '_blank');
    }
  };

  return (
    <>
      {!isVisible && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center theme-transition ${
          theme === 'light' ? 'bg-white' : 'bg-zinc-950'
        }`}>
          <div className={`font-mono text-sm uppercase tracking-widest theme-transition ${
            theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            Loading...
          </div>
        </div>
      )}
      <div className={`min-h-screen theme-transition transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : isVisible ? 'opacity-100' : 'opacity-0'
      } ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-950 text-zinc-50'}`}>
        {/* Header */}
        <div className={`sticky top-0 z-40 border-b backdrop-blur-sm theme-transition ${
          theme === 'light' 
            ? 'border-slate-200 bg-white/80' 
            : 'border-zinc-800 bg-zinc-950/80'
        }`}>
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className={`text-2xl font-bold transition-colors ${
                  theme === 'light' ? 'text-slate-900 hover:text-slate-700' : 'text-zinc-100 hover:text-white'
                }`}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400">
                  Adam Nassef
                </span>
              </Link>
              <button
                onClick={handleBackClick}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                  theme === 'light'
                    ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Site</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-12">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 theme-transition ${
                  theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`} />
                <span className={`text-sm font-medium uppercase tracking-wider theme-transition ${
                  theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`}>
                  Premium Templates
                </span>
              </div>
              <h1 className={`text-5xl font-bold mb-4 theme-transition ${
                theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
              }`}>
                Templates & <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400">Resources</span>
              </h1>
              <p className={`text-lg max-w-2xl mx-auto theme-transition ${
                theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
              }`}>
                High-quality templates and resources built with modern technologies. 
                Ready to use, fully customizable, and production-ready.
              </p>
            </motion.div>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {TEMPLATES.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative rounded-2xl border overflow-hidden transition-all ${
                  theme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:shadow-xl'
                }`}
              >
                {template.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      theme === 'light'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                    }`}>
                      Featured
                    </span>
                  </div>
                )}

                {/* Template Image Placeholder */}
                <div className={`aspect-video bg-gradient-to-br ${
                  theme === 'light'
                    ? 'from-slate-200 to-slate-300'
                    : 'from-zinc-800 to-zinc-900'
                } flex items-center justify-center`}>
                  {template.image ? (
                    <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`text-4xl font-bold theme-transition ${
                      theme === 'light' ? 'text-slate-400' : 'text-zinc-600'
                    }`}>
                      {template.title.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className={`text-xs font-medium uppercase tracking-wider theme-transition ${
                      theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 theme-transition ${
                    theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
                  }`}>
                    {template.title}
                  </h3>
                  <p className={`text-sm mb-4 theme-transition ${
                    theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
                  }`}>
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs theme-transition ${
                          theme === 'light'
                            ? 'text-slate-600 border-slate-300 bg-slate-100'
                            : 'text-zinc-300 border-zinc-700 bg-zinc-800/50'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div className={`flex items-center justify-between pt-4 border-t theme-transition ${
                    theme === 'light' ? 'border-slate-200' : 'border-zinc-800'
                  }`}>
                    <div>
                      <span className={`text-2xl font-bold theme-transition ${
                        theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
                      }`}>
                        ${template.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.previewUrl && (
                        <button
                          onClick={() => handlePreview(template)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                            theme === 'light'
                              ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                      <button
                        onClick={() => handlePurchase(template)}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-white text-zinc-900 hover:bg-zinc-100'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className={`text-center py-12 rounded-2xl border theme-transition ${
            theme === 'light'
              ? 'border-slate-200 bg-slate-50'
              : 'border-zinc-800 bg-zinc-900/40'
          }`}>
            <h2 className={`text-2xl font-semibold mb-2 theme-transition ${
              theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
            }`}>
              More Templates Coming Soon
            </h2>
            <p className={`theme-transition ${
              theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              New templates and resources are added regularly. Check back soon!
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className={`border-t py-8 mt-16 theme-transition ${
          theme === 'light' ? 'border-slate-200 bg-white' : 'border-zinc-800 bg-zinc-950'
        }`}>
          <div className="mx-auto max-w-7xl px-6">
            <p className={`text-center text-sm theme-transition ${
              theme === 'light' ? 'text-slate-500' : 'text-zinc-500'
            }`}>
              © {new Date().getFullYear()} Adam Nassef. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

