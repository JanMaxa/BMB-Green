import styles from './PrivacyNote.module.css';

export default function PrivacyNote() {
  return (
    <p className={styles.note}>
      Odesláním formuláře berete na vědomí zpracování Vašich osobních údajů za účelem vyřízení Vaší zprávy.
      Podrobnosti najdete v <a href="/ke-stazeni">dokumentech ke stažení</a>.
    </p>
  );
}
