import { useCallback, useEffect, useState } from 'react';
import cx from '../../../utils/cx.js';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import styles from '../Admin.module.css';

const endpoint = '/api/faq';

const emptyFaqItem = () => ({
  question: '',
  answer: '',
});

const normalizeFaqItem = (item = {}) => ({
  question: item.question || '',
  answer: item.answer || '',
});

export default function FaqEditor({ setHeaderAction }) {
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
          items: Array.isArray(loaded?.items) ? loaded.items.map(normalizeFaqItem) : [],
        });
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const openCreate = useCallback(() => {
    setEditingIndex(null);
    setDraft(emptyFaqItem());
  }, []);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={openCreate} type="button">Přidat otázku</button>
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

  const saveFaqItems = async (nextItems, successMessage) => {
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
    const normalized = normalizeFaqItem({ ...emptyFaqItem(), ...draft });
    const nextItems = editingIndex === null
      ? [...data.items, normalized]
      : data.items.map((item, index) => (index === editingIndex ? normalized : item));
    const ok = await saveFaqItems(nextItems, 'Uloženo.');
    if (ok) closeModal();
  };

  const confirmDelete = async () => {
    const nextItems = data.items.filter((_, index) => index !== deleteIndex);
    const ok = await saveFaqItems(nextItems, 'Otázka smazána.');
    if (ok) closeModal();
  };

  return (
    <>
      <div className={styles.adminForm}>
        <div className={styles.adminFaqList}>
          {data.items.map((item, index) => (
            <article className={styles.adminFaqRow} key={`${item.question}-${index}`}>
              <div className={styles.adminFaqQuestion}>{item.question || '(bez otázky)'}</div>
              <div className={styles.adminLocationActions}>
                <button className={styles.adminSecondary} onClick={() => openEdit(index)} type="button">Editovat</button>
                <button className={styles.adminDanger} onClick={() => setDeleteIndex(index)} type="button">Smazat</button>
              </div>
            </article>
          ))}
          {data.items.length === 0 && (
            <p className={styles.adminEmpty}>Zatím žádné otázky. Přidejte první kliknutím na tlačítko výše.</p>
          )}
        </div>
      </div>

      {draft && (
        <FaqModal
          draft={draft}
          isNew={editingIndex === null}
          onChange={(key, value) => setDraft({ ...draft, [key]: value })}
          onCancel={closeModal}
          onSave={saveDraft}
        />
      )}

      {deleteIndex !== null && (
        <DeleteFaqModal
          item={data.items[deleteIndex]}
          onCancel={closeModal}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}

function FaqModal({ draft, isNew, onChange, onCancel, onSave }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={styles.adminModal}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>{isNew ? 'Přidat otázku' : 'Editovat otázku'}</h3>
            <p>Změny se uloží hned po kliknutí na Uložit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>

        <div className={styles.adminModalBody}>
          <label>Otázka<input value={draft.question} onChange={(event) => onChange('question', event.target.value)} /></label>
          <label>Odpověď<textarea value={draft.answer} onChange={(event) => onChange('answer', event.target.value)} /></label>
        </div>

        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminPrimary} onClick={onSave} type="button">Uložit</button>
        </div>
      </div>
    </div>
  );
}

function DeleteFaqModal({ item, onCancel, onDelete }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={cx(styles.adminModal, styles.adminModalSmall)}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Smazat otázku?</h3>
            <p>Tato akce odstraní otázku z webu. Tuto akci nebude možné vrátit zpět.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminDeleteTarget}>{item?.question || 'Otázka'}</div>
        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminDanger} onClick={onDelete} type="button">Smazat</button>
        </div>
      </div>
    </div>
  );
}
