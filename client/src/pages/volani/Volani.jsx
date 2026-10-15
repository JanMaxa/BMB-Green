import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import VolaniContent from './VolaniContent.jsx';
import { defaultVolaniData, normalizeVolaniData } from './volaniData.js';

export default function Volani() {
  const [volaniData, setVolaniData] = useState(defaultVolaniData);

  useEffect(() => {
    fetch('/api/volani')
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
