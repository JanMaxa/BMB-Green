import { useCallback, useEffect, useState } from 'react';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/locations';

const emptyLocation = () => ({
  lat: '',
  lng: '',
  label: '',
  address: '',
  connections: '',
  speedText: '',
  status: 'active',
  statusMessage: '',
});

export default function PokrytiEditor({ setHeaderAction }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Načítám obsah...');
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(loaded);
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const openCreate = useCallback(() => {
    setEditingIndex(null);
    setDraft(emptyLocation());
  }, []);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={openCreate} type="button">Přidat lokaci</button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [data, openCreate, setHeaderAction, status]);

  if (!data) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  const openEdit = (index) => {
    setEditingIndex(index);
    setDraft({ ...data.locations[index] });
  };

  const closeModal = () => {
    setEditingIndex(null);
    setDraft(null);
    setDeleteIndex(null);
  };

  const saveLocations = async (nextLocations, successMessage) => {
    const nextData = { locations: nextLocations };
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
    const normalized = {
      ...draft,
      lat: draft.lat === '' ? null : Number(draft.lat),
      lng: draft.lng === '' ? null : Number(draft.lng),
      connections: draft.connections === '' ? 0 : Number(draft.connections),
    };
    const nextLocations = editingIndex === null
      ? [...data.locations, normalized]
      : data.locations.map((location, index) => (index === editingIndex ? normalized : location));
    const ok = await saveLocations(nextLocations, 'Uloženo.');
    if (ok) closeModal();
  };

  const confirmDelete = async () => {
    const nextLocations = data.locations.filter((_, index) => index !== deleteIndex);
    const ok = await saveLocations(nextLocations, 'Lokace smazána.');
    if (ok) closeModal();
  };

  return (
    <>
      <div className={styles.adminForm}>
        <div className={styles.adminLocationList}>
          {data.locations.map((location, index) => (
            <article className={styles.adminLocationRow} key={`${location.address}-${index}`}>
              <span className={cx(styles.adminLocationDot, location.status === 'warning' && styles.statusWarning, location.status === 'error' && styles.statusError)}></span>
              <div className={styles.adminLocationMain}>
                <strong>{location.label || location.address || 'Lokace'}</strong>
                <span>{location.address || 'Bez adresy'}</span>
              </div>
              <div className={styles.adminLocationActions}>
                <button className={styles.adminSecondary} onClick={() => openEdit(index)} type="button">Editovat</button>
                <button className={styles.adminDanger} onClick={() => setDeleteIndex(index)} type="button">Smazat</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {draft && (
        <LocationModal
          draft={draft}
          isNew={editingIndex === null}
          onChange={(key, value) => setDraft({ ...draft, [key]: value })}
          onCancel={closeModal}
          onSave={saveDraft}
        />
      )}

      {deleteIndex !== null && (
        <DeleteModal
          location={data.locations[deleteIndex]}
          onCancel={closeModal}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}

function LocationModal({ draft, isNew, onChange, onCancel, onSave }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={styles.adminModal}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>{isNew ? 'Přidat lokaci' : 'Editovat lokaci'}</h3>
            <p>Změny se uloží hned po kliknutí na Uložit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>

        <div className={styles.adminModalBody}>
          <div className={styles.adminGridTwo}>
            <label>Štítek na mapě<input value={draft.label} onChange={(event) => onChange('label', event.target.value)} /></label>
            <label>Adresa<input value={draft.address} onChange={(event) => onChange('address', event.target.value)} /></label>
            <label>Zeměpisná šířka<input type="number" step="0.0001" value={draft.lat} onChange={(event) => onChange('lat', event.target.value)} /></label>
            <label>Zeměpisná délka<input type="number" step="0.0001" value={draft.lng} onChange={(event) => onChange('lng', event.target.value)} /></label>
            <label>Počet přípojek<input type="number" min="0" step="1" value={draft.connections} onChange={(event) => onChange('connections', event.target.value)} /></label>
            <label>Rychlost<input value={draft.speedText} onChange={(event) => onChange('speedText', event.target.value)} /></label>
          </div>
          <label>Stav
            <select value={draft.status} onChange={(event) => onChange('status', event.target.value)}>
              <option value="active">Aktivní</option>
              <option value="warning">Upozornění</option>
              <option value="error">Výpadek</option>
            </select>
          </label>
          <label>Zpráva ke stavu<textarea value={draft.statusMessage} onChange={(event) => onChange('statusMessage', event.target.value)} /></label>
        </div>

        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminPrimary} onClick={onSave} type="button">Uložit</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ location, onCancel, onDelete }) {
  return (
    <div className={styles.adminModalBackdrop}>
      <div className={cx(styles.adminModal, styles.adminModalSmall)}>
        <div className={styles.adminModalHead}>
          <div>
            <h3>Smazat lokaci?</h3>
            <p>Tato akce odstraní lokaci z mapy a webu. Tuto akci nebude možné vrátit zpět.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminDeleteTarget}>{location?.label || location?.address || 'Lokace'}</div>
        <div className={styles.adminModalActions}>
          <button className={styles.adminSecondary} onClick={onCancel} type="button">Zrušit</button>
          <button className={styles.adminDanger} onClick={onDelete} type="button">Smazat</button>
        </div>
      </div>
    </div>
  );
}
