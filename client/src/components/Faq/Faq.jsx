import Button from '../Button/Button.jsx';
import layout from '../../styles/layout.module.css';
import styles from './Faq.module.css';

const faqItems = [
  {
    question: 'Internet mi vůbec nefunguje. Co mám zkontrolovat jako první?',
    answer: 'Zkontrolujte, jestli je zapojený napájecí adaptér routeru, zda svítí kontrolky a jestli nejsou uvolněné kabely. Potom router na 30 sekund vypněte ze zásuvky a znovu zapněte. Pokud se připojení neobnoví, kontaktujte podporu.',
  },
  {
    question: 'Internet je pomalý, seká se nebo má krátké výpadky. Jak postupovat?',
    answer: 'Nejdřív zkuste připojení kabelem přímo do routeru, pokud je to možné. U Wi-Fi ověřte, jestli nejste daleko od routeru nebo za silnými zdmi. Pomůže také restart routeru a kontrola, zda problém nemá jen jedno konkrétní zařízení.',
  },
  {
    question: 'Jak poznám, že problém může být v domácím routeru?',
    answer: 'Typicky se problém projevuje tak, že Wi-Fi síť mizí, zařízení se nepřipojí, router nereaguje nebo pomůže jen krátký restart. Pokud internet funguje přes kabel, ale přes Wi-Fi ne, může být příčina právě v nastavení nebo stavu routeru.',
  },
  {
    question: 'Mám podezření, že mi nefunguje domácí router. Co teď?',
    answer: 'Router restartujte, zkontrolujte napájení a kabel mezi routerem a přípojkou. Pokud máte náhradní router nebo možnost připojení kabelem, pomůže to určit, kde problém vzniká. Když si nejste jistí, ozvěte se nám a projdeme to s vámi.',
  },
  {
    question: 'Potřebuji pomoct se zapojením nového domácího routeru. Můžete mi poradit?',
    answer: 'Ano. Připravte si model routeru, fotku zapojení a informaci, zda chcete používat vlastní Wi-Fi název a heslo. Podle typu služby vám řekneme, kam zapojit kabel a co nastavit.',
  },
  {
    question: 'Jak si správně změřím rychlost internetového připojení?',
    answer: 'Nejpřesnější měření uděláte přes kabel, ne přes Wi-Fi. Během testu vypněte stahování, streamování a další zařízení v síti. Pokud měříte přes Wi-Fi, výsledek může ovlivnit vzdálenost od routeru, rušení i výkon zařízení.',
  },
  {
    question: 'Televize se seká, nejde spustit nebo chybí obraz. Co mám zkusit?',
    answer: 'Restartujte set-top box nebo aplikaci, ověřte připojení k internetu a zkontrolujte HDMI kabel u televize. Pokud se problém opakuje jen u některých kanálů, napište nám konkrétní kanál, čas a zařízení, na kterém televizi sledujete.',
  },
  {
    question: 'Kdy mám kontaktovat technickou podporu a co si připravit?',
    answer: 'Kontaktujte nás, když nepomůže restart, problém trvá déle nebo se opakuje. Připravte si adresu přípojky, telefonní kontakt, popis problému, čas výpadku a informaci, jestli potíže řešíte přes kabel, Wi-Fi nebo televizi.',
  },
];

export default function Faq() {
  return (
    <section className={styles.faqSection}>
      <div className={`${layout.container} ${styles.faqContainer}`}>
        <div className={styles.faqGrid}>
          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details key={item.question} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <div className={styles.faqIntro}>
            <h2>Časté otázky</h2>
            <p>
              Nejčastější technické situace, které můžete zkusit vyřešit hned doma, než zavoláte podporu.
              Najdete tu první kroky při výpadku internetu, pomalém připojení, podezření na problém s routerem
              i potížích s televizí. O aktuálních problémech v síti a plánovaných pracích průběžně informujeme
              na stránce pro zákazníky.
            </p>
            <div className={styles.faqActions}>
              <Button as="a" href="/pro-zakazniky">
                Pro zákazníky
              </Button>
              <Button as="a" href="/kontakty" variant="secondary">
                Kontakty
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
