import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutCancelPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen theme-transition ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-950 text-zinc-50'}`}>
      <div className="mx-auto max-w-2xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/30'
          }`}>
            <XCircle className={`w-10 h-10 ${
              theme === 'light' ? 'text-orange-600' : 'text-orange-400'
            }`} />
          </div>
          <h1 className={`text-3xl font-bold mb-4 theme-transition ${
            theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
          }`}>
            Payment Cancelled
          </h1>
          <p className={`mb-8 theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
            Your payment was cancelled. No charges were made.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-colors ${
                theme === 'light'
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

