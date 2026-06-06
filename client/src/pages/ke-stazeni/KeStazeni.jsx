import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import KeStazeniContent from './KeStazeniContent.jsx';
import { defaultKeStazeniData, normalizeKeStazeniData } from './keStazeniData.js';
import styles from './KeStazeni.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function KeStazeni() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/documents`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => setData(normalizeKeStazeniData(json)))
      .catch(() => setData({ ...defaultKeStazeniData, items: [] }));
  }, []);

  return (
    <>
      <section className={cx(layout.topSection, layout.topGradient)}>
        <div className={layout.container}>
          {data === null ? (
            <div className={styles.list}>
              <p className={styles.loading}>Načítám dokumenty…</p>
            </div>
          ) : (
            <KeStazeniContent data={data} />
          )}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
