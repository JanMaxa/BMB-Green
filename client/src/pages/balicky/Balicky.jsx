import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import PackagesSection from '../../components/PackagesSection/PackagesSection.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';

export default function Balicky() {
  return (
    <>
      <PackagesSection />
      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={layout.container}>
          <div className={layout.sectionHead}>
            <h2>Proč zvolit balíček od BMB-Green?</h2>
            <p>Internet i televize od jednoho poskytovatele znamenají jednodušší správu, výhodnější cenu a jedno místo, kam se obrátit.</p>
          </div>
          <div className={service.whyGrid}>
            <article className={service.whyCard}>
              <img src="/assets/icons/check.svg" alt="" />
              <h3>Jedna smlouva, jedna podpora</h3>
              <p>Internet i BMB-IPTV řešíte dohromady u stejného týmu, bez přehazování odpovědnosti mezi dodavateli.</p>
            </article>
            <article className={service.whyCard}>
              <img src="/assets/icons/tv.svg" alt="" />
              <h3>Výhodnější kombinace služeb</h3>
              <p>Balíčky spojují rychlý Internet s televizní nabídkou Mini, Basic nebo Max za zvýhodněnou cenu.</p>
            </article>
            <article className={service.whyCard}>
              <img src="/assets/icons/wifi.svg" alt="" />
              <h3>Vhodné řešení podle adresy</h3>
              <p>Nejdřív ověříme dostupnost a následně doporučíme kombinaci, která dává technicky i cenově smysl.</p>
            </article>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
