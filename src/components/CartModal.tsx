import { useState, useEffect } from 'react';
import { X, ShoppingCart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51SSQaLCjV6o8yTfONVDXOsgE7ga5ynmRt4rRdutRKZbU3JRUND3XQ8Xwrxt4BR2yMmzB9RUNRmMox6qwoCDGTcTs00NalWwRWg');

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CheckoutForm({ clientSecret, onSuccess, onError }: { clientSecret: string; onSuccess: () => void; onError: (error: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (error) {
      onError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      clearCart();
      onSuccess();
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          theme === 'light'
            ? 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400'
            : 'bg-white text-zinc-900 hover:bg-zinc-100 disabled:bg-zinc-600'
        }`}
      >
        {isProcessing ? 'Processing...' : `Pay $${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, total } = useCart();
  const { theme } = useTheme();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCheckout(false);
      setClientSecret(null);
      setPaymentError(null);
      setIsLoadingPayment(false);
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    setPaymentError(null);
    setIsLoadingPayment(true);
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.id, price: item.price })),
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
      } else {
        setPaymentError(data.error || 'Failed to initialize payment');
      }
    } catch (error: any) {
      setPaymentError(error.message || 'Failed to create payment');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    onClose();
    // Redirect to success page
    window.location.href = '/checkout/success';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${theme === 'light' ? 'bg-black/50' : 'bg-black/70'}`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl ${
            theme === 'light'
              ? 'border-slate-200 bg-white'
              : 'border-zinc-800 bg-zinc-950'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'light' ? 'border-slate-200' : 'border-zinc-800'
          }`}>
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>
              {showCheckout ? 'Checkout' : 'Shopping Cart'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'hover:bg-slate-100 text-slate-600'
                  : 'hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${theme === 'light' ? 'text-slate-300' : 'text-zinc-700'}`} />
                <p className={`text-lg ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Your cart is empty
                </p>
              </div>
            ) : showCheckout && clientSecret ? (
              <div>
                {paymentError && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    theme === 'light' ? 'bg-red-50 text-red-800' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {paymentError}
                  </div>
                )}
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: theme === 'dark' ? 'night' : 'stripe',
                      variables: {
                        colorPrimary: theme === 'dark' ? '#ffffff' : '#0f172a',
                        colorBackground: theme === 'dark' ? '#09090b' : '#ffffff',
                        colorText: theme === 'dark' ? '#fafafa' : '#0f172a',
                        colorDanger: '#ef4444',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        borderRadius: '0.5rem',
                      },
                    },
                  }}
                >
                  <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} onError={setPaymentError} />
                </Elements>
              </div>
            ) : isLoadingPayment ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className={`w-8 h-8 animate-spin ${theme === 'light' ? 'text-slate-400' : 'text-zinc-600'}`} />
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      theme === 'light'
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-zinc-800 bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                        {item.description.substring(0, 60)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'light'
                            ? 'hover:bg-slate-200 text-slate-600'
                            : 'hover:bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showCheckout && items.length > 0 && (
            <div className={`p-6 border-t ${
              theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-zinc-800 bg-zinc-900/40'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>
                  Total:
                </span>
                <span className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoadingPayment}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100 disabled:bg-zinc-600'
                }`}
              >
                {isLoadingPayment ? 'Loading...' : 'Proceed to Checkout'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

