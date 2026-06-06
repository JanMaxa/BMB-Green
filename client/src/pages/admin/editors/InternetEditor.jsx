import { useCallback, useEffect, useState } from 'react';
import InternetContent from '../../internet/InternetContent.jsx';
import { defaultInternetData, emptyInternetCard, normalizeInternetData } from '../../internet/internetData.js';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/internet';

export default function InternetEditor({ setHeaderAction }) {
  const [data, setData] = useState(defaultInternetData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState('Načítám obsah...');
  const [removeModal, setRemoveModal] = useState(false);

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(normalizeInternetData(loaded));
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

  const addCard = useCallback(() => {
    if (!isLoaded) return;
    setData((current) => ({ ...current, cards: [...current.cards, emptyInternetCard()] }));
    setStatus('Balíček přidán. Nezapomeňte uložit.');
  }, [isLoaded]);

  const removeCard = useCallback((index) => {
    if (!isLoaded) return;
    setData((current) => ({ ...current, cards: current.cards.filter((_, i) => i !== index) }));
    setRemoveModal(false);
    setStatus('Balíček odebrán. Nezapomeňte uložit.');
  }, [isLoaded]);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && isLoaded && <span>{status}</span>}
        <button className={styles.adminSecondary} disabled={!isLoaded || data.cards.length === 0} onClick={() => setRemoveModal(true)} type="button">Odebrat balíček</button>
        <button className={styles.adminSecondary} disabled={!isLoaded} onClick={addCard} type="button">Přidat balíček</button>
        <button className={styles.adminPrimary} disabled={!isLoaded} onClick={save} type="button">Uložit</button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [addCard, data.cards.length, isLoaded, removeCard, save, setHeaderAction, status]);

  const updateField = (path, value) => {
    setData((current) => updateNestedValue(current, path, value));
  };

  if (!isLoaded) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  return (
    <>
      <div className={styles.adminTelevizeEditor}>
        <InternetContent data={data} editable onFieldChange={updateField} />
      </div>
      {removeModal && (
        <RemoveItemModal
          items={data.cards}
          getLabel={(c) => c.title || 'Bez názvu'}
          onCancel={() => setRemoveModal(false)}
          onRemove={removeCard}
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
            <h3>Odebrat balíček</h3>
            <p>Vyberte balíček, který chcete odstranit.</p>
          </div>
          <button className={styles.adminModalClose} onClick={onCancel} type="button">×</button>
        </div>
        <div className={styles.adminModalBody}>
          <label>
            Balíček
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
