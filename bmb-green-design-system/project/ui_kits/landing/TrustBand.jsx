// TrustBand.jsx — dark numbers strip
function TrustBand() {
  const stats = [
    { v: '34', em: 'let', l: 'na trhu od roku 1991' },
    { v: '1\u00a0540', em: '+', l: 'aktivních přípojek' },
    { v: '99,97', em: '%', l: 'dostupnost páteřní sítě' },
    { v: '24/7', em: '',  l: 'technická podpora' },
  ];
  return (
    <section className="trust">
      <div className="container">
        <div className="trust-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="trust-num tabular">{s.v}<em>{s.em}</em></div>
              <div className="trust-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.TrustBand = TrustBand;
