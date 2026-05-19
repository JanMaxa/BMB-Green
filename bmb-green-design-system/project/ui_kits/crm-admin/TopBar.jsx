// TopBar.jsx — top header with search, breadcrumb, actions
function TopBar({ crumbs, onNewCustomer }) {
  return (
    <header className="topbar">
      <div>
        <h1>{crumbs[crumbs.length - 1]}</h1>
        <div className="crumb">{crumbs.slice(0, -1).join(' / ')}</div>
      </div>
      <div className="search">
        <img src="../../assets/icons/search.svg" alt="" />
        <input placeholder="Hledat zákazníka, smlouvu nebo adresu…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="Notifikace">
          <img src="../../assets/icons/bell.svg" alt="" />
          <span className="dot"></span>
        </button>
        <button className="icon-btn" title="Help">
          <img src="../../assets/icons/info.svg" alt="" />
        </button>
        <button className="btn btn-primary" onClick={onNewCustomer}>
          <img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />
          Nový zákazník
        </button>
      </div>
    </header>
  );
}

window.TopBar = TopBar;
