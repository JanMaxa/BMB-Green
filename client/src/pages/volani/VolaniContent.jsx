import Button from '../../components/Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';
import { normalizeVolaniData } from './volaniData.js';

const BENEFIT_ICONS = ['check', 'bolt', 'clock', 'wifi'];

export default function VolaniContent({ data, editable = false, onFieldChange }) {
  const content = normalizeVolaniData(data);

  const updateRate = (cardIndex, rateIndex, key, value) =>
    onFieldChange(['pricingCards', cardIndex, 'rates', rateIndex, key], value);

  return (
    <div className={cx(editable && service.contentEditor)}>
      <section className={cx(layout.section, layout.topSection, layout.topGradient, service.servicePage)}>
        <div className={layout.container}>

          <div className={service.serviceHero}>
            <div>
              <h1>
                <EditableText
                  editable={editable}
                  value={content.hero.title}
                  onChange={(value) => onFieldChange(['hero', 'title'], value)}
                  ariaLabel="Nadpis"
                />
              </h1>
              <p>
                <EditableTextarea
                  editable={editable}
                  value={content.hero.description}
                  onChange={(value) => onFieldChange(['hero', 'description'], value)}
                  ariaLabel="Popis"
                />
              </p>
              {editable ? (
                <Button as="div" size="lg" className={service.buttonEdit}>
                  <EditableText
                    editable
                    value={content.hero.ctaLabel}
                    onChange={(value) => onFieldChange(['hero', 'ctaLabel'], value)}
                    ariaLabel="Text tlačítka"
                  />
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </Button>
              ) : (
                <Button as="a" size="lg" href={content.hero.ctaHref}>
                  {content.hero.ctaLabel}
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </Button>
              )}
            </div>
          </div>

          <div className={service.serviceBenefits}>
            {content.benefits.map((item, index) => (
              <div className={service.serviceBenefit} key={`${BENEFIT_ICONS[index]}-${index}`}>
                <div className={service.serviceBenefitIcon}>
                  <img src={`/assets/icons/${BENEFIT_ICONS[index]}.svg`} alt="" />
                </div>
                <div>
                  <h3>
                    <EditableText
                      editable={editable}
                      value={item.title}
                      onChange={(value) => onFieldChange(['benefits', index, 'title'], value)}
                      ariaLabel="Nadpis výhody"
                    />
                  </h3>
                  <p>
                    <EditableTextarea
                      editable={editable}
                      value={item.text}
                      onChange={(value) => onFieldChange(['benefits', index, 'text'], value)}
                      ariaLabel="Text výhody"
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={service.serviceTariffs} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {content.pricingCards.map((card, cardIndex) => (
              <article className={service.serviceTariffCard} key={`${card.title}-${cardIndex}`}>
                <h2>
                  <EditableText
                    editable={editable}
                    value={card.title}
                    onChange={(value) => onFieldChange(['pricingCards', cardIndex, 'title'], value)}
                    ariaLabel="Nadpis sítě"
                  />
                </h2>
                <p>
                  <EditableTextarea
                    editable={editable}
                    value={card.desc}
                    onChange={(value) => onFieldChange(['pricingCards', cardIndex, 'desc'], value)}
                    ariaLabel="Popis sítě"
                  />
                </p>
                <div className={service.servicePlanList}>
                  {card.rates.map((rate, rateIndex) => (
                    <div className={service.servicePlan} key={`${rate.label}-${rateIndex}`}>
                      <div>
                        <strong>
                          <EditableText
                            editable={editable}
                            value={rate.label}
                            onChange={(value) => updateRate(cardIndex, rateIndex, 'label', value)}
                            ariaLabel="Název tarifu"
                          />
                        </strong>
                      </div>
                      <em>
                        <EditableText
                          editable={editable}
                          value={rate.price}
                          onChange={(value) => updateRate(cardIndex, rateIndex, 'price', value)}
                          ariaLabel="Cena tarifu"
                        />
                        <small>/min</small>
                      </em>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className={cx(layout.section, layout.sectionAlt)}>
        <div className={layout.container}>
          <div className={layout.sectionHead}>
            <h2>
              <EditableText
                editable={editable}
                value={content.whySection.title}
                onChange={(value) => onFieldChange(['whySection', 'title'], value)}
                ariaLabel="Nadpis sekce proč"
              />
            </h2>
            <p>
              <EditableTextarea
                editable={editable}
                value={content.whySection.description}
                onChange={(value) => onFieldChange(['whySection', 'description'], value)}
                ariaLabel="Popis sekce proč"
              />
            </p>
          </div>
          <div className={service.whyGrid}>
            {content.whySection.cards.map((card, index) => (
              <article className={service.whyCard} key={`${card.icon}-${index}`}>
                <div style={{ alignItems: 'center', background: 'var(--green-500)', borderRadius: '10px', display: 'flex', flexShrink: 0, height: '42px', justifyContent: 'center', marginBottom: '18px', width: '42px' }}>
                  <img style={{ filter: 'brightness(0) invert(1)', height: '21px', width: '21px' }} src={`/assets/icons/${card.icon}.svg`} alt="" />
                </div>
                <h3>
                  <EditableText
                    editable={editable}
                    value={card.title}
                    onChange={(value) => onFieldChange(['whySection', 'cards', index, 'title'], value)}
                    ariaLabel="Nadpis karty proč"
                  />
                </h3>
                <p>
                  <EditableTextarea
                    editable={editable}
                    value={card.text}
                    onChange={(value) => onFieldChange(['whySection', 'cards', index, 'text'], value)}
                    ariaLabel="Text karty proč"
                  />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EditableText({ editable, value, onChange, ariaLabel }) {
  if (!editable) return value;

  return (
    <input
      aria-label={ariaLabel}
      className={service.editField}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function EditableTextarea({ editable, value, onChange, ariaLabel }) {
  if (!editable) return value;

  return (
    <textarea
      aria-label={ariaLabel}
      className={cx(service.editField, service.editArea)}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
