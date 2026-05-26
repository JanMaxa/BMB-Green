export const SITE_URL = 'https://bmb-green.cz';
export const SITE_NAME = 'BMB-Green';

export const defaultMeta = {
  title: 'BMB-Green | Internet, televize a technologie pro domácnosti',
  description:
    'Rychlý Internet, digitální televize a technologické služby pro domácnosti, firmy a developerské projekty v Brandýse nad Labem a okolí Prahy.',
  path: '/',
};

export const pageMeta = {
  '/': defaultMeta,
  '/balicky': {
    title: 'Balíčky Internetu a televize | BMB-Green',
    description:
      'Výhodné balíčky Internetu a digitální televize BMB-IPTV v jednom řešení od lokálního poskytovatele.',
    path: '/balicky',
  },
  '/internet': {
    title: 'Internet pro domácnosti a firmy | BMB-Green',
    description:
      'Stabilní Internet přes optiku, kabelovou síť i Wi-Fi. Ověříme dostupnost na adrese a doporučíme vhodnou technologii.',
    path: '/internet',
  },
  '/televize': {
    title: 'Digitální televize BMB-IPTV | BMB-Green',
    description:
      'Digitální televize s HD programy, TV archivem, internetovými rádii a možností výhodného spojení s Internetem.',
    path: '/televize',
  },
  '/volani': {
    title: 'Levné volání po ČR bez paušálu | BMB-Green',
    description:
      'VoIP telefonie bez paušálu a závazků. Výhodné ceny volání na pevné linky a do mobilních sítí v rámci České republiky.',
    path: '/volani',
  },
  '/pro-zakazniky': {
    title: 'Dostupnost, novinky a podpora | BMB-Green',
    description:
      'Ověření dostupnosti služeb, aktuální novinky ze sítě a užitečné informace pro zákazníky BMB-Green.',
    path: '/pro-zakazniky',
  },
  '/kontakty': {
    title: 'Kontakt a nezávazná poptávka | BMB-Green',
    description:
      'Kontaktujte BMB-Green kvůli dostupnosti služeb, technické podpoře, fakturaci nebo nezávazné poptávce.',
    path: '/kontakty',
  },
  '/admin': {
    title: 'Admin | BMB-Green',
    description: 'Administrace obsahu webu BMB-Green.',
    path: '/admin',
    noIndex: true,
  },
};

export function getPageMeta(path) {
  return pageMeta[path] || defaultMeta;
}

export function getCanonicalUrl(path = '/') {
  const cleanPath = path === '/' ? '' : path;
  return `${SITE_URL}${cleanPath}`;
}
