// Sidebar.jsx — main app sidebar (dark, sticky)
function Sidebar({ active, onChange }) {
  const items = [
    { section: 'Přehled', children: [
      { id: 'dashboard',  icon: 'home',         label: 'Dashboard' },
      { id: 'inbox',      icon: 'inbox',        label: 'Tickety', badge: '12' },
    ]},
    { section: 'Zákazníci', children: [
      { id: 'customers',  icon: 'users',        label: 'Zákazníci' },
      { id: 'contracts',  icon: 'file-text',    label: 'Smlouvy' },
      { id: 'billing',    icon: 'credit-card',  label: 'Fakturace' },
    ]},
    { section: 'Síť', children: [
      { id: 'network',    icon: 'fiber',        label: 'Síťové prvky' },
      { id: 'work',       icon: 'wrench',       label: 'Práce techniků' },
      { id: 'monitoring', icon: 'trending-up',  label: 'Monitoring' },
    ]},
    { section: 'Admin', children: [
      { id: 'staff',      icon: 'user',         label: 'Tým' },
      { id: 'settings',   icon: 'settings',     label: 'Nastavení' },
    ]},
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="../../assets/logo-on-dark.svg" alt="BMB-Green" />
      </div>
      {items.map(group => (
        <React.Fragment key={group.section}>
          <div className="sidebar-section">{group.section}</div>
          {group.children.map(it => (
            <div
              key={it.id}
              className={'side-link' + (active === it.id ? ' active' : '')}
              onClick={() => onChange(it.id)}
            >
              <img src={`../../assets/icons/${it.icon}.svg`} alt="" />
              <span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="sidebar-user">
        <div className="avatar">MN</div>
        <div>
          <div className="who">Martin Novotný</div>
          <div className="role">Admin · BMB</div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
