import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GoatedPersonalSite from './components/goated_personal_website_react_tailwind';
import SkyGridPage from './pages/SkyGridPage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/skygrid" element={<SkyGridPage />} />
          <Route path="/*" element={<GoatedPersonalSite />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
