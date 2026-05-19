// CoverageSection.jsx — schematic map + per-city list
function CoverageSection() {
  const pins = [
    { x: 58, y: 35, label: 'Brandýs n. L.', city: 'Brandýs nad Labem', sub: '1 024 přípojek', speed: '1 Gb/s' },
    { x: 30, y: 62, label: 'Praha 6',       city: 'Praha 6 · Střešovice', sub: '218 přípojek', speed: '220 Mb/s' },
    { x: 35, y: 78, label: 'Praha 5',       city: 'Praha 5 · Zbraslav',   sub: '146 přípojek', speed: '220 Mb/s' },
    { x: 72, y: 52, label: 'Lysá n. L.',    city: 'Lysá nad Labem',       sub: '88 přípojek',  speed: '500 Mb/s' },
    { x: 48, y: 22, label: 'Neratovice',    city: 'Neratovice',           sub: '64 přípojek',  speed: '500 Mb/s' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">Pokrytí</div>
          <h2>Kde stavíme síť.</h2>
          <p>Páteř v&nbsp;Brandýse, postupně rozšiřujeme do okolních obcí. Připojíme i&nbsp;Vaši ulici — stačí napsat.</p>
        </div>
        <div className="coverage">
          <div className="coverage-map">
            <div className="grid-bg" />
            {pins.map((p, i) => (
              <React.Fragment key={i}>
                <div className="label" style={{ left: p.x + '%', top: p.y + '%' }}>{p.label}</div>
                <div className="pin" style={{ left: p.x + '%', top: p.y + '%' }} />
              </React.Fragment>
            ))}
          </div>
          <div className="coverage-list">
            {pins.map((p, i) => (
              <div className="coverage-row" key={i}>
                <span className="pip"></span>
                <div>
                  <div className="city">{p.city}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.sub}</div>
                </div>
                <span className="meta tabular">až {p.speed}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.CoverageSection = CoverageSection;
