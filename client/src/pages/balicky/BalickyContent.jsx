import Button from '../../components/Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';
import packageStyles from '../../components/PackagesSection/PackagesSection.module.css';
import { normalizeBalickyData } from './balickyData.js';

export default function BalickyContent({ data, editable = false, onFieldChange }) {
  const content = normalizeBalickyData(data);
  const bundles = content.bundles;

  const updateBundle = (index, key, value) => onFieldChange(['bundles', index, key], value);

  return (
    <div className={cx(editable && service.contentEditor)}>
      <section className={cx(layout.section, layout.topSection, layout.topGradient)}>
        <div className={layout.container}>
          <div className={layout.sectionHead}>
            <h2>
              <EditableText
                editable={editable}
                value={content.bundleSection.title}
                onChange={(value) => onFieldChange(['bundleSection', 'title'], value)}
                ariaLabel="Nadpis sekce"
              />
            </h2>
            <p>
              <EditableTextarea
                editable={editable}
                value={content.bundleSection.description}
                onChange={(value) => onFieldChange(['bundleSection', 'description'], value)}
                ariaLabel="Popis sekce"
              />
            </p>
          </div>

          <div className={packageStyles.packageGrid}>
            {bundles.map((bundle, index) => (
              <div key={`${bundle.name}-${index}`} className={packageStyles.packageCard}>
                <div className={packageStyles.name}>
                  <EditableText
                    editable={editable}
                    value={bundle.name}
                    onChange={(value) => updateBundle(index, 'name', value)}
                    ariaLabel="Název balíčku"
                  />
                </div>
                <div className={packageStyles.speed}>
                  <EditableText
                    editable={editable}
                    value={bundle.internet}
                    onChange={(value) => updateBundle(index, 'internet', value)}
                    ariaLabel="Rychlost internetu"
                  />
                </div>
                <div className={packageStyles.price}>
                  <span className={packageStyles.priceValue}>
                    <EditableText
                      editable={editable}
                      value={bundle.price}
                      onChange={(value) => updateBundle(index, 'price', value)}
                      ariaLabel="Cena"
                    />
                  </span>
                  <span className={packageStyles.priceUnit}>{content.bundleSection.priceUnit}</span>
                </div>

                {editable ? (
                  <EditableTextarea
                    editable
                    value={(bundle.features || []).join('\n')}
                    onChange={(value) => updateBundle(index, 'features', value.split('\n').filter(Boolean))}
                    ariaLabel="Vlastnosti balíčku"
                  />
                ) : (
                  <ul className={packageStyles.features}>
                    {bundle.features.map((feature) => (
                      <li key={feature}><img src="/assets/icons/check.svg" alt="" />{feature}</li>
                    ))}
                  </ul>
                )}

                <Button
                  as={editable ? 'div' : 'a'}
                  href={editable ? undefined : '/kontakty?reason=zajem-o-sluzby&service=internet'}
                  className={cx(packageStyles.cta, editable && service.buttonEdit)}
                  variant="secondary"
                  block
                >
                  <EditableText
                    editable={editable}
                    value={content.bundleSection.ctaLabel}
                    onChange={(value) => onFieldChange(['bundleSection', 'ctaLabel'], value)}
                    ariaLabel="Text tlačítka"
                  />
                </Button>
              </div>
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
