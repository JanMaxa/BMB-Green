// BillingPage.jsx — invoices list
function BillingPage() {
  const inv = [
    { id: '2026-05-0089', customer: 'Jan Novák',         period: 'Květen 2026', due: '24. 5. 2026', amt:    699, status: 'active',  paid: 'Zaplaceno' },
    { id: '2026-05-0090', customer: 'Petra Dvořáková',   period: 'Květen 2026', due: '24. 5. 2026', amt:   1199, status: 'install', paid: 'Vystaveno' },
    { id: '2026-05-0091', customer: 'SVJ Vodojem 2281',  period: 'Květen 2026', due: '24. 5. 2026', amt:  21582, status: 'active',  paid: 'Zaplaceno' },
    { id: '2025-04-0123', customer: 'Tomáš Černý',       period: 'Duben 2025',  due: '24. 4. 2025', amt:    499, status: 'due',     paid: 'Po splatnosti 24 dní' },
    { id: '2026-05-0092', customer: 'Eva Procházková',   period: 'Květen 2026', due: '24. 5. 2026', amt:    699, status: 'active',  paid: 'Zaplaceno' },
    { id: '2026-05-0093', customer: 'Penzion U Lípy',    period: 'Květen 2026', due: '24. 5. 2026', amt:   1499, status: 'active',  paid: 'Zaplaceno' },
  ];
  const sum = inv.reduce((s, i) => s + i.amt, 0);

  return (
    <React.Fragment>
      <div className="page-title">
        <div>
          <h2>Fakturace</h2>
          <div className="sub">Květen 2026 · 6 faktur · celkem {sum.toLocaleString('cs-CZ')} Kč</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary"><img src="../../assets/icons/download.svg" alt="" />Export</button>
          <button className="btn btn-primary"><img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />Vystavit fakturu</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Faktury</h3>
          <div className="right tabs">
            <button className="active">Tento měsíc</button>
            <button>Po splatnosti (24)</button>
            <button>Vše</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Č. faktury</th>
              <th>Zákazník</th>
              <th>Období</th>
              <th>Splatnost</th>
              <th>Stav</th>
              <th className="right">Částka</th>
            </tr>
          </thead>
          <tbody>
            {inv.map(i => (
              <tr key={i.id}>
                <td><div className="id" style={{ fontWeight: 600, color: 'var(--ink-800)' }}>{i.id}</div></td>
                <td>{i.customer}</td>
                <td>{i.period}</td>
                <td>{i.due}</td>
                <td><span className={`pill pill-${i.status === 'due' ? 'due' : i.status === 'install' ? 'install' : 'active'}`}>{i.paid}</span></td>
                <td className="right tabular" style={{ fontWeight: 600 }}>{i.amt.toLocaleString('cs-CZ')} Kč</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

window.BillingPage = BillingPage;
