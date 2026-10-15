import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import InternetContent from './InternetContent.jsx';
import { defaultInternetData, normalizeInternetData } from './internetData.js';

export default function Internet() {
  const [internetData, setInternetData] = useState(defaultInternetData);

  useEffect(() => {
    fetch('/api/internet')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setInternetData(normalizeInternetData(data)))
      .catch(() => {});
  }, []);

  return (
    <>
      <InternetContent data={internetData} />
      <ContactCta />
    </>
  );
}
