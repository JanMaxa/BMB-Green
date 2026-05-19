import Button from '../Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './Navbar.module.css';

export default function Navbar({ currentPath = '/', onNavigate }) {
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
    onNavigate?.(path);
  };

  return (
    <>
      <div className={styles.promoStrip}>
        <div className={cx(layout.container, styles.promoInner)}>
          <span className={styles.promoItem}>
            <img src="/assets/icons/bolt.svg" alt="" />
            <strong>Nejrychlejší Internet ve&nbsp;městě</strong>&nbsp;— až 220&nbsp;Mb/s
          </span>
          <span className={styles.promoItem}>
            <img src="/assets/icons/clock.svg" alt="" />
            Instalace do&nbsp;<strong>2–3 pracovních dnů</strong>
          </span>
          <span className={styles.promoItem}>
            <img src="/assets/icons/building.svg" alt="" />
            Developerské projekty na&nbsp;klíč
          </span>
          <span className={styles.promoSpacer}>
            <span className={styles.promoDot}></span>
            Tradice od&nbsp;roku 1991
          </span>
        </div>
      </div>

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
        </div>
      </header>
    </>
  );
}
