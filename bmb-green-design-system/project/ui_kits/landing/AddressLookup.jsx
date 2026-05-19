// AddressLookup.jsx — interactive address-coverage check
const { useState: useStateAL } = React;

function AddressLookup() {
  const [q, setQ] = useStateAL('');
  const [picked, setPicked] = useStateAL(null);

  const candidates = [
    { addr: 'U Vodojemu 2281, Brandýs n. L.', code: '250 01', speed: 1000, technology: 'Optika · FTTH' },
    { addr: 'U Vodojemu 2282, Brandýs n. L.', code: '250 01', speed: 1000, technology: 'Optika · FTTH' },
    { addr: 'U Rokle 2286, Brandýs n. L.',    code: '250 01', speed: 500,  technology: 'Optika · FTTH' },
    { addr: 'Na Dračkách 689/3, Praha 6',      code: '162 00', speed: 220,  technology: 'Bezdrát · 5 GHz' },
    { addr: 'Za opusem 1233, Praha 5',         code: '156 00', speed: 220,  technology: 'Bezdrát · 5 GHz' },
  ];
  const filtered = q.trim().length >= 2
    ? candidates.filter(c => c.addr.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : [];

  return (
    <div className="lookup-card">
      <h3>Zjistit dostupnost</h3>
      <p>Zadejte ulici, č.&nbsp;p. a obec — během vteřiny zjistíme rychlost na Vaší adrese.</p>
      <div className="lookup-field">
        <img src="../../assets/icons/map-pin.svg" alt="" />
        <input
          placeholder="např. U Vodojemu 2281, Brandýs n. L."
          value={q}
          onChange={e => { setQ(e.target.value); setPicked(null); }}
        />
      </div>
      {filtered.length > 0 && !picked && (
        <div className="lookup-suggestions">
          {filtered.map(c => (
            <button key={c.addr} onClick={() => { setPicked(c); setQ(c.addr); }}>
              <img src="../../assets/icons/map-pin.svg" style={{ width: 14, height: 14, opacity: .6 }} alt="" />
              <span>{c.addr}</span>
              <span className="addr-meta">{c.code}</span>
            </button>
          ))}
        </div>
      )}
      {picked && (
        <div className="lookup-result">
          <div className="lookup-result-title">
            <img src="../../assets/icons/check.svg" alt="" /> Dostupné na vaší adrese
          </div>
          <div className="lookup-result-speed">
            až {picked.speed} <span style={{ fontSize: 16, color: 'var(--ink-500)', fontWeight: 600 }}>Mb/s</span>
          </div>
          <div className="lookup-result-sub">{picked.technology} · instalace do 2–3 prac. dnů</div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
            Objednat tarif <img src="../../assets/icons/arrow-right.svg" style={{ filter: 'invert(1)' }} alt="" />
          </button>
        </div>
      )}
    </div>
  );
}

window.AddressLookup = AddressLookup;
