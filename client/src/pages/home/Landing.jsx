import Button from '../../components/Button/Button.jsx';
import CoverageSection from '../../components/CoverageSection/CoverageSection.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import Faq from '../../components/Faq/Faq.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './Landing.module.css';
import heroImage from '../../assets/hero.webp';
import aboutImage from '../../assets/about.webp';

const featureItems = [
  { icon: 'bolt',     t: 'Nejrychlejší Internet',   d: 'Optika a bezdrát 5 GHz, symetricky až 1 Gb/s.' },
  { icon: 'clock',    t: 'Instalace do 2–3 dnů',    d: 'Rychlá montáž bez čekání na techniky.' },
  { icon: 'building', t: 'Developerské projekty',   d: 'Slaboproudá infrastruktura na klíč.' },
  { icon: 'map-pin',  t: 'Tradice od roku 1991',    d: 'Česká firma se sídlem v Brandýse n. L.' },
];

const services = [
  { icon: 'wifi',         title: 'Internet',         link: '/internet', desc: 'Optika FTTH a bezdrát 5 GHz. Symetrické rychlosti až 1 Gb/s pro domácnosti i firmy.' },
  { icon: 'tv',           title: 'Televize',         link: '/televize', desc: '120+ kanálů, HD/4K, 7denní archiv, sledování na 4 zařízeních současně.' },
  { icon: 'phone',        title: 'Volání',           desc: 'Pevná linka přes IP, neomezené volání do všech sítí ČR za 199 Kč/měs.' },
  { icon: 'shield-check', title: 'Zabezpečení',      desc: 'EZS / EPS, CCTV, přístupové systémy, napojení na PCO. Revize a 24/7 servis.' },
  { icon: 'sun',          title: 'Fotovoltaika',     desc: 'Návrh i realizace FVE na klíč. Dotace NZÚ vyřídíme za Vás.' },
  { icon: 'fiber',        title: 'Sítě a kabeláž',   desc: 'Optické trasy, strukturovaná kabeláž, anténní rozvody pro developerské projekty.' },
  { icon: 'camera',       title: 'Kamerové systémy', desc: 'IP kamery 4K, NVR úložiště, vzdálený dohled přes mobilní aplikaci.' },
  { icon: 'building',     title: 'Developerům',      desc: 'Kompletní slaboproudá infrastruktura pro novostavby. Od projektu po předání.' },
];

const trustStats = [
  { v: '34',        em: 'let', l: 'na trhu od roku 1991' },
  { v: '1 540', em: '+',   l: 'aktivních přípojek' },
  { v: '99,97',     em: '%',   l: 'dostupnost páteřní sítě' },
  { v: '24/7',      em: '',    l: 'technická podpora' },
];

export default function Landing() {
  return (
    <>
      <section className={styles.hero}>
        <div className={cx(layout.container, styles.heroGrid)}>
          <div>
            <h1>
              Nejrychlejší Internet ve&nbsp;<em>městě</em>. A&nbsp;ještě k&nbsp;tomu televize.
            </h1>
            <p className={styles.heroLead}>
              Rychlý Internet, digitální televize a&nbsp;levné volání pro byty, rodinné domy
              a&nbsp;developerské projekty v&nbsp;Brandýse nad&nbsp;Labem a&nbsp;okolí Prahy.
              Instalace do 2–3&nbsp;pracovních dnů.
            </p>
            <div className={styles.heroActions}>
              <Button size="lg">
                Zjistit dostupnost
                <img src="/assets/icons/arrow-right.svg" alt="" />
              </Button>
              <Button variant="ghost" size="lg">Prohlédnout tarify</Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src={heroImage} alt="Technologická infrastruktura BMB-Green" />
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={layout.container}>
          <div className={styles.featuresGrid}>
            {featureItems.map((f) => (
              <div key={f.t} className={styles.feature}>
                <div className={styles.featureIcon}><img src={`/assets/icons/${f.icon}.svg`} alt="" /></div>
                <div>
                  <div className={styles.featureTitle}>{f.t}</div>
                  <div className={styles.featureDescription}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={layout.container}>
          <div className={layout.sectionHead}>
            <h2>Jeden partner pro celou nemovitost.</h2>
            <p>Od&nbsp;přípojky po&nbsp;zabezpečení a&nbsp;fotovoltaiku — všechno navrhneme, postavíme a&nbsp;dlouhodobě servisujeme my sami.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((s) => (
              <div key={s.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}><img src={`/assets/icons/${s.icon}.svg`} alt="" /></div>
                <div className={styles.serviceTitle}>{s.title}</div>
                <div className={styles.serviceDescription}>{s.desc}</div>
                <a className={styles.serviceLink} href={s.link || '/pro-zakazniky'}>
                  Více informací
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={cx(layout.container, styles.about)}>
          <div className={styles.aboutImage}>
            <img src={aboutImage} alt="Síťová a optická infrastruktura" />
          </div>
          <div>
            <h2>Stavíme sítě, kterým může město věřit.</h2>
            <p>
              BMB-Green je česká technologická společnost se&nbsp;sídlem v&nbsp;Brandýse nad&nbsp;Labem.
              Od&nbsp;roku 1991 budujeme optické a&nbsp;bezdrátové sítě, instalujeme bezpečnostní
              a&nbsp;fotovoltaické systémy pro domácnosti, firmy i&nbsp;developery.
            </p>
            <p>
              Pracujeme pod&nbsp;licencí ČTÚ, máme vlastní tým techniků a&nbsp;servis dostupný 24/7.
              Nejsme přeprodejci — Vaši síť navrhneme, postavíme a&nbsp;dlouhodobě servisujeme my sami.
            </p>
            <ul className={styles.aboutChecks}>
              <li><img src="/assets/icons/check.svg" alt="" />Licence ČTÚ a&nbsp;certifikace pro slaboproudé práce</li>
              <li><img src="/assets/icons/check.svg" alt="" />Vlastní páteřní síť, ne přeprodej cizí konektivity</li>
              <li><img src="/assets/icons/check.svg" alt="" />Pevné ceny bez závazku na&nbsp;dva roky</li>
              <li><img src="/assets/icons/check.svg" alt="" />24/7 technická podpora s&nbsp;reakcí do&nbsp;hodiny</li>
            </ul>
          </div>
        </div>
      </section>

      <Faq />

      <section className={styles.trust}>
        <div className={layout.container}>
          <div className={styles.trustGrid}>
            {trustStats.map((s, i) => (
              <div key={i}>
                <div className={styles.trustNumber}>{s.v}<em>{s.em}</em></div>
                <div className={styles.trustLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CoverageSection />

      <ContactCta />
    </>
  );
}
