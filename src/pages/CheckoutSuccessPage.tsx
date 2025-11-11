import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutSuccessPage() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    // Fetch download URL from API
    const fetchDownload = async () => {
      try {
        const response = await fetch(`/api/download?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get download');
        }

        setDownloadUrl(data.downloadUrl);
      } catch (err: any) {
        console.error('Error fetching download:', err);
        setError(err.message || 'Failed to retrieve download');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownload();
  }, [sessionId]);

  const handleDownload = () => {
    if (downloadUrl) {
      // Open download in new tab or trigger download
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className={`min-h-screen theme-transition ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-950 text-zinc-50'}`}>
      <div className="mx-auto max-w-2xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {isLoading ? (
            <>
              <Loader2 className={`w-16 h-16 mx-auto mb-4 animate-spin theme-transition ${
                theme === 'light' ? 'text-slate-400' : 'text-zinc-600'
              }`} />
              <h1 className={`text-3xl font-bold mb-4 theme-transition ${
                theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
              }`}>
                Processing your purchase...
              </h1>
              <p className={`theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                Please wait while we verify your payment.
              </p>
            </>
          ) : error ? (
            <>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-red-100' : 'bg-red-900/30'
              }`}>
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className={`text-3xl font-bold mb-4 theme-transition ${
                theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
              }`}>
                Something went wrong
              </h1>
              <p className={`mb-8 theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                {error}
              </p>
              <Link
                to="/portfolio"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'
              }`}>
                <CheckCircle className={`w-10 h-10 ${
                  theme === 'light' ? 'text-green-600' : 'text-green-400'
                }`} />
              </div>
              <h1 className={`text-3xl font-bold mb-4 theme-transition ${
                theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
              }`}>
                Payment Successful!
              </h1>
              <p className={`mb-8 theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                Thank you for your purchase. Your template is ready to download.
              </p>
              
              {downloadUrl && (
                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    Download Template
                  </button>
                  
                  <div className={`mt-4 p-4 rounded-lg border theme-transition ${
                    theme === 'light'
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-zinc-800 bg-zinc-900/40'
                  }`}>
                    <p className={`text-sm theme-transition ${
                      theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
                    }`}>
                      <strong>Note:</strong> This download link will expire in 24 hours. 
                      If you need to download again, please contact support.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/portfolio"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-colors ${
                    theme === 'light'
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Portfolio
                </Link>
                <Link
                  to="/"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-colors ${
                    theme === 'light'
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  Go Home
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

