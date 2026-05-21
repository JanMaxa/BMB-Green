import Button from '../Button/Button.jsx';
import layout from '../../styles/layout.module.css';
import styles from './ContactCta.module.css';

export default function ContactCta() {
  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <div className={styles.contactCard}>
          <div>
            <h2>Pomůžeme Vám vybrat to&nbsp;správné.</h2>
            <p>
              Nevíte si rady s&nbsp;tarifem, plánujete novostavbu nebo Vás zajímá fotovoltaika?
              Zavolejte v&nbsp;pracovní dny 8–17&nbsp;h nebo nám napište — odpovíme do&nbsp;druhého pracovního dne.
            </p>
            <div className={styles.contactActions}>
              <Button as="a" href="/kontakty" size="lg">
                Kontaktní formulář
              </Button>
              <Button as="a" href="tel:+420266317129" variant="secondary" size="lg">
                +420&nbsp;266&nbsp;317&nbsp;129
              </Button>
            </div>
          </div>
          <div className={styles.contactList}>
            <ContactRow icon="phone" label="Telefon" value="+420&nbsp;266&nbsp;317&nbsp;129" />
            <ContactRow icon="mail" label="E-mail" value="smlouva@bmb-green.cz" />
            <ContactRow icon="map-pin" label="Sídlo" value="Na&nbsp;Dračkách&nbsp;843/24, 162&nbsp;00 Praha&nbsp;6" />
            <ContactRow icon="clock" label="Provozní doba" value="Po–Pá 8:00–17:00" />
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
        <div className={styles.contactValue} dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
}
