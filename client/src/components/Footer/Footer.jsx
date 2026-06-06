import { useEffect, useState } from 'react';
import layout from '../../styles/layout.module.css';
import { defaultContactData, normalizeContactData } from '../../utils/contactData.js';
import styles from './Footer.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();
  const [contacts, setContacts] = useState(defaultContactData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contacts`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json) setContacts(normalizeContactData(json));
      })
      .catch(() => {});
  }, []);

  const handleRouteClick = (event, path) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate?.(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={layout.container}>
        <div className={styles.footerGrid}>
          <div>
            <img className={styles.logo} src="/assets/logo-on-dark.svg" alt="BMB-Green" />
            <p className={styles.footerBlurb}>
              Rychlý internet, digitální televize a&nbsp;pevná linka pro domácnosti
              i&nbsp;firmy v&nbsp;Praze a&nbsp;okolí. Česká firma s&nbsp;vlastním týmem techniků. Od&nbsp;roku 1991.
            </p>
          </div>
          <div>
            <h4>Navigace</h4>
            <ul>
              <li><a href="/balicky" onClick={(event) => handleRouteClick(event, '/balicky')}>Balíčky</a></li>
              <li><a href="/internet" onClick={(event) => handleRouteClick(event, '/internet')}>Internet</a></li>
              <li><a href="/televize" onClick={(event) => handleRouteClick(event, '/televize')}>Televize</a></li>
              <li><a href="/volani" onClick={(event) => handleRouteClick(event, '/volani')}>Volání</a></li>
              <li><a href="/pro-zakazniky" onClick={(event) => handleRouteClick(event, '/pro-zakazniky')}>Pro zákazníky</a></li>
              <li><a href="/kontakty" onClick={(event) => handleRouteClick(event, '/kontakty')}>Kontakty</a></li>
              <li><a href="/ke-stazeni" onClick={(event) => handleRouteClick(event, '/ke-stazeni')}>Ke stažení</a></li>
            </ul>
          </div>
          <div>
            <h4>Kontakty</h4>
            <ul className={styles.footerContact}>
              <li>
                <span>Telefon</span>
                <span>
                  {contacts.telefon.split('\n').filter(Boolean).map((num, i) => (
                    <a key={i} style={{ display: 'block' }} href={`tel:${num.replace(/\s+/g, '')}`}>{num.trim()}</a>
                  ))}
                </span>
              </li>
              <li>
                <span>Kancelář</span>
                <strong style={{ whiteSpace: 'pre-line', display: 'block' }}>{contacts.kancelar}</strong>
              </li>
              <li>
                <span>E-mail</span>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Právní údaje</h4>
            <ul className={styles.footerContact}>
              <li>
                <span>Sídlo</span>
                <strong style={{ whiteSpace: 'pre-line', display: 'block' }}>{contacts.sidlo}</strong>
              </li>
              <li>
                <span>IČO</span>
                <strong>{contacts.ico}</strong>
              </li>
              <li>
                <span>DIČ</span>
                <strong>{contacts.dic}</strong>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>© 1991–{currentYear} BMB-Green s.r.o.</div>
          <div>Vytvořeno: <a href="https://newside.cz" target="_blank" rel="noreferrer">newside.cz</a></div>
        </div>
      </div>
    </footer>
  );
}
