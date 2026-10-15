export const defaultNewsData = {
  items: [],
};

export function normalizeNewsData(loaded) {
  if (!loaded?.items) return defaultNewsData;
  return {
    items: loaded.items.map((item) => ({
      tag: '',
      date: '',
      imageUrl: '',
      title: '',
      desc: '',
      ...item,
    })),
  };
}
