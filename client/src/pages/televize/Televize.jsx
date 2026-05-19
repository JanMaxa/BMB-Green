import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import TelevizeContent from './TelevizeContent.jsx';
import { defaultTelevizeData, normalizeTelevizeData } from './televizeData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Televize() {
  const [televizeData, setTelevizeData] = useState(defaultTelevizeData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/televize`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setTelevizeData(normalizeTelevizeData(data)))
      .catch(() => {});
  }, []);

  return (
    <>
      <TelevizeContent data={televizeData} />
      <ContactCta />
    </>
  );
}
