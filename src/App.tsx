import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import GoatedPersonalSite from './components/goated_personal_website_react_tailwind';
import SkyGridPage from './pages/SkyGridPage';
import PortfolioPage from './pages/PortfolioPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/skygrid" element={<SkyGridPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="/*" element={<GoatedPersonalSite />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
