export const defaultInternetData = {
  hero: {
    title: 'Kvalitní internetové připojení pro domácnosti',
    description: 'Internet na doma, do bytu i na chalupu. Podle adresy vybereme vhodnou technologii, ověříme dostupnost a připravíme instalaci včetně potřebného zařízení.',
    ctaLabel: 'Nezávazně poptat',
    ctaHref: '/kontakty',
  },
  highlight: {
    label: 'Nejrychlejší tarif',
    value: '220 / 110 Mb/s',
    description: 'Optické připojení i220M pro adresy s dostupnou optickou sítí.',
  },
  benefits: [
    {
      icon: 'bolt',
      title: 'Až 220 Mb/s',
      text: 'Nejrychlejší běžná nabídka pro domácnosti v síti BMB.',
    },
    {
      icon: 'clock',
      title: 'Instalace 2-3 dny',
      text: 'Rychlé zřízení služby podle dostupnosti na adrese.',
    },
    {
      icon: 'shield-check',
      title: 'Stabilní připojení',
      text: 'Vlastní síť a technologie zvolené podle lokality.',
    },
    {
      icon: 'wifi',
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
  legacyPlans: [
    'xDSL mini WS: 2 / 0,25 Mb/s, 399 Kč',
    'xDSL aktiv WS: 20 / 2 Mb/s, 449 Kč',
    'xDSL extra WS: 40 / 2 Mb/s, 549 Kč',
    'Classic WS varianty od 199 Kč měsíčně',
  ],
  infoCards: [
    {
      title: 'Instalace a zařízení',
      text: 'Cena instalace je zvýhodněna při sjednání služby na 24 měsíců. Modem nebo Wi-Fi Gateway zapůjčíme podle vybrané služby.',
      muted: false,
    },
    {
      title: 'Doplňkové služby',
      text: 'Pevná veřejná IP adresa je dostupná za 120 Kč měsíčně a hodí se pro vlastní servery, kamery nebo pokročilé síťové použití.',
      muted: false,
    },
    {
      title: 'xDSL / WS',
      text: '',
      muted: true,
    },
  ],
  whySection: {
    title: 'Proč si vybrat Internet od BMB-Green?',
    description: 'Lokální síť, rychlá instalace a technologie vybraná podle konkrétní adresy. Neprodáváme univerzální slib, ale dostupné řešení.',
    cards: [
      {
        icon: 'fiber',
        title: 'Vlastní síť a lokální znalost',
        text: 'BMB-Green dlouhodobě buduje a provozuje vlastní přístupovou síť v lokalitách, které obsluhuje.',
      },
      {
        icon: 'clock',
        title: 'Rychlé zřízení služby',
        text: 'U dostupných adres zvládneme běžnou instalaci obvykle v horizontu 2-3 pracovních dnů.',
      },
      {
        icon: 'shield-check',
        title: 'Technologie podle reality',
        text: 'Optika, kabelová síť, Wi-Fi nebo xDSL. Vybereme variantu podle dostupnosti a potřeb domácnosti.',
      },
    ],
  },
};

export function normalizeInternetData(loaded) {
  return {
    hero: { ...defaultInternetData.hero, ...(loaded?.hero || {}) },
    highlight: { ...defaultInternetData.highlight, ...(loaded?.highlight || {}) },
    benefits: normalizeArray(defaultInternetData.benefits, loaded?.benefits, emptyBenefit),
    cards: normalizeCards(loaded?.cards),
    legacyPlans: Array.isArray(loaded?.legacyPlans) ? loaded.legacyPlans : defaultInternetData.legacyPlans,
    infoCards: normalizeArray(defaultInternetData.infoCards, loaded?.infoCards, emptyInfoCard),
    whySection: {
      ...defaultInternetData.whySection,
      ...(loaded?.whySection || {}),
      cards: normalizeArray(defaultInternetData.whySection.cards, loaded?.whySection?.cards, emptyWhyCard),
    },
  };
}

function emptyBenefit() {
  return {
    icon: 'bolt',
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

function emptyInfoCard() {
  return {
    title: '',
    text: '',
    muted: false,
  };
}

function emptyWhyCard() {
  return {
    icon: 'check',
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
