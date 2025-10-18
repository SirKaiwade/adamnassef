import GoatedPersonalSite from './components/goated_personal_website_react_tailwind';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <GoatedPersonalSite />
    </ThemeProvider>
  );
}

export default App;
