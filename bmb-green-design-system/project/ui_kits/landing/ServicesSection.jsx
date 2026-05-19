// ServicesSection.jsx — full service portfolio (4 cards)
function ServicesSection() {
  const svcs = [
    { icon: 'wifi',         title: 'Internet',     desc: 'Optika FTTH a bezdrát 5 GHz. Symetrické rychlosti až 1 Gb/s pro domácnosti i firmy.' },
    { icon: 'tv',           title: 'Televize',     desc: '120+ kanálů, HD/4K, 7denní archiv, sledování na 4 zařízeních současně.' },
    { icon: 'phone',        title: 'Volání',       desc: 'Pevná linka přes IP, neomezené volání do všech sítí ČR za 199 Kč/měs.' },
    { icon: 'shield-check', title: 'Zabezpečení',  desc: 'EZS / EPS, CCTV, přístupové systémy, napojení na PCO. Revize a 24/7 servis.' },
    { icon: 'sun',          title: 'Fotovoltaika', desc: 'Návrh i realizace FVE na klíč. Dotace NZÚ vyřídíme za Vás.' },
    { icon: 'fiber',        title: 'Sítě a kabeláž', desc: 'Optické trasy, strukturovaná kabeláž, anténní rozvody pro developerské projekty.' },
    { icon: 'camera',       title: 'Kamerové systémy', desc: 'IP kamery 4K, NVR úložiště, vzdálený dohled přes mobilní aplikaci.' },
    { icon: 'building',     title: 'Developerům',  desc: 'Kompletní slaboproudá infrastruktura pro novostavby. Od projektu po předání.' },
  ];
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">Co děláme</div>
          <h2>Jeden partner pro celou nemovitost.</h2>
          <p>Od přípojky po zabezpečení a&nbsp;fotovoltaiku — všechno navrhneme, postavíme a&nbsp;dlouhodobě servisujeme my sami.</p>
        </div>
        <div className="svc-grid">
          {svcs.map(s => (
            <div key={s.title} className="svc">
              <div className="svc-icon"><img src={`../../assets/icons/${s.icon}.svg`} alt="" /></div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
              <a className="svc-link" href="#">Více informací <img src="../../assets/icons/arrow-right.svg" style={{ width: 14, height: 14 }} alt="" /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ServicesSection = ServicesSection;
