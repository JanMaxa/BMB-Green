import { useEffect } from 'react';
import { SITE_NAME, getCanonicalUrl } from '../../seo/pageMeta.js';

export default function Seo({ meta }) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(meta.path);

    document.documentElement.lang = 'cs';
    document.title = meta.title;

    setMetaByName('description', meta.description);
    setMetaByProperty('og:site_name', SITE_NAME);
    setMetaByProperty('og:locale', 'cs_CZ');
    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:title', meta.title);
    setMetaByProperty('og:description', meta.description);
    setMetaByName('twitter:card', 'summary');
    setMetaByName('twitter:title', meta.title);
    setMetaByName('twitter:description', meta.description);
    setLink('canonical', canonicalUrl);

    if (meta.noIndex) {
      setMetaByName('robots', 'noindex,nofollow');
    } else {
      removeMetaByName('robots');
    }
  }, [meta]);

  return null;
}

function setMetaByName(name, content) {
  const element = ensureElement(`meta[name="${name}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    return meta;
  });

  element.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  const element = ensureElement(`meta[property="${property}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    return meta;
  });

  element.setAttribute('content', content);
}

function setLink(rel, href) {
  const element = ensureElement(`link[rel="${rel}"]`, () => {
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    return link;
  });

  element.setAttribute('href', href);
}

function removeMetaByName(name) {
  document.head.querySelector(`meta[name="${name}"]`)?.remove();
}

function ensureElement(selector, createElement) {
  const existingElement = document.head.querySelector(selector);

  if (existingElement) return existingElement;

  const element = createElement();
  document.head.appendChild(element);
  return element;
}
