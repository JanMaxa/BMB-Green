import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import BalickyContent from './BalickyContent.jsx';
import { defaultBalickyData, normalizeBalickyData } from './balickyData.js';

export default function Balicky() {
  const [balickyData, setBalickyData] = useState(defaultBalickyData);

  useEffect(() => {
    fetch('/api/balicky')
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
