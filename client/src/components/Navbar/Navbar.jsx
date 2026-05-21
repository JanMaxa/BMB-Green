import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './Navbar.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';
const STATUS_LABELS = {
  warning: 'Upozornění',
  error: 'Výpadek',
};

export default function Navbar({ currentPath = '/', onNavigate }) {
  const [locationsData, setLocationsData] = useState(null);
  const [dismissedAlertPath, setDismissedAlertPath] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const items = [
    { label: 'Balíčky', path: '/balicky' },
    { label: 'Internet', path: '/internet' },
    { label: 'Televize', path: '/televize' },
    { label: 'Pro zákazníky', path: '/pro-zakazniky' },
    { label: 'Kontakty', path: '/kontakty' },
  ];

  const handleRouteClick = (event, path) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setIsMenuOpen(false);
    onNavigate?.(path);
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/api/locations`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!ignore && data) setLocationsData(data);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const alertItems = useMemo(() => {
    if (!locationsData?.locations) return [];

    return locationsData.locations
      .filter((location) => location.status === 'warning' || location.status === 'error')
      .map((location) => {
        const status = STATUS_LABELS[location.status];
        const name = location.label || location.address || 'lokace';
        const message = location.statusMessage?.trim() || 'Aktuální omezení služby.';

        return {
          id: `${location.status}-${name}-${message}`,
          status: location.status,
          prefix: `${status} (${name}):`,
          message,
        };
      });
  }, [locationsData]);

  const alertSeverity = alertItems.some((item) => item.status === 'error') ? 'error' : 'warning';
  const isAlertDismissed = dismissedAlertPath === currentPath;

  return (
    <div className={styles.navShell}>
      {alertItems.length > 0 && !isAlertDismissed && (
        <NetworkAlertBar
          items={alertItems}
          severity={alertSeverity}
          onMoreInfoClick={(event) => handleRouteClick(event, '/pro-zakazniky')}
          onDismiss={() => setDismissedAlertPath(currentPath)}
        />
      )}

      <header className={styles.topnav}>
        <div className={cx(layout.container, styles.topnavInner)}>
          <a href="/" aria-label="BMB-Green domů" onClick={(event) => handleRouteClick(event, '/')}>
            <img className={styles.logo} src="/assets/logo.svg" alt="BMB-Green" />
          </a>
          <nav className={styles.topnavLinks} aria-label="Hlavní navigace">
            {items.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={currentPath === item.path ? styles.active : undefined}
                onClick={(event) => handleRouteClick(event, item.path)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className={styles.topnavCta}>
            <Button as="a" href="/kontakty" onClick={(event) => handleRouteClick(event, '/kontakty')}>
              Nezávazná poptávka
              <img src="/assets/icons/arrow-right.svg" alt="" />
            </Button>
          </div>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label="Otevřít navigaci"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen(true)}
          >
            <img src="/assets/icons/menu.svg" alt="" />
          </button>
        </div>
      </header>

      <div className={cx(styles.mobileMenu, isMenuOpen && styles.mobileMenuOpen)}>
        <button
          className={styles.mobileMenuBackdrop}
          type="button"
          aria-label="Zavřít navigaci"
          onClick={() => setIsMenuOpen(false)}
        />
        <aside className={styles.mobileMenuPanel} id="mobile-navigation" aria-label="Mobilní navigace">
          <div className={styles.mobileMenuHeader}>
            <a href="/" aria-label="BMB-Green domů" onClick={(event) => handleRouteClick(event, '/')}>
              <img className={styles.mobileMenuLogo} src="/assets/logo.svg" alt="BMB-Green" />
            </a>
            <button
              className={styles.mobileMenuClose}
              type="button"
              aria-label="Zavřít navigaci"
              onClick={() => setIsMenuOpen(false)}
            >
              <img src="/assets/icons/x.svg" alt="" />
            </button>
          </div>
          <nav className={styles.mobileMenuLinks} aria-label="Mobilní navigace">
            {items.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={currentPath === item.path ? styles.mobileMenuActive : undefined}
                onClick={(event) => handleRouteClick(event, item.path)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className={styles.mobileMenuCta}>
            <Button as="a" href="/kontakty" block onClick={(event) => handleRouteClick(event, '/kontakty')}>
              Nezávazná poptávka
              <img src="/assets/icons/arrow-right.svg" alt="" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NetworkAlertBar({ items, severity, onMoreInfoClick, onDismiss }) {
  const groupRef = useRef(null);
  const [duration, setDuration] = useState(36);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return undefined;

    const updateDuration = () => {
      setDuration(Math.max(25, group.scrollWidth / 26));
    };

    updateDuration();

    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateDuration);
      return () => window.removeEventListener('resize', updateDuration);
    }

    const observer = new ResizeObserver(updateDuration);
    observer.observe(group);

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className={cx(styles.alertBar, severity === 'error' ? styles.alertError : styles.alertWarning)}>
      <div className={cx(layout.container, styles.alertInner)}>
        <div className={styles.alertViewport}>
          <div className={styles.alertTrack} style={{ '--alert-duration': `${duration}s` }}>
            <AlertMessageGroup items={items} groupRef={groupRef} />
            <AlertMessageGroup items={items} ariaHidden />
          </div>
        </div>
        <a className={styles.alertLink} href="/pro-zakazniky" onClick={onMoreInfoClick}>
          Více informací
        </a>
        <button className={styles.alertClose} type="button" onClick={onDismiss}>
          Zavřít upozornění
        </button>
      </div>
    </div>
  );
}

function AlertMessageGroup({ items, groupRef, ariaHidden = false }) {
  return (
    <span className={styles.alertGroup} ref={groupRef} aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <span className={styles.alertMessage} key={item.id}>
          <span className={cx(styles.alertPrefix, item.status === 'error' ? styles.alertPrefixError : styles.alertPrefixWarning)}>
            {item.prefix}
          </span>{' '}
          <span>{item.message}</span>
        </span>
      ))}
    </span>
  );
}
