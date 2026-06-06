import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import CoverageSection from '../../components/CoverageSection/CoverageSection.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import Faq from '../../components/Faq/Faq.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './Landing.module.css';
import heroImage from '../../assets/hero.webp';
import aboutImage from '../../assets/about.webp';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

const featureItems = [
  { icon: 'bolt',     t: 'Nejrychlejší Internet',   d: 'Optika a bezdrát 5 GHz, symetricky až 1 Gb/s.' },
  { icon: 'clock',    t: 'Instalace do 2–3 dnů',    d: 'Rychlá montáž bez čekání na techniky.' },
  { icon: 'building', t: 'Developerské projekty',   d: 'Slaboproudá infrastruktura na klíč.' },
  { icon: 'map-pin',  t: 'Tradice od roku 1991',    d: 'Česká firma se sídlem v Praze 6.' },
];

const services = [
  { icon: 'wifi',         title: 'Internet',         slug: 'internet',          desc: 'Rychlé a spolehlivé připojení pro domácnosti i firmy. Prostě internet, který funguje.' },
  { icon: 'tv',           title: 'Televize',         slug: 'televize',          desc: 'Stovky kanálů, zpětné přehrávání a sledování na více zařízeních najednou.' },
  { icon: 'phone',        title: 'Volání',           slug: 'volani',            desc: 'Pevná linka přes internet. Volejte v celé ČR výhodněji bez zbytečného paušálu.' },
  { icon: 'shield-check', title: 'Zabezpečení',      slug: 'zabezpeceni',       desc: 'EZS a přístupové systémy. Hlídáme vaši nemovitost i na dálku.' },
  { icon: 'sun',          title: 'Fotovoltaika',     slug: 'fotovoltaika',      desc: 'FVE od návrhu po instalaci. Postaráme se i o dotace za vás.' },
  { icon: 'fiber',        title: 'Sítě a kabeláž',   slug: 'site-a-kabelaz',    desc: 'Pokládáme datové rozvody a síťovou infrastrukturu pro domy i větší projekty.' },
  { icon: 'camera',       title: 'Kamerové systémy', slug: 'kamerove-systemy',  desc: 'Přehled o své nemovitosti odkudkoliv mimo jiné i přes telefon. Záznamy uložené bezpečně na místě.' },
  { icon: 'building',     title: 'Pro developery',   slug: 'pro-developery',    desc: 'Kompletní technické vybavení pro nové projekty — od první schůzky až po předání.' },
];

export default function Landing() {
  const [totalConnections, setTotalConnections] = useState(100);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/locations`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.locations) return;
        const total = data.locations.reduce((sum, loc) => sum + (Number(loc.connections) || 0), 0);
        if (total > 0) setTotalConnections(total);
      })
      .catch(() => {});
  }, []);

  const trustStats = [
    { v: String(new Date().getFullYear() - 1991), em: 'let', l: 'na trhu od roku 1991' },
    { v: formatThousands(totalConnections), em: '+',  l: 'aktivních přípojek' },
    { v: '99', em: '%',  l: 'dostupnost sítě' },
    { v: '24/7',  em: '',   l: 'technická podpora' },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={cx(layout.container, styles.heroGrid)}>
          <div>
            <h1>
              Stabilní internet pro <em>domácnosti</em>. A&nbsp;ještě k&nbsp;tomu televize.
            </h1>
            <p className={styles.heroLead}>
              Rychlý Internet, digitální televize a&nbsp;levné volání pro byty, rodinné domy
              a&nbsp;developerské projekty v&nbsp;Praze a&nbsp;okolí.
              Instalace do 2–3&nbsp;pracovních dnů.
            </p>
            <div className={styles.heroActions}>
              <Button as="a" href="/balicky" variant="secondary" size="lg">Prohlédnout tarify</Button>
              <Button as="a" href="/kontakty" size="lg">
                Konzultovat možnosti
                <img src="/assets/icons/arrow-right.svg" alt="" />
              </Button>
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
                <a className={styles.serviceLink} href={`/kontakty?reason=zajem-o-sluzby&service=${s.slug}`}>
                  Nezávazně poptat
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={layout.section}>
        <div className={cx(layout.container, styles.about)}>
          <div className={styles.aboutImage}>
            <img src={aboutImage} alt="Síťová a optická infrastruktura" />
          </div>
          <div className={styles.aboutContent}>
            <h2>Stavíme sítě, kterým můžete věřit.</h2>
            <p>
              BMB-Green je česká společnost se&nbsp;sídlem na&nbsp;Praze&nbsp;6.
              Od&nbsp;roku 1991 budujeme optické a&nbsp;bezdrátové sítě, instalujeme bezpečnostní
              a&nbsp;fotovoltaické systémy pro domácnosti, firmy i&nbsp;developery.
            </p>
            <p>
              Máme vlastní tým techniků s&nbsp;technickou podporou dostupnou 24/7.
              Nejsme přeprodejci — Vaši síť navrhneme, postavíme a&nbsp;dlouhodobě servisujeme my sami.
            </p>
            <ul className={styles.aboutChecks}>
              <li><img src="/assets/icons/check.svg" alt="" />Vlastní tým techniků působící přímo v&nbsp;lokalitách, které obsluhujeme</li>
              <li><img src="/assets/icons/check.svg" alt="" />Pevné ceny bez závazku na&nbsp;dva roky</li>
              <li><img src="/assets/icons/check.svg" alt="" />24/7 technická podpora</li>
            </ul>
          </div>
        </div>
      </section>

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

      <Faq />

      <ContactCta />
    </>
  );
}

function formatThousands(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
