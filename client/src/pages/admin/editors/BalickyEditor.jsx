import { useCallback, useEffect, useState } from 'react';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/balicky';

const emptyBundle = () => ({
  name: 'Nový balíček',
  internet: '',
  tv: '',
  hd: '',
  price: '',
  savings: '',
  features: [],
  featured: false,
  visible: true,
});

export default function BalickyEditor({ setHeaderAction }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Načítám obsah...');

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(loaded);
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    try {
      await saveAdminData(endpoint, data);
      setStatus('Uloženo.');
    } catch {
      setStatus('Uložení se nepodařilo.');
    }
  }, [data]);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={save} type="button">Uložit</button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [data, save, setHeaderAction, status]);

  if (!data) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  const updateSection = (key, value) => {
    setData({ ...data, bundleSection: { ...data.bundleSection, [key]: value } });
  };

  const updateBundle = (index, key, value) => {
    setData({
      ...data,
      bundles: data.bundles.map((bundle, i) => (i === index ? { ...bundle, [key]: value } : bundle)),
    });
  };

  const removeBundle = (index) => {
    setData({ ...data, bundles: data.bundles.filter((_, i) => i !== index) });
  };

  return (
    <div className={styles.adminForm}>
        <div className={styles.adminEditCard}>
          <h3>Hlavička sekce</h3>
          <label>Nadpis<input value={data.bundleSection.title} onChange={(event) => updateSection('title', event.target.value)} /></label>
          <label>Popis<textarea value={data.bundleSection.description} onChange={(event) => updateSection('description', event.target.value)} /></label>
          <div className={styles.adminGridTwo}>
            <label>Badge doporučeného<input value={data.bundleSection.featuredBadge} onChange={(event) => updateSection('featuredBadge', event.target.value)} /></label>
            <label>Jednotka ceny<input value={data.bundleSection.priceUnit} onChange={(event) => updateSection('priceUnit', event.target.value)} /></label>
          </div>
          <label>Text tlačítka<input value={data.bundleSection.ctaLabel} onChange={(event) => updateSection('ctaLabel', event.target.value)} /></label>
        </div>

        <div className={styles.adminListHead}>
          <h3>Balíčky</h3>
          <button className={styles.adminSecondary} onClick={() => setData({ ...data, bundles: [...data.bundles, emptyBundle()] })} type="button">Přidat balíček</button>
        </div>

        <div className={styles.adminCardList}>
          {data.bundles.map((bundle, index) => (
            <article className={styles.adminEditCard} key={`${bundle.name}-${index}`}>
              <div className={styles.adminCardTitle}>
                <h3>{bundle.name || 'Balíček'}</h3>
                <button className={styles.adminDanger} onClick={() => removeBundle(index)} type="button">Smazat</button>
              </div>
              <div className={styles.adminGridTwo}>
                <label>Název<input value={bundle.name} onChange={(event) => updateBundle(index, 'name', event.target.value)} /></label>
                <label>Internet<input value={bundle.internet} onChange={(event) => updateBundle(index, 'internet', event.target.value)} /></label>
                <label>TV<input value={bundle.tv} onChange={(event) => updateBundle(index, 'tv', event.target.value)} /></label>
                <label>HD<input value={bundle.hd} onChange={(event) => updateBundle(index, 'hd', event.target.value)} /></label>
                <label>Cena<input value={bundle.price} onChange={(event) => updateBundle(index, 'price', event.target.value)} /></label>
              </div>
              <label>Úspora<input value={bundle.savings} onChange={(event) => updateBundle(index, 'savings', event.target.value)} /></label>
              <label>Vlastnosti, každá na nový řádek<textarea value={(bundle.features || []).join('\n')} onChange={(event) => updateBundle(index, 'features', event.target.value.split('\n').filter(Boolean))} /></label>
              <div className={styles.adminCheckRow}>
                <label><input type="checkbox" checked={bundle.featured === true} onChange={(event) => updateBundle(index, 'featured', event.target.checked)} /> Doporučený</label>
                <label><input type="checkbox" checked={bundle.visible !== false} onChange={(event) => updateBundle(index, 'visible', event.target.checked)} /> Viditelný</label>
              </div>
            </article>
          ))}
        </div>
    </div>
  );
}
