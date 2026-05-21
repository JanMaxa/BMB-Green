import { useEffect, useState } from 'react';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './NewsSection.module.css';
import { defaultNewsData, normalizeNewsData } from './newsData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function NewsSection({ className }) {
  const [newsData, setNewsData] = useState(defaultNewsData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setNewsData(normalizeNewsData(data)))
      .catch(() => {});
  }, []);

  return (
    <section className={cx(layout.section, className)}>
      <div className={layout.container}>
        <div className={layout.sectionHead}>
          <h2>Novinky a aktuální informace.</h2>
          <p>Přehled nejnovějších zpráv ze sítě BMB-Green.</p>
        </div>
        <div className={styles.grid}>
          {newsData.items.map((item, index) => (
            <article key={index} className={styles.card}>
              {item.imageUrl && (
                <div className={styles.cardImage}>
                  <img src={item.imageUrl} alt={item.title} />
                </div>
              )}
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  {item.tag && <span className={styles.cardTag}>{item.tag}</span>}
                  {item.date && <span className={styles.cardDate}>{item.date}</span>}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
