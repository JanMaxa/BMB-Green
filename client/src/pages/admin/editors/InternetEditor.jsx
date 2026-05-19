import { useCallback, useEffect, useState } from 'react';
import { loadAdminData, saveAdminData } from '../adminApi.js';
import cx from '../../../utils/cx.js';
import styles from '../Admin.module.css';

const endpoint = '/api/internet';

const emptyBenefit = () => ({ icon: 'bolt', title: 'Nová výhoda', text: '' });
const emptyPlan = () => ({ name: 'Nový tarif', speed: '', price: '' });
const emptyCard = () => ({
  title: 'Nový typ internetu',
  desc: '',
  visible: true,
  plans: [emptyPlan()],
});

export default function InternetEditor({ setHeaderAction }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Načítám obsah...');

  useEffect(() => {
    loadAdminData(endpoint)
      .then((loaded) => {
        setData(loaded);
        setStatus('');
      })
      .catch(() => setStatus('Obsah se nepodařilo načíst. Zkontrolujte server.'));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;

    try {
      await saveAdminData(endpoint, data);
      setStatus('Uloženo.');
    } catch {
      setStatus('Uložení se nepodařilo.');
    }
  }, [data]);

  useEffect(() => {
    if (!setHeaderAction) return undefined;

    setHeaderAction(
      <div className={styles.adminTopbarSave}>
        {status && data && <span>{status}</span>}
        <button className={styles.adminPrimary} disabled={!data} onClick={save} type="button">Uložit</button>
      </div>,
    );

    return () => setHeaderAction(null);
  }, [data, save, setHeaderAction, status]);

  if (!data) return <div className={cx(styles.adminStatus, styles.adminStatusPlain)}>{status}</div>;

  const updateObject = (group, key, value) => setData({ ...data, [group]: { ...data[group], [key]: value } });
  const updateItem = (arrayKey, index, key, value) => {
    setData({
      ...data,
      [arrayKey]: data[arrayKey].map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    });
  };
  const updatePlan = (cardIndex, planIndex, key, value) => {
    setData({
      ...data,
      cards: data.cards.map((card, i) => (
        i === cardIndex
          ? { ...card, plans: card.plans.map((plan, j) => (j === planIndex ? { ...plan, [key]: value } : plan)) }
          : card
      )),
    });
  };

  return (
    <div className={styles.adminForm}>
        <div className={styles.adminEditCard}>
          <h3>Hero</h3>
          <label>Nadpis<input value={data.hero.title} onChange={(event) => updateObject('hero', 'title', event.target.value)} /></label>
          <label>Popis<textarea value={data.hero.description} onChange={(event) => updateObject('hero', 'description', event.target.value)} /></label>
          <div className={styles.adminGridTwo}>
            <label>Text tlačítka<input value={data.hero.ctaLabel} onChange={(event) => updateObject('hero', 'ctaLabel', event.target.value)} /></label>
            <label>Odkaz tlačítka<input value={data.hero.ctaHref} onChange={(event) => updateObject('hero', 'ctaHref', event.target.value)} /></label>
          </div>
        </div>

        <div className={cx(styles.adminEditCard, styles.adminDarkPreview)}>
          <h3>Černá karta v hero</h3>
          <div className={styles.adminGridTwo}>
            <label>Štítek<input value={data.highlight.label} onChange={(event) => updateObject('highlight', 'label', event.target.value)} /></label>
            <label>Hlavní hodnota<input value={data.highlight.value} onChange={(event) => updateObject('highlight', 'value', event.target.value)} /></label>
          </div>
          <label>Popis<textarea value={data.highlight.description} onChange={(event) => updateObject('highlight', 'description', event.target.value)} /></label>
        </div>

        <div className={styles.adminListHead}>
          <h3>Výhody</h3>
          <button className={styles.adminSecondary} onClick={() => setData({ ...data, benefits: [...data.benefits, emptyBenefit()] })} type="button">Přidat výhodu</button>
        </div>
        <div className={styles.adminCardList}>
          {data.benefits.map((benefit, index) => (
            <article className={styles.adminEditCard} key={`${benefit.title}-${index}`}>
              <div className={styles.adminCardTitle}>
                <h3>{benefit.title || 'Výhoda'}</h3>
                <button className={styles.adminDanger} onClick={() => setData({ ...data, benefits: data.benefits.filter((_, i) => i !== index) })} type="button">Smazat</button>
              </div>
              <div className={styles.adminGridTwo}>
                <label>Ikona<input value={benefit.icon} onChange={(event) => updateItem('benefits', index, 'icon', event.target.value)} /></label>
                <label>Nadpis<input value={benefit.title} onChange={(event) => updateItem('benefits', index, 'title', event.target.value)} /></label>
              </div>
              <label>Text<textarea value={benefit.text} onChange={(event) => updateItem('benefits', index, 'text', event.target.value)} /></label>
            </article>
          ))}
        </div>

        <div className={styles.adminListHead}>
          <h3>Internetové karty</h3>
          <button className={styles.adminSecondary} onClick={() => setData({ ...data, cards: [...data.cards, emptyCard()] })} type="button">Přidat kartu</button>
        </div>
        <div className={styles.adminCardList}>
          {data.cards.map((card, cardIndex) => (
            <article className={styles.adminEditCard} key={`${card.title}-${cardIndex}`}>
              <div className={styles.adminCardTitle}>
                <h3>{card.title || 'Karta'}</h3>
                <button className={styles.adminDanger} onClick={() => setData({ ...data, cards: data.cards.filter((_, i) => i !== cardIndex) })} type="button">Smazat</button>
              </div>
              <div className={styles.adminGridTwo}>
                <label>Nadpis<input value={card.title} onChange={(event) => updateItem('cards', cardIndex, 'title', event.target.value)} /></label>
              </div>
              <label>Popis<textarea value={card.desc} onChange={(event) => updateItem('cards', cardIndex, 'desc', event.target.value)} /></label>
              <div className={styles.adminCheckRow}>
                <label><input type="checkbox" checked={card.visible !== false} onChange={(event) => updateItem('cards', cardIndex, 'visible', event.target.checked)} /> Viditelná</label>
              </div>
              <div className={styles.adminNestedHead}>
                <strong>Tarify</strong>
                <button
                  className={styles.adminSecondary}
                  onClick={() => updateItem('cards', cardIndex, 'plans', [...card.plans, emptyPlan()])}
                  type="button"
                >
                  Přidat tarif
                </button>
              </div>
              {card.plans.map((plan, planIndex) => (
                <div className={styles.adminNestedRow} key={`${plan.name}-${planIndex}`}>
                  <input value={plan.name} onChange={(event) => updatePlan(cardIndex, planIndex, 'name', event.target.value)} placeholder="Název" />
                  <input value={plan.speed} onChange={(event) => updatePlan(cardIndex, planIndex, 'speed', event.target.value)} placeholder="Rychlost" />
                  <input value={plan.price} onChange={(event) => updatePlan(cardIndex, planIndex, 'price', event.target.value)} placeholder="Cena" />
                  <button className={styles.adminDanger} onClick={() => updateItem('cards', cardIndex, 'plans', card.plans.filter((_, i) => i !== planIndex))} type="button">Smazat</button>
                </div>
              ))}
            </article>
          ))}
        </div>

        <div className={styles.adminEditCard}>
          <h3>xDSL / WS</h3>
          <label>Řádky<textarea value={data.legacyPlans.join('\n')} onChange={(event) => setData({ ...data, legacyPlans: event.target.value.split('\n').filter(Boolean) })} /></label>
        </div>

        <div className={styles.adminCardList}>
          {data.infoCards.map((card, index) => (
            <article className={styles.adminEditCard} key={`${card.title}-${index}`}>
              <h3>{card.title}</h3>
              <label>Nadpis<input value={card.title} onChange={(event) => updateItem('infoCards', index, 'title', event.target.value)} /></label>
              <label>Text<textarea value={card.text} onChange={(event) => updateItem('infoCards', index, 'text', event.target.value)} /></label>
            </article>
          ))}
        </div>
    </div>
  );
}
