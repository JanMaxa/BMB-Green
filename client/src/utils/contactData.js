export const defaultContactData = {
  telefon: '+420 266 317 129\n+420 604 252 462',
  kancelar: 'Drahobejlova 1894/52, 190 00 Praha 9',
  email: 'smlouva@bmb-green.cz',
  sidlo: 'Na Dračkách 843/24, 162 00 Praha 6',
  ico: '24658391',
  dic: 'CZ24658391',
  pracovniDoba: 'Po–Pá 8:00–17:00',
};

export function normalizeContactData(raw = {}) {
  return {
    telefon: typeof raw.telefon === 'string' && raw.telefon.trim() ? raw.telefon : defaultContactData.telefon,
    kancelar: typeof raw.kancelar === 'string' && raw.kancelar.trim() ? raw.kancelar : defaultContactData.kancelar,
    email: typeof raw.email === 'string' && raw.email.trim() ? raw.email : defaultContactData.email,
    sidlo: typeof raw.sidlo === 'string' && raw.sidlo.trim() ? raw.sidlo : defaultContactData.sidlo,
    ico: typeof raw.ico === 'string' && raw.ico.trim() ? raw.ico : defaultContactData.ico,
    dic: typeof raw.dic === 'string' && raw.dic.trim() ? raw.dic : defaultContactData.dic,
    pracovniDoba: typeof raw.pracovniDoba === 'string' && raw.pracovniDoba.trim() ? raw.pracovniDoba : defaultContactData.pracovniDoba,
  };
}
