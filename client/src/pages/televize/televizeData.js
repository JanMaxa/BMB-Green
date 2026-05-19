export const defaultTelevizeData = {
  hero: {
    title: 'Digitální kabelová televize',
    description: 'BMB-IPTV přináší kvalitní televizní signál, chytré funkce IPTV Genius, archiv a programové balíčky od základní nabídky po maximální TV výběr.',
    ctaLabel: 'Vybrat televizní nabídku',
    ctaHref: '/kontakty',
  },
  highlight: {
    label: 'Nejširší nabídka',
    value: '145 programů',
    description: 'Balíček BMB Max nabízí 72 programů v HD kvalitě a HBO GO na Max.',
  },
  features: [
    {
      icon: 'tv',
      title: 'Až 145 programů',
      text: 'Široká nabídka českých, filmových, dokumentárních i sportovních stanic.',
    },
    {
      icon: 'check',
      title: 'Až 72 v HD',
      text: 'Kvalitní obraz u hlavních programů podle zvoleného balíčku.',
    },
    {
      icon: 'clock',
      title: 'TV archiv',
      text: 'Chytré funkce IPTV Genius a pohodlnější sledování pořadů.',
    },
    {
      icon: 'bolt',
      title: '55 internetových rádií',
      text: 'Součástí chytré IPTV nabídky jsou i internetová rádia.',
    },
  ],
  packages: [
    {
      name: 'BMB Mini',
      channels: '77 programů',
      hd: '38 v HD',
      price: '152 Kč',
      desc: 'Nejnižší programová nabídka s IPTV Genius funkcemi.',
    },
    {
      name: 'BMB Basic',
      channels: '120 programů',
      hd: '56 v HD',
      price: '355 Kč',
      desc: 'Oblíbená nabídka pro domácnosti, které chtějí pestrý výběr kanálů.',
    },
    {
      name: 'BMB Max',
      channels: '145 programů',
      hd: '72 v HD',
      price: '899 Kč',
      desc: 'Maximální nabídka včetně HBO GO na Max a nejširší programové skladby.',
    },
  ],
  infoCards: [
    {
      title: 'IPTV Genius',
      text: 'Chytré funkce služby zvyšují komfort sledování a rozšiřují možnosti individuální televizní zábavy.',
    },
    {
      title: 'TV archiv a rádia',
      text: 'Součástí nabídky jsou funkce jako TV archiv a 55 internetových rádií podle dostupné služby.',
    },
    {
      title: 'Výhodně s Internetem',
      text: 'Televizi můžete spojit s internetem do zvýhodněného balíčku a řešit obě služby u jednoho poskytovatele.',
    },
  ],
  whySection: {
    title: 'Proč si vybrat BMB-IPTV?',
    description: 'Televize navržená pro domácnosti, které chtějí přehledné balíčky, chytré funkce a možnost spojit službu s Internetem.',
    cards: [
      {
        icon: 'tv',
        title: 'Balíček podle sledování',
        text: 'Mini, Basic i Max pokrývají různé typy domácností od základní nabídky po maximální počet programů.',
      },
      {
        icon: 'clock',
        title: 'Chytré TV funkce',
        text: 'IPTV Genius přidává komfort sledování, archiv pořadů a další funkce pro každodenní používání.',
      },
      {
        icon: 'bolt',
        title: 'Výhodně s Internetem',
        text: 'Televizi lze spojit s internetovým tarifem do jednoho balíčku a řešit vše u jednoho poskytovatele.',
      },
    ],
  },
};

export function normalizeTelevizeData(loaded) {
  return {
    hero: { ...defaultTelevizeData.hero, ...(loaded?.hero || {}) },
    highlight: { ...defaultTelevizeData.highlight, ...(loaded?.highlight || {}) },
    features: mergeFixedArray(defaultTelevizeData.features, loaded?.features),
    packages: mergeFixedArray(defaultTelevizeData.packages, loaded?.packages),
    infoCards: mergeFixedArray(defaultTelevizeData.infoCards, loaded?.infoCards),
    whySection: {
      ...defaultTelevizeData.whySection,
      ...(loaded?.whySection || {}),
      cards: mergeFixedArray(defaultTelevizeData.whySection.cards, loaded?.whySection?.cards),
    },
  };
}

function mergeFixedArray(fallbackItems, loadedItems) {
  const source = Array.isArray(loadedItems) ? loadedItems : [];

  return fallbackItems.map((fallback, index) => ({
    ...fallback,
    ...(source[index] || {}),
  }));
}
