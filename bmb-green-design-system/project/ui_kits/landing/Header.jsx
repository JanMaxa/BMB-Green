// Header.jsx — top navigation bar
const { useState } = React;

function Header() {
  const [active, setActive] = useState('Balíčky');
  const items = ['Balíčky', 'Televize', 'Internet', 'Volání', 'Novinky', 'Ke stažení', 'Kontakty'];
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <a href="#"><img src="../../assets/logo.svg" alt="BMB-Green" style={{ height: 28 }} /></a>
        <nav className="topnav-links">
          {items.map(i => (
            <a key={i} href="#" className={active === i ? 'active' : ''} onClick={e => { e.preventDefault(); setActive(i); }}>{i}</a>
          ))}
        </nav>
        <div className="topnav-cta">
          <span className="topnav-phone">
            <img src="../../assets/icons/phone.svg" alt="" />
            266 317 129
          </span>
          <button className="btn btn-primary">Zjistit dostupnost</button>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
