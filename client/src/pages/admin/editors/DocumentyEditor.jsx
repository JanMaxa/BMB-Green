import { useCallback, useEffect, useRef, useState } from 'react';
import cx from '../../../utils/cx.js';
import { loadAdminData, saveAdminData, uploadDocument } from '../adminApi.js';
import styles from '../Admin.module.css';

const endpoint = '/api/documents';

const emptyDoc = () => ({ label: '', path: '' });

const normalizeDoc = (item = {}) => ({
  label: item.label || '',
  path: item.path || '',
});

export default function DocumentyEditor({ setHeaderAction }) {
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
          items: Array.isArray(loaded?.items) ? loaded.items.map(normalizeDoc) : [],
        });
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const openCreate = useCallback(() => {
    setEditingIndex(null);
    setDraft(emptyDoc());
  }, []);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={openCreate} type="button">
          Přidat dokument
        </button>
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

  const saveItems = async (nextItems, successMessage) => {
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
    const normalized = normalizeDoc({ ...emptyDoc(), ...draft });
    const nextItems = editingIndex === null
      ? [...data.items, normalized]
      : data.items.map((item, index) => (index === editingIndex ? normalized : item));
    const ok = await saveItems(nextItems, 'Uloženo.');
    if (ok) closeModal();
  };

  const confirmDelete = async () => {
    const nextItems = data.items.filter((_, index) => index !== deleteIndex);
    const ok = await saveItems(nextItems, 'Dokument smazán.');
    if (ok) closeModal();
  };

  return (
    <>
      <div className={styles.adminForm}>
        <div className={styles.adminDocList}>
          {data.items.map((item, index) => (
            <div className={styles.adminDocRow} key={`${item.path}-${index}`}>
              <div className={styles.adminDocInfo}>
                <span className={styles.adminDocLabel}>{item.label || '(bez názvu)'}</span>
                <span className={styles.adminDocPath}>{item.path}</span>
              </div>
              <div className={styles.adminLocationActions}>
                <button className={styles.adminSecondary} onClick={() => openEdit(index)} type="button">Editovat</button>
                <button className={styles.adminDanger} onClick={() => setDeleteIndex(index)} type="button">Smazat</button>
              </div>
            </div>
          ))}
          {data.items.length === 0 && (
            <p className={styles.adminEmpty}>Žádné dokumenty. Přidejte první kliknutím na tlačítko výše.</p>
          )}
        </div>
      </div>

      {draft !== null && (
        <DocModal
          draft={draft}
          isNew={editingIndex === null}
          onChange={(key, value) => setDraft({ ...draft, [key]: value })}
          onCancel={closeModal}
          onSave={saveDraft}
        />
      )}

      {deleteIndex !== null && (
        <DeleteDocModal
          item={data.items[deleteIndex]}
          onCancel={closeModal}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}

function DocModal({ draft, isNew, onChange, onCancel, onSave }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    setUploading(true);
    setUploadError('');

    try {
      const filePath = await uploadDocument(file);
      onChange('path', filePath);
    } catch (err) {
      setUploadError(err.message || 'Nahrání selhalo.');
    } finally {
      setUploading(false);
    }
  };

  const canSave = draft.label.trim() && draft.path && !uploading;

  return (
    <div className={styles.adminModalBackdrop}>
      <div className={styles.adminModal}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>{isNew ? 'Přidat dokument' : 'Editovat dokument'}</h3>
            <p>Změny se uloží hned po kliknutí na Uložit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>

        <div className={styles.adminModalBody}>
          <label>
            Název dokumentu
            <input
              value={draft.label}
              placeholder="např. Všeobecné obchodní podmínky"
              onChange={(event) => onChange('label', event.target.value)}
            />
          </label>

          {/* PDF upload — only shown when adding a new document */}
          {isNew && (
            <div>
              <span className={styles.adminUploadLabel}>Soubor PDF</span>
              <button
                type="button"
                className={cx(styles.adminUploadZone, styles.adminUploadZonePdf)}
                onClick={() => !uploading && fileInputRef.current?.click()}
                aria-label="Nahrát PDF"
              >
                {draft.path ? (
                  <div className={styles.adminPdfUploaded}>
                    <img src="/assets/icons/download.svg" alt="" className={styles.adminPdfIcon} />
                    <span>Soubor nahrán</span>
                  </div>
                ) : (
                  <div className={styles.adminUploadPlaceholder}>
                    <span className={styles.adminUploadIcon}>📄</span>
                    <span>Klikněte pro nahrání PDF</span>
                    <span className={styles.adminUploadHint}>Pouze PDF · max 20 MB</span>
                  </div>
                )}
                {uploading && (
                  <div className={styles.adminUploadOverlay}>
                    <span>Nahrávám…</span>
                  </div>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {uploadError && <div className={styles.adminUploadError}>{uploadError}</div>}

              {draft.path && !uploading && (
                <div className={styles.adminUploadMeta}>
                  <span>✓ Nahráno na server</span>
                  <button
                    type="button"
                    className={styles.adminUploadRemove}
                    onClick={() => onChange('path', '')}
                  >
                    Odebrat
                  </button>
                </div>
              )}
            </div>
          )}

          {/* When editing, show the current file path as read-only info */}
          {!isNew && (
            <div>
              <span className={styles.adminUploadLabel}>Soubor</span>
              <div className={styles.adminDocPathReadonly}>{draft.path}</div>
              <p className={styles.adminDocPathHint}>Chcete vyměnit soubor? Smažte dokument a přidejte jej znovu.</p>
            </div>
          )}
        </div>

        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminPrimary} onClick={onSave} disabled={!canSave} type="button">Uložit</button>
        </div>
      </div>
    </div>
  );
}

function DeleteDocModal({ item, onCancel, onDelete }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={cx(styles.adminModal, styles.adminModalSmall)}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Smazat dokument?</h3>
            <p>Soubor bude smazán ze serveru. Tuto akci nebude možné vrátit zpět.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminDeleteTarget}>{item?.label || 'Dokument'}</div>
        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminDanger} onClick={onDelete} type="button">Smazat</button>
        </div>
      </div>
    </div>
  );
}
