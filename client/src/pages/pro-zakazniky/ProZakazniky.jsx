import { useEffect, useRef, useState } from 'react';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import CoverageSection from '../../components/CoverageSection/CoverageSection.jsx';
import Faq from '../../components/Faq/Faq.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './ProZakazniky.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';
const NEWS_TITLE = 'Co je nového u nás.';
const NEWS_DESCRIPTION = 'Krátké zprávy ze stavby sítě, z nabídky a z dotačních programů.';
const NEWS_UNAVAILABLE_TITLE = 'Novinky nejsou momentálně dostupné.';
const NEWS_UNAVAILABLE_DESCRIPTION = 'Aktuální informace se teď nepodařilo načíst. Pro ověření dostupnosti služeb nebo dotaz na provoz sítě nás prosím kontaktujte.';

export default function ProZakazniky() {
  const newsRef = useRef(null);
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setNewsData(data))
      .catch(() => {});
  }, []);

  const scrollNews = (direction) => {
    newsRef.current?.scrollBy({
      left: direction * 360,
      behavior: 'smooth',
    });
  };

  if (!newsData) {
    return (
      <>
        <section className={cx(layout.section, layout.sectionAlt)}>
          <div className={layout.container}>
            <div className={layout.sectionHead}>
              <h2>{NEWS_UNAVAILABLE_TITLE}</h2>
              <p>{NEWS_UNAVAILABLE_DESCRIPTION}</p>
            </div>
          </div>
        </section>
        <ContactCta />
      </>
    );
  }

  const visibleNews = newsData.items.filter((item) => item.visible !== false);

  return (
    <>
      <CoverageSection />

      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={layout.container}>
          <div className={cx(layout.sectionHead, styles.newsHead)}>
            <h2>{NEWS_TITLE}</h2>
            <p>{NEWS_DESCRIPTION}</p>
          </div>

          <div className={styles.newsCarousel}>
            <div className={styles.newsControls} aria-label="Posunout novinky">
              <button type="button" aria-label="Předchozí novinky" onClick={() => scrollNews(-1)}>
                <img src="/assets/icons/chevron-right.svg" alt="" />
              </button>
              <button type="button" aria-label="Další novinky" onClick={() => scrollNews(1)}>
                <img src="/assets/icons/chevron-right.svg" alt="" />
              </button>
            </div>
            <div className={styles.newsScroll} ref={newsRef}>
              {visibleNews.map((n, index) => (
                <article key={`${n.title}-${index}`} className={styles.newsCard}>
                  <div className={styles.newsImage}>
                    <ImagePlaceholder icon={n.icon} label="Náhledový obrázek" fill />
                  </div>
                  <div className={styles.newsBody}>
                    <div className={styles.newsMeta}>{n.tag} · {n.date}</div>
                    <div className={styles.newsTitle}>{n.title}</div>
                    <div className={styles.newsDescription}>{n.desc}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Faq />
      <ContactCta />
    </>
  );
}
