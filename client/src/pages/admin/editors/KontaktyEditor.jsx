import { useCallback, useEffect, useState } from 'react';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import { defaultContactData, normalizeContactData } from '../../../utils/contactData.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/contacts';

export default function KontaktyEditor({ setHeaderAction }) {
  const [data, setData] = useState(defaultContactData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState('Načítám obsah...');

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(normalizeContactData(loaded));
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

  const handleChange = (field, value) => {
    setData((current) => ({ ...current, [field]: value }));
    setStatus('Změny nejsou uložené.');
  };

  if (!isLoaded) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  return (
      <div className={cx(styles.adminEditCard, styles.adminGridTwo)}>
        <label>
          Telefon
          <textarea
            value={data.telefon}
            onChange={(e) => handleChange('telefon', e.target.value)}
            placeholder="+420 266 317 129"
            rows={2}
          />
        </label>

        <label>
          Kancelář
          <textarea
            value={data.kancelar}
            onChange={(e) => handleChange('kancelar', e.target.value)}
            placeholder="Drahobejlova 1894/52, 190 00 Praha 9"
            rows={2}
          />
        </label>

        <label>
          E-mail
          <textarea
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="smlouva@bmb-green.cz"
            rows={2}
          />
        </label>

        <label>
          Provozní doba
          <textarea
            value={data.pracovniDoba}
            onChange={(e) => handleChange('pracovniDoba', e.target.value)}
            placeholder="Po–Pá 8:00–17:00"
            rows={2}
          />
        </label>

        <label>
          Sídlo
          <textarea
            value={data.sidlo}
            onChange={(e) => handleChange('sidlo', e.target.value)}
            placeholder="Na Dračkách 843/24, 162 00 Praha 6"
            rows={2}
          />
        </label>

        <label>
          IČO
          <textarea
            value={data.ico}
            onChange={(e) => handleChange('ico', e.target.value)}
            placeholder="24658391"
            rows={2}
          />
        </label>

        <label>
          DIČ
          <textarea
            value={data.dic}
            onChange={(e) => handleChange('dic', e.target.value)}
            placeholder="CZ24658391"
            rows={2}
          />
        </label>
      </div>
  );
}
