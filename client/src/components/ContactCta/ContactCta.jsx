import { useEffect, useState } from 'react';
import Button from '../Button/Button.jsx';
import layout from '../../styles/layout.module.css';
import { defaultContactData, normalizeContactData } from '../../utils/contactData.js';
import styles from './ContactCta.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function ContactCta() {
  const [contacts, setContacts] = useState(defaultContactData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contacts`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json) setContacts(normalizeContactData(json));
      })
      .catch(() => {});
  }, []);

  const firstPhone =  contacts.telefon.match(/(?:\+420\s?)?(?:\d{3}\s?\d{3}\s?\d{3})/)?.[0] || '';

  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <div className={styles.contactCard}>
          <div>
            <h2>Pomůžeme Vám vybrat to&nbsp;správné.</h2>
            <p>
              Nevíte si rady s&nbsp;tarifem, plánujete novostavbu nebo Vás zajímá fotovoltaika?
              Zavolejte v&nbsp;pracovní dny nebo nám napište — odpovíme do&nbsp;druhého pracovního dne.
            </p>
            <div className={styles.contactActions}>
              
              <Button
                as="a"
                href={`tel:${firstPhone.replace(/\s+/g, '')}`}
                variant="secondary"
                size="lg"
              >
                {firstPhone}
              </Button>

              <Button as="a" href="/kontakty" size="lg">
                Kontaktní formulář
                <img src="/assets/icons/arrow-right.svg" alt="" />
              </Button>
            </div>
          </div>
          <div className={styles.contactList}>
            <ContactRow icon="phone" label="Telefon" value={contacts.telefon} />
            <ContactRow icon="mail" label="E-mail" value={contacts.email} />
            <ContactRow icon="map-pin" label="Sídlo" value={contacts.sidlo} />
            <ContactRow icon="clock" label="Provozní doba" value={contacts.pracovniDoba} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div className={styles.contactRow}>
      <div className={styles.contactIcon}><img src={`/assets/icons/${icon}.svg`} alt="" /></div>
      <div>
        <div className={styles.contactLabel}>{label}</div>
        <div className={styles.contactValue} style={{ whiteSpace: 'pre-line' }}>{value}</div>
      </div>
    </div>
  );
}
