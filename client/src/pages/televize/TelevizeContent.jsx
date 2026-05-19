import Button from '../../components/Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';
import styles from './TelevizeContent.module.css';

import { normalizeTelevizeData } from './televizeData.js';

export default function TelevizeContent({ data, editable = false, onFieldChange }) {
  const content = normalizeTelevizeData(data);

  return (
    <div className={cx(editable && styles.contentEditor)}>
      <section className={cx(layout.section, layout.sectionAlt, service.servicePage)}>
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
                <Button as="div" size="lg" className={styles.buttonEdit}>
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
            <div className={cx(service.serviceHighlight, styles.darkEdit)}>
              <span>
                <EditableText
                  editable={editable}
                  value={content.highlight.label}
                  onChange={(value) => onFieldChange(['highlight', 'label'], value)}
                  ariaLabel="Štítek zvýraznění"
                />
              </span>
              <strong>
                <EditableText
                  editable={editable}
                  value={content.highlight.value}
                  onChange={(value) => onFieldChange(['highlight', 'value'], value)}
                  ariaLabel="Hlavní hodnota"
                />
              </strong>
              <p>
                <EditableTextarea
                  editable={editable}
                  value={content.highlight.description}
                  onChange={(value) => onFieldChange(['highlight', 'description'], value)}
                  ariaLabel="Popis zvýraznění"
                />
              </p>
            </div>
          </div>

          <div className={service.serviceBenefits}>
            {content.features.map((item, index) => (
              <div className={service.serviceBenefit} key={`${item.icon}-${index}`}>
                <div className={service.serviceBenefitIcon}><img src={`/assets/icons/${item.icon}.svg`} alt="" /></div>
                <div>
                  <h3>
                    <EditableText
                      editable={editable}
                      value={item.title}
                      onChange={(value) => onFieldChange(['features', index, 'title'], value)}
                      ariaLabel="Nadpis výhody"
                    />
                  </h3>
                  <p>
                    <EditableTextarea
                      editable={editable}
                      value={item.text}
                      onChange={(value) => onFieldChange(['features', index, 'text'], value)}
                      ariaLabel="Text výhody"
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={service.tvPackageGrid}>
            {content.packages.map((pkg, index) => (
              <article className={service.tvPackageCard} key={`${pkg.name}-${index}`}>
                <h2>
                  <EditableText
                    editable={editable}
                    value={pkg.name}
                    onChange={(value) => onFieldChange(['packages', index, 'name'], value)}
                    ariaLabel="Název balíčku"
                  />
                </h2>
                <div className={service.tvPackageCount}>
                  <EditableText
                    editable={editable}
                    value={pkg.channels}
                    onChange={(value) => onFieldChange(['packages', index, 'channels'], value)}
                    ariaLabel="Počet programů"
                  />
                </div>
                <p>
                  <EditableText
                    editable={editable}
                    value={pkg.hd}
                    onChange={(value) => onFieldChange(['packages', index, 'hd'], value)}
                    ariaLabel="HD programy"
                  />
                </p>
                <strong>
                  <EditableText
                    editable={editable}
                    value={pkg.price}
                    onChange={(value) => onFieldChange(['packages', index, 'price'], value)}
                    ariaLabel="Cena"
                  />
                  <small>/měsíc</small>
                </strong>
                <p>
                  <EditableTextarea
                    editable={editable}
                    value={pkg.desc}
                    onChange={(value) => onFieldChange(['packages', index, 'desc'], value)}
                    ariaLabel="Popis balíčku"
                  />
                </p>
              </article>
            ))}
          </div>

          <div className={service.serviceInfoGrid}>
            {content.infoCards.map((card, index) => (
              <div className={service.serviceNote} key={`${card.title}-${index}`}>
                <h2>
                  <EditableText
                    editable={editable}
                    value={card.title}
                    onChange={(value) => onFieldChange(['infoCards', index, 'title'], value)}
                    ariaLabel="Nadpis informační karty"
                  />
                </h2>
                <p>
                  <EditableTextarea
                    editable={editable}
                    value={card.text}
                    onChange={(value) => onFieldChange(['infoCards', index, 'text'], value)}
                    ariaLabel="Text informační karty"
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={layout.section}>
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
                <img src={`/assets/icons/${card.icon}.svg`} alt="" />
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
      className={styles.editField}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function EditableTextarea({ editable, value, onChange, ariaLabel }) {
  if (!editable) return value;

  return (
    <textarea
      aria-label={ariaLabel}
      className={cx(styles.editField, styles.editArea)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
