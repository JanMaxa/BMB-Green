import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import AdminLogin from './AdminLogin.jsx';
import BalickyEditor from './editors/BalickyEditor.jsx';
import FaqEditor from './editors/FaqEditor.jsx';
import InternetEditor from './editors/InternetEditor.jsx';
import KeStazeniEditor from './editors/KeStazeniEditor.jsx';
import NovinkyEditor from './editors/NovinkyEditor.jsx';
import KontaktyEditor from './editors/KontaktyEditor.jsx';
import PokrytiEditor from './editors/PokrytiEditor.jsx';
import TelevizeEditor from './editors/TelevizeEditor.jsx';
import VolaniEditor from './editors/VolaniEditor.jsx';

const tabs = [
  { slug: 'pokryti', label: 'Pokrytí', icon: 'map-pin', component: PokrytiEditor },
  { slug: 'faq', label: 'Časté dotazy', icon: 'chevron-down', component: FaqEditor },
  { slug: 'novinky', label: 'Novinky', icon: 'clock', component: NovinkyEditor },
  { slug: 'kontakty', label: 'Kontakty', icon: 'mail', component: KontaktyEditor },
  { slug: 'balicky', label: 'Balíčky', icon: 'check', component: BalickyEditor },
  { slug: 'internet', label: 'Internet', icon: 'wifi', component: InternetEditor },
  { slug: 'televize', label: 'Televize', icon: 'tv', component: TelevizeEditor },
  { slug: 'volani', label: 'Volání', icon: 'phone', component: VolaniEditor },
  { slug: 'ke-stazeni', label: 'Ke stažení', icon: 'download', component: KeStazeniEditor },
];

export default function Admin() {
  const [isSignedIn, setIsSignedIn] = useState(() => localStorage.getItem('bmb-admin') === 'true');
  const [activeTab, setActiveTab] = useState('pokryti');
  const [headerAction, setHeaderAction] = useState(null);

  if (!isSignedIn) {
    return <AdminLogin onSignedIn={() => setIsSignedIn(true)} />;
  }

  const active = tabs.find((tab) => tab.slug === activeTab) || tabs[0];
  const ActiveEditor = active.component;

  return (
    <AdminLayout
      activeTab={activeTab}
      activeLabel={active.label}
      headerAction={headerAction}
      tabs={tabs}
      onChangeTab={(tab) => {
        setHeaderAction(null);
        setActiveTab(tab);
      }}
      onSignOut={() => {
        localStorage.removeItem('bmb-admin');
        setIsSignedIn(false);
      }}
    >
      <ActiveEditor setHeaderAction={setHeaderAction} />
    </AdminLayout>
  );
}
