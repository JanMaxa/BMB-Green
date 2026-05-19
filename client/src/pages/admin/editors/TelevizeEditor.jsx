import { useCallback, useEffect, useState } from 'react';
import TelevizeContent from '../../televize/TelevizeContent.jsx';
import { defaultTelevizeData, normalizeTelevizeData } from '../../televize/televizeData.js';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/televize';

export default function TelevizeEditor({ setHeaderAction }) {
  const [data, setData] = useState(defaultTelevizeData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState('Načítám obsah...');

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(normalizeTelevizeData(loaded));
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

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && isLoaded && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!isLoaded} onClick={save} type="button">
          Uložit
        </button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [isLoaded, save, setHeaderAction, status]);

  const updateField = (path, value) => {
    setData((current) => updateNestedValue(current, path, value));
  };

  if (!isLoaded) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  return (
    <div className={styles.adminTelevizeEditor}>
      <TelevizeContent data={data} editable onFieldChange={updateField} />
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
