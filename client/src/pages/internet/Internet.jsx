import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Internet() {
  const [internetData, setInternetData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/internet`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setInternetData(data))
      .catch(() => {});
  }, []);

  return (
    <>
      {internetData && (
        <section className={cx(layout.section, layout.sectionAlt, service.servicePage)}>
          <div className={layout.container}>
            <div className={service.serviceHero}>
              <div>
                <h1>{internetData.hero.title}</h1>
                <p>{internetData.hero.description}</p>
                <Button as="a" size="lg" href={internetData.hero.ctaHref}>
                  {internetData.hero.ctaLabel}
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </Button>
              </div>
              <div className={service.serviceHighlight}>
                <span>{internetData.highlight.label}</span>
                <strong>{internetData.highlight.value}</strong>
                <p>{internetData.highlight.description}</p>
              </div>
            </div>

            <div className={service.serviceBenefits}>
              {internetData.benefits.map((item, index) => (
                <div className={service.serviceBenefit} key={`${item.title}-${index}`}>
                  <div className={service.serviceBenefitIcon}><img src={`/assets/icons/${item.icon}.svg`} alt="" /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={service.serviceTariffs}>
              {internetData.cards.filter((tech) => tech.visible !== false).map((tech, index) => (
                <article className={service.serviceTariffCard} key={`${tech.title}-${index}`}>
                  <h2>{tech.title}</h2>
                  <p>{tech.desc}</p>
                  <div className={service.servicePlanList}>
                    {tech.plans.map((plan, planIndex) => (
                      <div className={service.servicePlan} key={`${plan.name}-${planIndex}`}>
                        <div>
                          <strong>{plan.name}</strong>
                          <span>rychlost {plan.speed}</span>
                        </div>
                        <em>{plan.price}<small>/měsíc</small></em>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className={service.serviceInfoGrid}>
              {internetData.infoCards.map((card, index) => (
                <div className={cx(service.serviceNote, card.muted && service.serviceNoteMuted)} key={`${card.title}-${index}`}>
                  <h2>{card.title}</h2>
                  {card.muted ? (
                    <ul>
                      {internetData.legacyPlans.map((plan, index) => <li key={`${plan}-${index}`}>{plan}</li>)}
                    </ul>
                  ) : (
                    <p>{card.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className={layout.section}>
        <div className={layout.container}>
          <div className={layout.sectionHead}>
            <h2>Proč si vybrat Internet od BMB-Green?</h2>
            <p>Lokální síť, rychlá instalace a technologie vybraná podle konkrétní adresy. Neprodáváme univerzální slib, ale dostupné řešení.</p>
          </div>
          <div className={service.whyGrid}>
            <article className={service.whyCard}>
              <img src="/assets/icons/fiber.svg" alt="" />
              <h3>Vlastní síť a lokální znalost</h3>
              <p>BMB-Green dlouhodobě buduje a provozuje vlastní přístupovou síť v lokalitách, které obsluhuje.</p>
            </article>
            <article className={service.whyCard}>
              <img src="/assets/icons/clock.svg" alt="" />
              <h3>Rychlé zřízení služby</h3>
              <p>U dostupných adres zvládneme běžnou instalaci obvykle v horizontu 2-3 pracovních dnů.</p>
            </article>
            <article className={service.whyCard}>
              <img src="/assets/icons/shield-check.svg" alt="" />
              <h3>Technologie podle reality</h3>
              <p>Optika, kabelová síť, Wi-Fi nebo xDSL. Vybereme variantu podle dostupnosti a potřeb domácnosti.</p>
            </article>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
