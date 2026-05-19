// TicketsPage.jsx — work / support ticket queue
function TicketsPage() {
  const tickets = [
    { id: 'T-2087', sev: 'high', title: 'Výpadek patch panelu BRA-01', meta: 'Brandýs n. L. · 38 portů offline', who: 'Pavel Krátký',  ts: 'před 42 min' },
    { id: 'T-2086', sev: 'med',  title: 'Nestabilní Wi-Fi v bytě 4. p.', meta: 'Petra Dvořáková · U Vodojemu 2282', who: 'Jakub Horák',  ts: 'před 1 h 12 min' },
    { id: 'T-2085', sev: 'low',  title: 'Žádost o navýšení rychlosti', meta: 'Lucie Marková · Pražská 2412',     who: '— nepřiřazeno', ts: 'před 2 h' },
    { id: 'T-2084', sev: 'med',  title: 'STB nereaguje na ovladač',     meta: 'Tomáš Černý · Praha 6',            who: 'Jakub Horák',  ts: 'před 3 h' },
    { id: 'T-2083', sev: 'high', title: 'Záloha NVR neproběhla',         meta: 'SVJ Vodojem 2281 · CCTV',          who: 'Pavel Krátký',  ts: 'před 4 h' },
    { id: 'T-2082', sev: 'low',  title: 'Změna fakturační adresy',       meta: 'Penzion U Lípy',                   who: '— nepřiřazeno', ts: 'včera 16:42' },
  ];

  return (
    <React.Fragment>
      <div className="page-title">
        <div>
          <h2>Tickety</h2>
          <div className="sub">12 otevřených · 3 vysoká priorita · průměrný čas vyřešení 4,2 h</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary"><img src="../../assets/icons/filter.svg" alt="" />Filtr</button>
          <button className="btn btn-primary"><img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />Nový ticket</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Otevřená fronta</h3>
          <div className="right">
            <div className="tabs">
              <button className="active">Otevřené (12)</button>
              <button>Mé (4)</button>
              <button>Plánované</button>
              <button>Uzavřené</button>
            </div>
          </div>
        </div>
        {tickets.map(t => (
          <div className="ticket" key={t.id}>
            <span className={`sev ${t.sev}`}></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="title">{t.title}</div>
              <div className="meta">{t.meta}</div>
            </div>
            <div className="right">
              <div className="id">#{t.id}</div>
              <div className="assignee">{t.who}</div>
              <div className="id" style={{ marginTop: 2 }}>{t.ts}</div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

window.TicketsPage = TicketsPage;
