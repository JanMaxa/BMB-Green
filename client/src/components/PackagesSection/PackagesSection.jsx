import { useEffect, useState } from 'react';
import Button from '../Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './PackagesSection.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function PackagesSection() {
  const [balickyData, setBalickyData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/balicky`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setBalickyData(data))
      .catch(() => {});
  }, []);

  if (!balickyData) return null;

  const packages = balickyData.bundles.filter((p) => p.visible !== false);
  const section = balickyData.bundleSection;

  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <div className={layout.sectionHead}>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <div className={styles.packageGrid}>
          {packages.map((p, index) => (
            <div key={`${p.name}-${index}`} className={cx(styles.packageCard, p.featured && styles.featured)}>
              {p.featured && <span className={styles.badge}>{section.featuredBadge}</span>}
              <div className={styles.name}>{p.name}</div>
              <div className={styles.speed}>{p.internet}</div>
              <div className={styles.price}>
                <span className={styles.priceValue}>{p.price}</span>
                <span className={styles.priceUnit}>{section.priceUnit}</span>
              </div>
              <ul className={styles.features}>
                {p.features.map((feature) => (
                  <li key={feature}><img src="/assets/icons/check.svg" alt="" />{feature}</li>
                ))}
              </ul>
              <Button className={styles.cta} variant={p.featured ? 'primary' : 'secondary'} block>
                {section.ctaLabel}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
