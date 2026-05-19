import { useCallback, useEffect, useState } from 'react';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/news';

const emptyNews = () => ({
  tag: 'Novinky',
  date: '',
  icon: 'clock',
  title: 'Nová novinka',
  desc: '',
  visible: true,
});

export default function NovinkyEditor({ setHeaderAction }) {
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

  const updateNews = (index, key, value) => {
    setData({
      ...data,
      items: data.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    });
  };

  return (
    <div className={styles.adminForm}>
        <div className={styles.adminListHead}>
          <h3>Novinky</h3>
          <button className={styles.adminSecondary} onClick={() => setData({ ...data, items: [...data.items, emptyNews()] })} type="button">Přidat novinku</button>
        </div>

        <div className={styles.adminCardList}>
          {data.items.map((item, index) => (
            <article className={styles.adminEditCard} key={`${item.title}-${index}`}>
              <div className={styles.adminCardTitle}>
                <h3>{item.title || 'Novinka'}</h3>
                <button className={styles.adminDanger} onClick={() => setData({ ...data, items: data.items.filter((_, i) => i !== index) })} type="button">Smazat</button>
              </div>
              <div className={styles.adminGridTwo}>
                <label>Štítek<input value={item.tag} onChange={(event) => updateNews(index, 'tag', event.target.value)} /></label>
                <label>Datum<input value={item.date} onChange={(event) => updateNews(index, 'date', event.target.value)} /></label>
                <label>Ikona<input value={item.icon} onChange={(event) => updateNews(index, 'icon', event.target.value)} /></label>
              </div>
              <label>Nadpis<input value={item.title} onChange={(event) => updateNews(index, 'title', event.target.value)} /></label>
              <label>Popis<textarea value={item.desc} onChange={(event) => updateNews(index, 'desc', event.target.value)} /></label>
              <div className={styles.adminCheckRow}>
                <label><input type="checkbox" checked={item.visible !== false} onChange={(event) => updateNews(index, 'visible', event.target.checked)} /> Viditelná</label>
              </div>
            </article>
          ))}
        </div>
    </div>
  );
}
