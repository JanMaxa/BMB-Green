import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import VolaniContent from './VolaniContent.jsx';
import { defaultVolaniData, normalizeVolaniData } from './volaniData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export default function Volani() {
  const [volaniData, setVolaniData] = useState(defaultVolaniData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/volani`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setVolaniData(normalizeVolaniData(data)))
      .catch(() => {});
  }, []);

  return (
    <>
      <VolaniContent data={volaniData} />
      <ContactCta />
    </>
  );
}
