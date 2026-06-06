export const defaultKeStazeniData = {
  hero: {
    title: 'Dokumenty ke stažení',
    description: 'Smluvní podmínky, ceníky a další dokumenty ke stažení ve formátu PDF.',
    imageUrl: '',
  },
  items: [],
};

export function emptyDocument() {
  return { label: '', path: '' };
}

export function normalizeDocument(item = {}) {
  return {
    label: typeof item.label === 'string' ? item.label : '',
    path: typeof item.path === 'string' ? item.path : '',
  };
}

export function normalizeKeStazeniData(raw) {
  const heroRaw = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};

  return {
    hero: {
      title: typeof heroRaw.title === 'string' && heroRaw.title.trim()
        ? heroRaw.title
        : defaultKeStazeniData.hero.title,
      description: typeof heroRaw.description === 'string' ? heroRaw.description : defaultKeStazeniData.hero.description,
      imageUrl: typeof heroRaw.imageUrl === 'string' ? heroRaw.imageUrl : defaultKeStazeniData.hero.imageUrl,
    },
    items: Array.isArray(raw?.items) ? raw.items.map(normalizeDocument) : [],
  };
}

