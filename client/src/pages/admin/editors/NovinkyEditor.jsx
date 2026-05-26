import { useCallback, useEffect, useState } from 'react';
import cx from '../../../utils/cx.js';
import newsStyles from '../../pro-zakazniky/ProZakazniky.module.css';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import styles from '../Admin.module.css';

const endpoint = '/api/news';

const emptyNews = () => ({
  tag: '',
  date: '',
  imageUrl: '',
  title: 'Nová novinka',
  desc: '',
});

const normalizeNewsItem = (item = {}) => ({
  tag: item.tag || '',
  date: item.date || '',
  imageUrl: item.imageUrl || '',
  title: item.title || '',
  desc: item.desc || '',
});

export default function NovinkyEditor({ setHeaderAction }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Načítám obsah...');
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData({
          ...loaded,
          items: Array.isArray(loaded?.items) ? loaded.items.map(normalizeNewsItem) : [],
        });
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const openCreate = useCallback(() => {
    setEditingIndex(null);
    setDraft(emptyNews());
  }, []);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={openCreate} type="button">Přidat novinku</button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [data, openCreate, setHeaderAction, status]);

  if (!data) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  const openEdit = (index) => {
    setEditingIndex(index);
    setDraft({ ...data.items[index] });
  };

  const closeModal = () => {
    setEditingIndex(null);
    setDraft(null);
    setDeleteIndex(null);
  };

  const saveNewsItems = async (nextItems, successMessage) => {
    const nextData = { ...data, items: nextItems };
    setData(nextData);
    try {
      await saveAdminData(endpoint, nextData);
      setStatus(successMessage);
      return true;
    } catch {
      setStatus('Uložení se nepodařilo.');
      return false;
    }
  };

  const saveDraft = async () => {
    const normalized = normalizeNewsItem({
      ...emptyNews(),
      ...draft,
    });
    const nextItems = editingIndex === null
      ? [...data.items, normalized]
      : data.items.map((item, index) => (index === editingIndex ? normalized : item));
    const ok = await saveNewsItems(nextItems, 'Uloženo.');
    if (ok) closeModal();
  };

  const confirmDelete = async () => {
    const nextItems = data.items.filter((_, index) => index !== deleteIndex);
    const ok = await saveNewsItems(nextItems, 'Novinka smazána.');
    if (ok) closeModal();
  };

  return (
    <>
      <div className={styles.adminForm}>
        <div className={styles.adminNewsGrid}>
          {data.items.map((item, index) => (
            <article className={cx(newsStyles.newsCard, styles.adminNewsCard)} key={`${item.title}-${item.date}-${index}`}>
              <div className={styles.adminNewsActions}>
                <button className={styles.adminSecondary} onClick={() => openEdit(index)} type="button">Editovat</button>
                <button className={styles.adminDanger} onClick={() => setDeleteIndex(index)} type="button">Smazat</button>
              </div>
              <div className={newsStyles.newsImage}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title || ''} />}
              </div>
              <div className={newsStyles.newsBody}>
                <div className={newsStyles.newsMeta}>{item.tag} · {item.date}</div>
                <div className={newsStyles.newsTitle}>{item.title}</div>
                <div className={newsStyles.newsDescription}>{item.desc}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {draft && (
        <NewsModal
          draft={draft}
          isNew={editingIndex === null}
          onChange={(key, value) => setDraft({ ...draft, [key]: value })}
          onCancel={closeModal}
          onSave={saveDraft}
        />
      )}

      {deleteIndex !== null && (
        <DeleteNewsModal
          news={data.items[deleteIndex]}
          onCancel={closeModal}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}

function NewsModal({ draft, isNew, onChange, onCancel, onSave }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={styles.adminModal}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>{isNew ? 'Přidat novinku' : 'Editovat novinku'}</h3>
            <p>Změny se uloží hned po kliknutí na Uložit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>

        <div className={styles.adminModalBody}>
          <div className={styles.adminGridTwo}>
            <label>Štítek<input value={draft.tag} onChange={(event) => onChange('tag', event.target.value)} /></label>
            <label>Datum<input value={draft.date} onChange={(event) => onChange('date', event.target.value)} /></label>
          </div>
          <label>URL obrázku<input value={draft.imageUrl || ''} onChange={(event) => onChange('imageUrl', event.target.value)} /></label>
          <label>Nadpis<input value={draft.title} onChange={(event) => onChange('title', event.target.value)} /></label>
          <label>Popis<textarea value={draft.desc} onChange={(event) => onChange('desc', event.target.value)} /></label>
        </div>

        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminPrimary} onClick={onSave} type="button">Uložit</button>
        </div>
      </div>
    </div>
  );
}

function DeleteNewsModal({ news, onCancel, onDelete }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={cx(styles.adminModal, styles.adminModalSmall)}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Smazat novinku?</h3>
            <p>Tato akce odstraní novinku z webu. Tuto akci nebude možné vrátit zpět.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminDeleteTarget}>{news?.title || 'Novinka'}</div>
        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminDanger} onClick={onDelete} type="button">Smazat</button>
        </div>
      </div>
    </div>
  );
}
