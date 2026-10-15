import Button from '../../components/Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';
import { normalizeInternetData } from './internetData.js';
import EditableTextField from '../../components/EditableText/EditableText.jsx';

const BENEFIT_ICONS = ['bolt', 'clock', 'shield-check', 'wifi'];
const WHY_ICONS = ['fiber', 'clock', 'shield-check', 'wifi', 'check', 'bolt'];

export default function InternetContent({ data, editable = false, onFieldChange }) {
  const content = normalizeInternetData(data);
  const cards = content.cards;

  const updateCard = (index, key, value) => onFieldChange(['cards', index, key], value);
  const updatePlan = (cardIndex, planIndex, key, value) => onFieldChange(['cards', cardIndex, 'plans', planIndex, key], value);

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
                <div className={service.serviceBenefitIcon}><img src={`/assets/icons/${BENEFIT_ICONS[index]}.svg`} alt="" /></div>
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

          <div className={service.serviceTariffs}>
            {cards.map((tech, index) => (
              <article className={service.serviceTariffCard} key={`${tech.title}-${index}`}>
                <h2>
                  <EditableText
                    editable={editable}
                    value={tech.title}
                    onChange={(value) => updateCard(index, 'title', value)}
                    ariaLabel="Nadpis internetové karty"
                  />
                </h2>
                <p>
                  <EditableTextarea
                    editable={editable}
                    value={tech.desc}
                    onChange={(value) => updateCard(index, 'desc', value)}
                    ariaLabel="Popis internetové karty"
                  />
                </p>
                <div className={service.servicePlanList}>
                  {tech.plans.map((plan, planIndex) => (
                    <div className={service.servicePlan} key={`${plan.name}-${planIndex}`}>
                      <div>
                        <strong>
                          <EditableText
                            editable={editable}
                            value={plan.name}
                            onChange={(value) => updatePlan(index, planIndex, 'name', value)}
                            ariaLabel="Název tarifu"
                          />
                        </strong>
                        <span>
                          rychlost{' '}
                          <EditableText
                            editable={editable}
                            value={plan.speed}
                            onChange={(value) => updatePlan(index, planIndex, 'speed', value)}
                            ariaLabel="Rychlost tarifu"
                          />
                        </span>
                      </div>
                      <em>
                        <EditableText
                          editable={editable}
                          value={plan.price}
                          onChange={(value) => updatePlan(index, planIndex, 'price', value)}
                          ariaLabel="Cena tarifu"
                        />
                        <small>/měsíc</small>
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
              <article className={service.whyCard} key={`${WHY_ICONS[index]}-${index}`}>
                <div style={{ alignItems: 'center', background: 'var(--green-500)', borderRadius: '10px', display: 'flex', flexShrink: 0, height: '42px', justifyContent: 'center', marginBottom: '18px', width: '42px' }}>
                  <img style={{ filter: 'brightness(0) invert(1)', height: '21px', width: '21px' }} src={`/assets/icons/${WHY_ICONS[index]}.svg`} alt="" />
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

function EditableText(props) {
  return <EditableTextField className={service.editField} {...props} />;
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
