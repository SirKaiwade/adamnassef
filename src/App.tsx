import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GoatedPersonalSite from './components/goated_personal_website_react_tailwind';
import SkyGridPage from './pages/SkyGridPage';
import PortfolioPage from './pages/PortfolioPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/skygrid" element={<SkyGridPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/*" element={<GoatedPersonalSite />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
