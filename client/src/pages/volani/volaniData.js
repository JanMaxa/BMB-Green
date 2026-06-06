export const defaultVolaniData = {
  hero: {
    title: 'Levné volání bez paušálu',
    description: 'Volejte na pevné linky i do mobilních sítí po celé České republice za výhodné ceny díky VoIP technologii. Žádný paušál, žádný závazek — platíte pouze za skutečně provolané minuty.',
    ctaLabel: 'Nezávazně poptat',
    ctaHref: '/kontakty?reason=zajem-o-sluzby&service=volani',
  },
  benefits: [
    {
      title: 'Žádný paušál',
      text: 'Platíte pouze za provolané minuty bez měsíčních poplatků.',
    },
    {
      title: 'Výhodné ceny',
      text: 'Volání na pevné linky za zlomek ceny mobilního operátora.',
    },
    {
      title: 'Bez závazku',
      text: 'Žádný časový ani finanční závazek, službu lze kdykoli ukončit.',
    },
    {
      title: 'VoIP přístroj',
      text: 'Dodáme nastavený telefon v bezdrátovém i drátovém provedení.',
    },
  ],
  pricingCards: [
    {
      title: 'Pevné sítě',
      desc: 'Místní i dálkové hovory na pevné linky všech operátorů v rámci České republiky.',
      rates: [
        { label: 'Špička (7:00–19:00)', price: '1,03 Kč' },
        { label: 'Mimo špičku', price: '0,54 Kč' },
      ],
    },
    {
      title: 'Mobilní sítě',
      desc: 'Hovory do mobilních sítí všech operátorů v rámci České republiky.',
      rates: [
        { label: 'Špička (7:00–19:00)', price: '4,22 Kč' },
        { label: 'Mimo špičku', price: '4,22 Kč' },
      ],
    },
  ],
  whySection: {
    title: 'Proč si vybrat BMB-Telefon?',
    description: 'VoIP telefonie od lokálního poskytovatele. Výhodné ceny volání, žádný paušál a garantovaná kvalita přenášeného hovoru v síti BMB.',
    cards: [
      {
        "icon": "check",
        "title": "Žádný paušál ani skryté poplatky",
        "text": "Platíte výhradně za skutečně provolané minuty. Žádný měsíční paušál ani aktivační poplatek."
      },
      {
        "icon": "bolt",
        "title": "Výhodné ceny do pevných sítí",
        "text": "Místní i dálkové hovory na pevné linky za 1,03 Kč/min ve špičce a 0,54 Kč/min mimo špičku."
      },
      {
        "icon": "clock",
        "title": "Bez časového ani finančního závazku",
        "text": "Službu lze kdykoli ukončit bez sankce. Nezavazujete se na žádnou minimální dobu odběru."
      },
      {
        "icon": "wifi",
        "title": "VoIP telefon",
        "text": "Dodáme nastavený VoIP přístroj v drátovém i bezdrátovém provedení. K jedné základně lze připojit více sluchátek."
      },
      {
        "icon": "shield-check",
        "title": "Ochranný limit provolání",
        "text": "Standardně nastavený limit 10 000 Kč chrání před neočekávanými náklady. Na základě dohody lze limit změnit."
      },
      {
        "icon": "fiber",
        "title": "Vyhrazený kanál pro kvalitu hovoru",
        "text": "V sítích BMB je vyhrazen samostatný kanál pro telefonní hovory, který garantuje čistý přenos bez rušení."
      }
    ],
  },
};

export function normalizeVolaniData(loaded) {
  return {
    hero: { ...defaultVolaniData.hero, ...(loaded?.hero || {}) },
    benefits: normalizeArray(defaultVolaniData.benefits, loaded?.benefits, emptyBenefit),
    pricingCards: normalizePricingCards(loaded?.pricingCards),
    whySection: {
      ...defaultVolaniData.whySection,
      ...(loaded?.whySection || {}),
      cards: normalizeArray(defaultVolaniData.whySection.cards, loaded?.whySection?.cards, emptyWhyCard),
    },
  };
}

function emptyBenefit() {
  return { title: 'Nová výhoda', text: '' };
}

function emptyRate() {
  return { label: 'Vyplňte název tarifu', price: '0,00 Kč' };
}

export function emptyPricingCard() {
  return {
    title: 'Nová síť',
    desc: 'Vyplňte popis této sítě a podmínky volání.',
    rates: [emptyRate()],
  };
}

function emptyWhyCard() {
  return { icon: 'check', title: '', text: '' };
}

function normalizePricingCards(loadedCards) {
  const source = Array.isArray(loadedCards) ? loadedCards : defaultVolaniData.pricingCards;

  return source.map((card, index) => ({
    ...(defaultVolaniData.pricingCards[index] || emptyPricingCard()),
    ...card,
    rates: normalizeArray(
      defaultVolaniData.pricingCards[index]?.rates || [emptyRate()],
      card?.rates,
      emptyRate,
    ),
  }));
}

function normalizeArray(fallbackItems, loadedItems, emptyItem) {
  const source = Array.isArray(loadedItems) ? loadedItems : fallbackItems;

  return source.map((item, index) => ({
    ...(fallbackItems[index] || emptyItem()),
    ...item,
  }));
}
