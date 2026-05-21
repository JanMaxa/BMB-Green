import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import service from '../servicePage.module.css';
import styles from './TelevizeContent.module.css';

import { normalizeTelevizeData } from './televizeData.js';

const CHANNELS_API_URL = 'https://admin.geniustv.cz/api/v1/public/channels';

export default function TelevizeContent({ data, editable = false, onFieldChange }) {
  const content = normalizeTelevizeData(data);
  const [activePackageIndex, setActivePackageIndex] = useState(null);
  const [channelsState, setChannelsState] = useState({
    error: '',
    items: [],
    status: 'idle',
  });

  const activePackage = activePackageIndex === null ? null : content.packages[activePackageIndex];
  const activeChannels = activePackage
    ? channelsState.items
      .filter((channel) => channelMatchesPackage(channel, activePackage.apiPackage))
      .sort(compareChannels)
    : [];

  const openPrograms = (index) => {
    setActivePackageIndex(index);
    loadChannels(setChannelsState);
  };

  const closePrograms = () => setActivePackageIndex(null);

  return (
    <div className={cx(editable && styles.contentEditor)}>
      <section className={cx(layout.section, layout.sectionAlt, layout.topSection, service.servicePage)}>
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
                {editable ? (
                  <Button as="div" className={cx(styles.programsButton, styles.buttonEdit)} variant="secondary" block>
                    <EditableText
                      editable
                      value={pkg.programsButtonLabel}
                      onChange={(value) => onFieldChange(['packages', index, 'programsButtonLabel'], value)}
                      ariaLabel="Text tlačítka programů"
                    />
                  </Button>
                ) : (
                  <Button
                    className={styles.programsButton}
                    type="button"
                    variant="secondary"
                    block
                    onClick={() => openPrograms(index)}
                  >
                    {pkg.programsButtonLabel || 'Zobrazit programy'}
                  </Button>
                )}
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
      {activePackage && (
        <ProgramsDialog
          channels={activeChannels}
          onClose={closePrograms}
          packageName={activePackage.name}
          status={channelsState.status}
          error={channelsState.error}
        />
      )}
    </div>
  );
}

function ProgramsDialog({ channels, error, onClose, packageName, status }) {
  return (
    <div className={styles.dialogBackdrop} role="presentation" onClick={onClose}>
      <section
        aria-labelledby="programs-dialog-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.dialogHead}>
          <div>
            <span>Programová nabídka</span>
            <h2 id="programs-dialog-title">{packageName}</h2>
          </div>
          <button aria-label="Zavřít programy" className={styles.dialogClose} type="button" onClick={onClose}>
            ×
          </button>
        </div>

        {status === 'loading' && <p className={styles.dialogState}>Načítáme programy...</p>}
        {status === 'error' && <p className={styles.dialogState}>{error}</p>}
        {status === 'ready' && channels.length === 0 && (
          <p className={styles.dialogState}>Pro tento balíček se nepodařilo najít žádné programy.</p>
        )}
        {status === 'ready' && channels.length > 0 && (
          <div className={styles.channelGrid}>
            {channels.map((channel) => (
              <article className={styles.channelCard} key={channel.id}>
                <div className={styles.channelLogo}>
                  {channel.logo ? <img src={channel.logo} alt="" loading="lazy" /> : <span>{getInitials(channel.nazev)}</span>}
                </div>
                <div>
                  <h3>{channel.nazev}</h3>
                  <p>{channel.kategorie || 'Program'}</p>
                </div>
                {channel.kvalita && <span className={styles.channelQuality}>{channel.kvalita}</span>}
              </article>
            ))}
            </div>
        )}
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

function loadChannels(setChannelsState) {
  setChannelsState((current) => {
    if (current.status === 'loading' || current.status === 'ready') return current;

    fetch(CHANNELS_API_URL, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error('Programy se teď nepodařilo načíst.');
        return response.json();
      })
      .then((items) => {
        setChannelsState({
          error: '',
          items: Array.isArray(items) ? items : [],
          status: 'ready',
        });
      })
      .catch(() => {
        setChannelsState({
          error: 'Programy se teď nepodařilo načíst. Zkuste to prosím později.',
          items: [],
          status: 'error',
        });
      });

    return { ...current, error: '', status: 'loading' };
  });
}

function channelMatchesPackage(channel, packageName) {
  if (!packageName) return false;

  return [
    ...splitPackages(channel.mainPackages),
    ...splitPackages(channel.channelPackages),
  ].includes(packageName);
}

function splitPackages(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function compareChannels(a, b) {
  const orderA = Number.isFinite(a.app_order) ? a.app_order : Number.MAX_SAFE_INTEGER;
  const orderB = Number.isFinite(b.app_order) ? b.app_order : Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) return orderA - orderB;
  return String(a.nazev || '').localeCompare(String(b.nazev || ''), 'cs');
}

function getInitials(name) {
  return String(name || '?').trim().slice(0, 2).toUpperCase();
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
