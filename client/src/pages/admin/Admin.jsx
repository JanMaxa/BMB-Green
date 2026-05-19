import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import AdminLogin from './AdminLogin.jsx';
import BalickyEditor from './editors/BalickyEditor.jsx';
import InternetEditor from './editors/InternetEditor.jsx';
import NovinkyEditor from './editors/NovinkyEditor.jsx';
import PokrytiEditor from './editors/PokrytiEditor.jsx';
import TelevizeEditor from './editors/TelevizeEditor.jsx';

const tabs = [
  { slug: 'pokryti', label: 'Pokrytí', icon: 'map-pin', component: PokrytiEditor },
  { slug: 'balicky', label: 'Balíčky', icon: 'check', component: BalickyEditor },
  { slug: 'internet', label: 'Internet', icon: 'wifi', component: InternetEditor },
  { slug: 'televize', label: 'Televize', icon: 'tv', component: TelevizeEditor },
  { slug: 'novinky', label: 'Novinky', icon: 'clock', component: NovinkyEditor },
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
