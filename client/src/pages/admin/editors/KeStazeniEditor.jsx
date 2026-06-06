import { useCallback, useEffect, useRef, useState } from 'react';
import cx from '../../../utils/cx.js';
import KeStazeniContent from '../../ke-stazeni/KeStazeniContent.jsx';
import { defaultKeStazeniData, emptyDocument, normalizeKeStazeniData, normalizeDocument } from '../../ke-stazeni/keStazeniData.js';
import { deleteUploadedDocument, loadAdminData, saveAdminData, uploadDocument, uploadNewsImage } from '../adminApi.js';
import layout from '../../../styles/layout.module.css';
import styles from '../Admin.module.css';

const endpoint = '/api/documents';

export default function KeStazeniEditor({ setHeaderAction }) {
  const [data, setData] = useState(defaultKeStazeniData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState('Načítám obsah...');
  const [removeModal, setRemoveModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(normalizeKeStazeniData(loaded));
        setIsLoaded(true);
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const save = useCallback(async () => {
    if (!isLoaded) return;
    try {
      await saveAdminData(endpoint, data);
      setStatus('Uloženo.');
    } catch {
      setStatus('Uložení se nepodařilo.');
    }
  }, [data, isLoaded]);

  const addDoc = useCallback((doc) => {
    if (!isLoaded) return;
    const normalized = normalizeDocument({ ...emptyDocument(), ...doc });
    setData((current) => ({ ...current, items: [...current.items, normalized] }));
    setAddModal(false);
    setStatus('Dokument přidán. Nezapomeňte uložit.');
  }, [isLoaded]);

  const removeDoc = useCallback((index) => {
    if (!isLoaded) return;
    setData((current) => ({ ...current, items: current.items.filter((_, i) => i !== index) }));
    setRemoveModal(false);
    setStatus('Dokument odebrán. Nezapomeňte uložit.');
  }, [isLoaded]);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && isLoaded && <span>{status}</span>}
        <button
          className={styles.adminSecondary}
          disabled={!isLoaded || data.items.length === 0}
          onClick={() => setRemoveModal(true)}
          type="button"
        >
          Odebrat dokument
        </button>
        <button
          className={styles.adminSecondary}
          disabled={!isLoaded}
          onClick={() => setAddModal(true)}
          type="button"
        >
          Přidat dokument
        </button>
        <button className={styles.adminPrimary} disabled={!isLoaded} onClick={save} type="button">
          Uložit
        </button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [data.items.length, isLoaded, save, setHeaderAction, status]);

  const updateField = (path, value) => {
    setData((current) => updateNestedValue(current, path, value));
    if (isLoaded) setStatus('Změny nejsou uložené.');
  };

  if (!isLoaded) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  return (
    <>
      <div className={styles.adminTelevizeEditor}>
        <section className={cx(layout.topSection, layout.topGradient)}>
          <div className={layout.container}>
            <KeStazeniContent data={data} editable onFieldChange={updateField} onImageUpload={uploadNewsImage} />
          </div>
        </section>
      </div>

      {removeModal && (
        <RemoveItemModal
          items={data.items}
          getLabel={(d) => d.label || 'Bez názvu'}
          onCancel={() => setRemoveModal(false)}
          onRemove={removeDoc}
        />
      )}

      {addModal && (
        <AddDocumentModal
          onCancel={() => setAddModal(false)}
          onAdd={addDoc}
        />
      )}
    </>
  );
}

function RemoveItemModal({ items, getLabel, onCancel, onRemove }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.adminModalBackdrop}>
      <div className={cx(styles.adminModal, styles.adminModalSmall)}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Odebrat dokument</h3>
            <p>Vyberte dokument, který chcete odstranit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminModalBody}>
          <label>
            Dokument
            <select value={selectedIndex} onChange={(event) => setSelectedIndex(Number(event.target.value))}>
              {items.map((item, i) => (
                <option key={i} value={i}>{getLabel(item)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminDanger} onClick={() => onRemove(selectedIndex)} type="button">Odebrat</button>
        </div>
      </div>
    </div>
  );
}

function AddDocumentModal({ onCancel, onAdd }) {
  const [draft, setDraft] = useState(() => emptyDocument());
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
      setDraft((current) => ({ ...current, path: filePath }));
    } catch (err) {
      setUploadError(err.message || 'Nahrání selhalo.');
    } finally {
      setUploading(false);
    }
  };

  const canAdd = draft.label.trim() && draft.path && !uploading;

  const cancel = async () => {
    if (!uploading && typeof draft.path === 'string' && draft.path.startsWith('/uploads/documents/')) {
      try {
        await deleteUploadedDocument(draft.path);
      } catch {
        // ignore cleanup failures; user can still proceed
      }
    }
    onCancel?.();
  };

  return (
    <div className={styles.adminModalBackdrop}>
      <div className={styles.adminModal}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Přidat dokument</h3>
            <p>Nezapomeňte potom kliknout na Uložit v horní liště.</p>
          </div>
          <button className={styles.adminModalClose} onClick={cancel} type="button">×</button>
        </div>

        <div className={styles.adminModalBody}>
          <label>
            Název dokumentu
            <input
              value={draft.label}
              placeholder="např. Všeobecné obchodní podmínky"
              onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
            />
          </label>

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
                  onClick={() => setDraft((current) => ({ ...current, path: '' }))}
                >
                  Odebrat
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={cancel} type="button">Zrušit</button>
          <button className={styles.adminPrimary} onClick={() => onAdd(draft)} disabled={!canAdd} type="button">
            Přidat
          </button>
        </div>
      </div>
    </div>
  );
}

function updateNestedValue(source, path, value) {
  const [key, ...rest] = path;

  if (!rest.length) {
    return { ...source, [key]: value };
  }

  if (Array.isArray(source)) {
    return source.map((item, index) => (
      index === key ? updateNestedValue(item, rest, value) : item
    ));
  }

  return {
    ...source,
    [key]: updateNestedValue(source[key], rest, value),
  };
}

