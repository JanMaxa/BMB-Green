// NetworkPage.jsx — network elements list
function NetworkPage() {
  const nodes = [
    { id: 'BRA-01', kind: 'Patch panel', loc: 'Brandýs · U Vodojemu', ports: '38 / 48', uptime: '99,97 %', status: 'active' },
    { id: 'BRA-02', kind: 'OLT',         loc: 'Brandýs · Pražská',     ports: '12 / 16', uptime: '100,00 %', status: 'active' },
    { id: 'PRA-02', kind: 'Bezdrát AP',  loc: 'Praha 6 · Střešovice',   ports: '— ',     uptime: '99,82 %', status: 'active' },
    { id: 'PRA-05', kind: 'Bezdrát AP',  loc: 'Praha 5 · Zbraslav',     ports: '— ',     uptime: '99,91 %', status: 'active' },
    { id: 'LYS-01', kind: 'OLT',         loc: 'Lysá n. Labem',           ports: '6 / 16',  uptime: '100,00 %', status: 'active' },
    { id: 'NER-01', kind: 'Patch panel', loc: 'Neratovice',              ports: '4 / 24',  uptime: '99,98 %', status: 'install' },
  ];
  return (
    <React.Fragment>
      <div className="page-title">
        <div>
          <h2>Síťové prvky</h2>
          <div className="sub">6 prvků online · průměrný uptime 99,95 %</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary"><img src="../../assets/icons/map-pin.svg" alt="" />Mapa</button>
          <button className="btn btn-primary"><img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />Přidat prvek</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Aktivní prvky</h3></div>
        <table>
          <thead>
            <tr><th>ID</th><th>Typ</th><th>Lokalita</th><th>Porty</th><th className="right">Uptime 30 d</th><th>Stav</th></tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n.id}>
                <td><div className="id" style={{ fontWeight: 700, color: 'var(--ink-800)' }}>{n.id}</div></td>
                <td>{n.kind}</td>
                <td>{n.loc}</td>
                <td className="tabular">{n.ports}</td>
                <td className="right tabular" style={{ fontWeight: 600 }}>{n.uptime}</td>
                <td><span className={`pill pill-${n.status === 'install' ? 'install' : 'active'}`}>{n.status === 'install' ? 'V instalaci' : 'Online'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

window.NetworkPage = NetworkPage;
