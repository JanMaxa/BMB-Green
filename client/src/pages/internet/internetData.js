export const defaultInternetData = {
  hero: {
    title: 'Kvalitní internetové připojení',
    description: 'Internet na doma, do bytu i na chalupu. Podle adresy vybereme vhodnou technologii, ověříme dostupnost a připravíme instalaci včetně potřebného zařízení.',
    ctaLabel: 'Nezávazně poptat',
    ctaHref: '/kontakty',
  },
  benefits: [
    {
      title: 'Až 220 Mb/s',
      text: 'Nejrychlejší běžná nabídka pro domácnosti v síti BMB.',
    },
    {
      title: 'Instalace 2-3 dny',
      text: 'Rychlé zřízení služby podle dostupnosti na adrese.',
    },
    {
      title: 'Stabilní připojení',
      text: 'Vlastní síť a technologie zvolené podle lokality.',
    },
    {
      title: 'Hardware k zapůjčení',
      text: 'Modem nebo Wi-Fi Gateway v rámci 24měsíční smlouvy.',
    },
  ],
  cards: [
    {
      title: 'Internet přes optiku',
      desc: 'FTTH připojení pro domácnosti, kde je dostupná optická síť.',
      plans: [
        {
          name: 'Internet i110M',
          speed: '110 / 55 Mb/s',
          price: '483 Kč',
        },
        {
          name: 'Internet i220M',
          speed: '220 / 110 Mb/s',
          price: '706 Kč',
        },
      ],
    },
    {
      title: 'Internet přes kabelovou televizi',
      desc: 'Připojení přes kabelovou síť s vysokou stabilitou a rychlostí až 220 Mb/s.',
      plans: [
        {
          name: 'Internet i110M',
          speed: '110 / 11 Mb/s',
          price: '483 Kč',
        },
        {
          name: 'Internet i220M',
          speed: '220 / 22 Mb/s',
          price: '706 Kč',
        },
      ],
    },
    {
      title: 'Internet přes Wi-Fi',
      desc: 'Bezdrátová varianta pro adresy, kde dává největší smysl pokrytí přes 5GHz síť.',
      plans: [
        {
          name: 'Internet i16M',
          speed: '16 / 8 Mb/s',
          price: '483 Kč',
        },
        {
          name: 'Internet i25M',
          speed: '25 / 13 Mb/s',
          price: '706 Kč',
        },
      ],
    },
  ],
  whySection: {
    title: 'Proč si vybrat Internet od BMB-Green?',
    description: 'Lokální síť, rychlá instalace a technologie vybraná podle konkrétní adresy. Neprodáváme univerzální slib, ale dostupné řešení.',
    cards: [
      {
        title: 'Vlastní síť a lokální znalost',
        text: 'BMB-Green dlouhodobě buduje a provozuje vlastní přístupovou síť v lokalitách, které obsluhuje.',
      },
      {
        title: 'Rychlé zřízení služby',
        text: 'U dostupných adres zvládneme běžnou instalaci obvykle v horizontu 2-3 pracovních dnů.',
      },
      {
        title: 'Technologie podle reality',
        text: 'Optika, kabelová síť, Wi-Fi nebo xDSL. Vybereme variantu podle dostupnosti a potřeb domácnosti.',
      },
      {
        title: 'Modem nebo Gateway v ceně',
        text: 'Při 24měsíční smlouvě zapůjčíme potřebné zařízení bez dodatečného poplatku za pronájem.',
      },
      {
        title: 'Žádné skryté poplatky',
        text: 'Cena tarifu je cena, kterou platíte. Aktivační podmínky sdělujeme předem, bez překvapení ve faktuře.',
      },
      {
        title: 'Lokální podpora bez fronty',
        text: 'Poruchu nebo dotaz řešíte s místním týmem, ne s call centrem vzdáleného operátora.',
      },
    ],
  },
};

export function normalizeInternetData(loaded) {
  return {
    hero: { ...defaultInternetData.hero, ...(loaded?.hero || {}) },
    benefits: normalizeArray(defaultInternetData.benefits, loaded?.benefits, emptyBenefit),
    cards: normalizeCards(loaded?.cards),
    whySection: {
      ...defaultInternetData.whySection,
      ...(loaded?.whySection || {}),
      cards: normalizeArray(defaultInternetData.whySection.cards, loaded?.whySection?.cards, emptyWhyCard),
    },
  };
}

function emptyBenefit() {
  return {
    title: 'Nová výhoda',
    text: '',
  };
}

function emptyPlan() {
  return {
    name: 'Nový tarif',
    speed: '',
    price: '',
  };
}

function emptyInternetCard() {
  return {
    title: 'Nový typ internetu',
    desc: '',
    plans: [emptyPlan()],
  };
}

function emptyWhyCard() {
  return {
    title: '',
    text: '',
  };
}

function normalizeCards(loadedCards) {
  const source = Array.isArray(loadedCards) ? loadedCards : defaultInternetData.cards;

  return source.map((card, index) => ({
    ...(defaultInternetData.cards[index] || emptyInternetCard()),
    ...card,
    plans: normalizeArray(defaultInternetData.cards[index]?.plans || [emptyPlan()], card?.plans, emptyPlan),
  }));
}

function normalizeArray(fallbackItems, loadedItems, emptyItem) {
  const source = Array.isArray(loadedItems) ? loadedItems : fallbackItems;

  return source.map((item, index) => ({
    ...(fallbackItems[index] || emptyItem()),
    ...item,
  }));
}
