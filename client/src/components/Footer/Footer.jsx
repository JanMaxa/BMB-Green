import layout from '../../styles/layout.module.css';
import styles from './Footer.module.css';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

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
              Česká technologická společnost. Stavíme rychlé sítě, instalujeme bezpečnostní
              a&nbsp;fotovoltaické systémy. Od&nbsp;roku 1991.
            </p>
          </div>
          <div>
            <h4>Navigace</h4>
            <ul>
              <li><a href="/balicky" onClick={(event) => handleRouteClick(event, '/balicky')}>Balíčky</a></li>
              <li><a href="/internet" onClick={(event) => handleRouteClick(event, '/internet')}>Internet</a></li>
              <li><a href="/televize" onClick={(event) => handleRouteClick(event, '/televize')}>Televize</a></li>
              <li><a href="/pro-zakazniky" onClick={(event) => handleRouteClick(event, '/pro-zakazniky')}>Pro zákazníky</a></li>
              <li><a href="/kontakty" onClick={(event) => handleRouteClick(event, '/kontakty')}>Kontakty</a></li>
            </ul>
          </div>
          <div>
            <h4>Kontakty</h4>
            <ul className={styles.footerContact}>
              <li><span>Telefon</span><a href="tel:+420266317129">+420&nbsp;266&nbsp;317&nbsp;129</a></li>
              <li><span>Kancelář</span><strong>Drahobejlova 1894/52, 190&nbsp;00 Praha&nbsp;9</strong></li>
              <li><span>E-mail</span><a href="mailto:smlouva@bmb-green.cz">smlouva@bmb-green.cz</a></li>
            </ul>
          </div>
          <div>
            <h4>Právní údaje</h4>
            <ul className={styles.footerContact}>
              <li><span>Sídlo</span><strong>Na Dračkách 843/24, 162&nbsp;00 Praha&nbsp;6</strong></li>
              <li><span>IČO</span><strong>24658391</strong></li>
              <li><span>DIČ</span><strong>CZ24658391</strong></li>
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
