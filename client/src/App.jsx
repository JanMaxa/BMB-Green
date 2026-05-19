import { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Landing from './pages/home/Landing.jsx';
import Balicky from './pages/balicky/Balicky.jsx';
import Internet from './pages/internet/Internet.jsx';
import Televize from './pages/televize/Televize.jsx';
import ProZakazniky from './pages/pro-zakazniky/ProZakazniky.jsx';
import Kontakty from './pages/kontakty/Kontakty.jsx';
import Admin from './pages/admin/Admin.jsx';

const routes = {
  '/': Landing,
  '/balicky': Balicky,
  '/internet': Internet,
  '/televize': Televize,
  '/pro-zakazniky': ProZakazniky,
  '/kontakty': Kontakty,
  '/admin': Admin,
};

const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const Page = routes[path] || Landing;

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    if (path !== to) {
      window.history.pushState({}, '', to);
      setPath(to);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {path !== '/admin' && <Navbar currentPath={path} onNavigate={navigate} />}
      <main>
        <Page />
      </main>
      {path !== '/admin' && <Footer onNavigate={navigate} />}
    </>
  );
}
