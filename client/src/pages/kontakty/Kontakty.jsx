import Button from '../../components/Button/Button.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './Kontakty.module.css';

export default function Kontakty() {
  return (
    <>
      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={layout.container}>
          <div className={styles.contactFormLayout}>
            <form className={styles.contactForm}>
              <div className={styles.formRow}>
                <label>
                  Jméno a příjmení
                  <input type="text" name="name" autoComplete="name" />
                </label>
                <label>
                  E-mail
                  <input type="email" name="email" autoComplete="email" />
                </label>
              </div>
              <label>
                Telefon
                <input type="tel" name="phone" autoComplete="tel" />
              </label>
              <label>
                Zpráva
                <textarea name="message" rows="5"></textarea>
              </label>
              <Button className={styles.submitButton} size="lg" type="submit">Odeslat poptávku</Button>
            </form>
            <div className={styles.contactFormCopy}>
              <h2>Nezávazná poptávka</h2>
              <p>Napište nám, co potřebujete vyřešit. Ozveme se Vám nejpozději do druhého pracovního dne.</p>
              <ul className={styles.contactReasons}>
                <li><img src="/assets/icons/check.svg" alt="" />Prověříme dostupnost služby na Vaší adrese.</li>
                <li><img src="/assets/icons/check.svg" alt="" />Doporučíme vhodný tarif, technologii i termín instalace.</li>
                <li><img src="/assets/icons/check.svg" alt="" />Připravíme konkrétní nabídku bez závazku.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
