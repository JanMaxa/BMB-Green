// PackagesSection.jsx — pricing / tariffs
function PackagesSection() {
  const packages = [
    {
      name: 'Start 100',
      speed: 100,
      price: '399',
      features: ['100/50 Mb/s symetricky', 'Bez datového limitu', 'Wi-Fi router v pronájmu', 'Aktivace 0 Kč'],
      featured: false,
    },
    {
      name: 'Domov 220',
      speed: 220,
      price: '699',
      features: ['220/100 Mb/s symetricky', 'Bez datového limitu', 'Wi-Fi 6 router v ceně', '50+ TV kanálů v HD', 'Instalace zdarma'],
      featured: true,
    },
    {
      name: 'Profi 500',
      speed: 500,
      price: '1\u00a0199',
      features: ['500/500 Mb/s symetricky', 'Statická IP adresa', 'Wi-Fi 6 mesh systém', '120+ TV kanálů + archiv', 'Prioritní servis 24/7'],
      featured: false,
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">Balíčky · 2026</div>
          <h2>Vyberte si tarif. Vše ostatní vyřešíme za&nbsp;Vás.</h2>
          <p>Bez aktivačních poplatků, bez závazku na dva roky. Ceny jsou uvedené včetně DPH.</p>
        </div>
        <div className="pkg-grid">
          {packages.map(p => (
            <div key={p.name} className={'pkg' + (p.featured ? ' featured' : '')}>
              {p.featured && <span className="pkg-badge">NEJOBLÍBENĚJŠÍ</span>}
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-speed tabular">{p.speed}<span className="u">Mb/s</span></div>
              <div className="pkg-price">
                <span className="v tabular">{p.price}</span>
                <span className="u">Kč / měsíc</span>
              </div>
              <ul className="pkg-features">
                {p.features.map(f => (
                  <li key={f}><img src="../../assets/icons/check.svg" alt="" />{f}</li>
                ))}
              </ul>
              <button className={'btn ' + (p.featured ? 'btn-primary' : 'btn-secondary')}>
                Objednat {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.PackagesSection = PackagesSection;
