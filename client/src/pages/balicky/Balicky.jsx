import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import BalickyContent from './BalickyContent.jsx';
import { defaultBalickyData, normalizeBalickyData } from './balickyData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Balicky() {
  const [balickyData, setBalickyData] = useState(defaultBalickyData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/balicky`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setBalickyData(normalizeBalickyData(data)))
      .catch(() => {});
  }, []);

  return (
    <>
      <BalickyContent data={balickyData} />
      <ContactCta />
    </>
  );
}
