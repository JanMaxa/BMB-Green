import { useEffect, useState } from 'react';
import Button from '../Button/Button.jsx';
import layout from '../../styles/layout.module.css';
import styles from './Faq.module.css';
import { defaultFaqData, normalizeFaqData } from './faqData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Faq() {
  const [data, setData] = useState(defaultFaqData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faq`)
      .then((r) => r.ok ? r.json() : null)
      .then((loaded) => loaded && setData(normalizeFaqData(loaded)))
      .catch(() => {});
  }, []);

  return (
    <section className={styles.faqSection}>
      <div className={layout.container}>
        <div className={styles.faqGrid}>
          <div className={styles.faqList}>
            {data.items.map((item, index) => (
              <details key={`${item.question}-${index}`} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <div className={styles.faqIntro}>
            <h2>Časté otázky</h2>
            <p>
              Nejčastější technické situace, které můžete zkusit vyřešit hned doma, než zavoláte podporu.
              Najdete tu první kroky při výpadku internetu, pomalém připojení, podezření na problém s routerem
              i potížích s televizí. O aktuálních problémech v síti a plánovaných pracích průběžně informujeme
              na stránce pro zákazníky.
            </p>
            <div className={styles.faqActions}>
              <Button as="a" href="/pro-zakazniky">
                Pro zákazníky
              </Button>
              <Button as="a" href="/kontakty" variant="secondary">
                Kontakty
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
