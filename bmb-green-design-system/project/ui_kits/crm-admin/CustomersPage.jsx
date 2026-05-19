// CustomersPage.jsx — customer list + selected-customer detail
const { useState: useStateCP } = React;

const CUSTOMERS = [
  { id: 'A-10293', name: 'Jan Novák',         init: 'JN', addr: 'U Vodojemu 2281, Brandýs n. L.', city: 'Brandýs', tariff: 'Domov 220',      services: ['Internet', 'TV'],            mrr:    699, status: 'active',  since: '04 / 2018' },
  { id: 'A-10294', name: 'Petra Dvořáková',   init: 'PD', addr: 'U Vodojemu 2282, Brandýs n. L.', city: 'Brandýs', tariff: 'Profi 500',      services: ['Internet', 'TV', 'Volání'],   mrr:   1199, status: 'install', since: '05 / 2026' },
  { id: 'B-00514', name: 'SVJ Vodojem 2281',  init: 'SV', addr: 'U Vodojemu 2281, Brandýs n. L.', city: 'Brandýs', tariff: 'Komplet 1G × 18',services: ['Internet', 'TV', 'CCTV'],      mrr:  21582, status: 'active',  since: '11 / 2022' },
  { id: 'A-09871', name: 'Tomáš Černý',       init: 'TČ', addr: 'Na Dračkách 689/3, Praha 6',     city: 'Praha 6', tariff: 'Domov 100',      services: ['Internet'],                   mrr:    499, status: 'due',     since: '02 / 2020' },
  { id: 'A-10301', name: 'Eva Procházková',   init: 'EP', addr: 'Za opusem 1233, Praha 5',         city: 'Praha 5', tariff: 'Domov 220',      services: ['Internet', 'TV'],             mrr:    699, status: 'active',  since: '08 / 2021' },
  { id: 'B-00518', name: 'Penzion U Lípy',    init: 'PL', addr: 'Lysá nad Labem, Masarykova 14',   city: 'Lysá',    tariff: 'Profi 500',       services: ['Internet', 'CCTV'],          mrr:   1499, status: 'active',  since: '03 / 2024' },
  { id: 'A-08214', name: 'Karel Svoboda',     init: 'KS', addr: 'Neratovice, Mládeže 14',          city: 'Neratovice', tariff: 'Domov 100',   services: ['Internet'],                   mrr:    499, status: 'pause',   since: '06 / 2019' },
  { id: 'A-10310', name: 'Lucie Marková',     init: 'LM', addr: 'Brandýs n. L., Pražská 2412',     city: 'Brandýs', tariff: 'Domov 220',      services: ['Internet', 'TV'],             mrr:    699, status: 'active',  since: '01 / 2025' },
];

const STATUS = {
  active:  { cls: 'pill pill-active',  label: 'Aktivní' },
  install: { cls: 'pill pill-install', label: 'V instalaci' },
  pause:   { cls: 'pill pill-pause',   label: 'Pozastaveno' },
  due:     { cls: 'pill pill-due',     label: 'Po splatnosti' },
  end:     { cls: 'pill pill-end',     label: 'Ukončeno' },
};

function CustomerTable({ selectedId, onSelect }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-head">
        <h3>Zákazníci</h3>
        <div className="meta">8 výsledků</div>
        <div className="right">
          <button className="btn btn-secondary btn-sm"><img src="../../assets/icons/filter.svg" alt="" />Filtr</button>
          <div className="tabs">
            <button className="active">Vše</button>
            <button>Aktivní</button>
            <button>V instalaci</button>
            <button>Po splatnosti</button>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Zákazník</th>
            <th>Adresa</th>
            <th>Tarif</th>
            <th>Služby</th>
            <th>Stav</th>
            <th className="right">MRR</th>
          </tr>
        </thead>
        <tbody>
          {CUSTOMERS.map(c => (
            <tr key={c.id} className={selectedId === c.id ? 'selected' : ''} onClick={() => onSelect(c.id)}>
              <td>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="av">{c.init}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="id">#{c.id}</div>
                  </div>
                </div>
              </td>
              <td><div>{c.addr}</div><div className="id">{c.city}</div></td>
              <td>{c.tariff}</td>
              <td>{c.services.map(s => <span key={s} className="tag">{s}</span>)}</td>
              <td><span className={STATUS[c.status].cls}>{STATUS[c.status].label}</span></td>
              <td className="right tabular" style={{ fontWeight: 600 }}>{c.mrr.toLocaleString('cs-CZ')} Kč</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerDetail({ id }) {
  const c = CUSTOMERS.find(x => x.id === id);
  if (!c) return null;
  return (
    <React.Fragment>
      <div className="detail-head" style={{ marginBottom: 16 }}>
        <div className="av">{c.init}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>{c.name}</h3>
          <div className="meta">
            <span className="id">#{c.id}</span>
            <span>·</span>
            <span>{c.addr}</span>
            <span>·</span>
            <span className={STATUS[c.status].cls}>{STATUS[c.status].label}</span>
          </div>
        </div>
        <div className="right">
          <button className="btn btn-secondary"><img src="../../assets/icons/edit.svg" alt="" />Upravit</button>
          <button className="btn btn-primary"><img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />Přidat službu</button>
        </div>
      </div>

      <div className="detail">
        <div className="panel">
          <div className="panel-head">
            <h3>Služby a zařízení</h3>
            <div className="right tabs">
              <button className="active">Aktivní</button>
              <button>Historie</button>
            </div>
          </div>
          <div className="svc-row">
            <div className="ic"><img src="../../assets/icons/wifi.svg" alt="" /></div>
            <div>
              <div className="name">{c.tariff}</div>
              <div className="sub">Optika FTTH · MAC AC:DE:48:00:11:22</div>
            </div>
            <div className="price tabular">{c.mrr.toLocaleString('cs-CZ')} Kč</div>
          </div>
          {c.services.includes('TV') && (
            <div className="svc-row">
              <div className="ic"><img src="../../assets/icons/tv.svg" alt="" /></div>
              <div>
                <div className="name">TV Komplet</div>
                <div className="sub">120 kanálů · STB 2× · sériové č. STB-2207-441</div>
              </div>
              <div className="price tabular">v ceně</div>
            </div>
          )}
          {c.services.includes('Volání') && (
            <div className="svc-row">
              <div className="ic"><img src="../../assets/icons/phone.svg" alt="" /></div>
              <div>
                <div className="name">Pevná linka</div>
                <div className="sub">+420 326 944 218 · neomezené volání ČR</div>
              </div>
              <div className="price tabular">199 Kč</div>
            </div>
          )}
          {c.services.includes('CCTV') && (
            <div className="svc-row">
              <div className="ic"><img src="../../assets/icons/camera.svg" alt="" /></div>
              <div>
                <div className="name">CCTV · 4 kamery</div>
                <div className="sub">NVR-0214 · poslední záznam před 2 min</div>
              </div>
              <div className="price tabular">490 Kč</div>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Detail</h3>
          </div>
          <dl className="kv">
            <dt>ID zákazníka</dt><dd className="mono">{c.id}</dd>
            <dt>Klientem od</dt><dd>{c.since}</dd>
            <dt>Lokalita</dt><dd>{c.city}</dd>
            <dt>IBAN</dt><dd className="mono">CZ65 0800 …45399</dd>
            <dt>Splatnost</dt><dd>14 dní</dd>
            <dt>Kontakt</dt><dd>+420 776 314 821</dd>
            <dt>E-mail</dt><dd style={{ fontWeight: 500 }}>{c.name.toLowerCase().replace(/[^a-z]/g, '.') }@example.cz</dd>
          </dl>
          <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}><img src="../../assets/icons/file-text.svg" alt="" />Smlouva</button>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}><img src="../../assets/icons/credit-card.svg" alt="" />Faktury</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function CustomersPage() {
  const [selectedId, setSelectedId] = useStateCP(null);
  return (
    <React.Fragment>
      <div className="page-title">
        <div>
          <h2>Zákazníci</h2>
          <div className="sub">1 540 aktivních smluv · MRR 1,84 M Kč</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary"><img src="../../assets/icons/download.svg" alt="" />Export CSV</button>
          <button className="btn btn-primary"><img src="../../assets/icons/plus.svg" style={{ filter: 'invert(1)' }} alt="" />Nový zákazník</button>
        </div>
      </div>

      {selectedId
        ? <React.Fragment>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => setSelectedId(null)}>
              <img src="../../assets/icons/chevron-left.svg" alt="" />Zpět na seznam
            </button>
            <CustomerDetail id={selectedId} />
          </React.Fragment>
        : <CustomerTable selectedId={selectedId} onSelect={setSelectedId} />
      }
    </React.Fragment>
  );
}

window.CustomersPage = CustomersPage;
