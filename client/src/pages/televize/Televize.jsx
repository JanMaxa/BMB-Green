import { useEffect, useState } from 'react';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import TelevizeContent from './TelevizeContent.jsx';
import { defaultTelevizeData, normalizeTelevizeData } from './televizeData.js';

export default function Televize() {
  const [televizeData, setTelevizeData] = useState(defaultTelevizeData);

  useEffect(() => {
    fetch('/api/televize')
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
