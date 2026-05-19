// Hero.jsx — top hero section with eyebrow, headline, lead, CTAs, stats, address lookup card
function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="hero-eyebrow"><span className="dot"></span>Tradice české společnosti · od roku 1991</div>
          <h1>Nejrychlejší Internet ve&nbsp;<em>městě</em>. A&nbsp;ještě k&nbsp;tomu&nbsp;televize.</h1>
          <p className="hero-lead">
            Optika a&nbsp;bezdrát až 1&nbsp;Gb/s pro byty, rodinné domy a&nbsp;developerské projekty
            v&nbsp;Brandýse nad Labem a&nbsp;okolí Prahy. Instalace do 2–3 pracovních dnů.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg">Zjistit dostupnost
              <img src="../../assets/icons/arrow-right.svg" style={{ filter: 'invert(1)' }} alt="" />
            </button>
            <button className="btn btn-ghost btn-lg">Prohlédnout tarify</button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num tabular">220<span style={{ color: 'var(--ink-500)', fontSize: 14, fontWeight: 500 }}> Mb/s</span></div>
              <div className="hero-stat-lbl">Standardní rychlost</div>
            </div>
            <div>
              <div className="hero-stat-num tabular">2–3 <span style={{ color: 'var(--ink-500)', fontSize: 14, fontWeight: 500 }}>dny</span></div>
              <div className="hero-stat-lbl">Instalace</div>
            </div>
            <div>
              <div className="hero-stat-num tabular">34</div>
              <div className="hero-stat-lbl">Let na trhu</div>
            </div>
            <div>
              <div className="hero-stat-num tabular">8 <span style={{ color: 'var(--ink-500)', fontSize: 14, fontWeight: 500 }}>obcí</span></div>
              <div className="hero-stat-lbl">Pokrytí Praha + okolí</div>
            </div>
          </div>
        </div>
        <AddressLookup />
      </div>
    </section>
  );
}

window.Hero = Hero;
