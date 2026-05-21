import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import InternetContent from './InternetContent.jsx';
import { defaultInternetData, normalizeInternetData } from './internetData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Internet() {
  const [internetData, setInternetData] = useState(defaultInternetData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/internet`)
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
