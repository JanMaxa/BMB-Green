// Dashboard.jsx — KPIs + revenue chart + activity feed
function Dashboard() {
  const kpis = [
    { lbl: 'Aktivní zákazníci', val: '1 540', delta: '+18 / 30 d', icon: 'users' },
    { lbl: 'MRR', val: '1,84 M Kč', delta: '+3,2 %', icon: 'trending-up' },
    { lbl: 'Otevřené tickety', val: '12', delta: '−4 / 7 d', down: false, icon: 'inbox' },
    { lbl: 'Po splatnosti', val: '24', delta: '+6 / 7 d', down: true, icon: 'alert-circle' },
  ];

  // SVG sparkline-style chart (revenue last 12 months, illustrative)
  const points = [62, 65, 68, 67, 71, 74, 78, 82, 85, 88, 92, 96];
  const max = Math.max(...points), min = Math.min(...points);
  const W = 760, H = 200, PAD = 32;
  const stepX = (W - PAD * 2) / (points.length - 1);
  const norm = v => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${PAD + i * stepX} ${norm(v)}`).join(' ');
  const area = path + ` L ${PAD + (points.length - 1) * stepX} ${H - PAD} L ${PAD} ${H - PAD} Z`;
  const months = ['Čv', 'Čc', 'Sr', 'Zá', 'Ří', 'Li', 'Pr', 'Le', 'Ún', 'Bř', 'Du', 'Kv'];

  return (
    <React.Fragment>
      <div className="page-title">
        <div>
          <h2>Dobrý den, Martine.</h2>
          <div className="sub">Přehled za posledních 30 dní · 18. 5. 2026</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary"><img src="../../assets/icons/download.svg" alt="" />Export</button>
          <button className="btn btn-secondary"><img src="../../assets/icons/calendar.svg" alt="" />Posledních 30 dní</button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map(k => (
          <div className="kpi" key={k.lbl}>
            <div className="kpi-lbl">
              <img src={`../../assets/icons/${k.icon}.svg`} alt="" />
              {k.lbl}
            </div>
            <div className="kpi-val tabular">{k.val}</div>
            <div className={'kpi-delta' + (k.down ? ' down' : '')}>
              <img src={`../../assets/icons/${k.down ? 'arrow-right' : 'trending-up'}.svg`} alt="" />
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Růst MRR</h3>
            <div className="meta">posledních 12 měsíců · v tis. Kč</div>
            <div className="right">
              <div className="tabs">
                <button className="active">MRR</button>
                <button>Noví</button>
                <button>Churn</button>
              </div>
            </div>
          </div>
          <div className="chart">
            <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14AE4B" stopOpacity="0.22"/>
                  <stop offset="100%" stopColor="#14AE4B" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* horizontal grid */}
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1={PAD} x2={W - PAD} y1={PAD + i * ((H - PAD * 2) / 3)} y2={PAD + i * ((H - PAD * 2) / 3)} stroke="#EAEDEC" />
              ))}
              <path d={area} fill="url(#grd)" />
              <path d={path} fill="none" stroke="#14AE4B" strokeWidth="2.5" strokeLinecap="round" />
              {points.map((v, i) => (
                <circle key={i} cx={PAD + i * stepX} cy={norm(v)} r={i === points.length - 1 ? 5 : 3} fill={i === points.length - 1 ? '#14AE4B' : '#fff'} stroke="#14AE4B" strokeWidth="2" />
              ))}
              {months.map((m, i) => (
                <text key={i} x={PAD + i * stepX} y={H - 8} fontSize="10" fill="#8C9491" textAnchor="middle" fontFamily="Manrope">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Poslední aktivita</h3>
            <div className="right">
              <button className="btn btn-ghost btn-sm">Vše</button>
            </div>
          </div>
          <div className="feed">
            <div className="feed-item">
              <div className="pip"></div>
              <div>
                <div className="body"><b>Petra Dvořáková</b> — instalace Profi 500 dokončena na adrese U&nbsp;Vodojemu 2282.</div>
                <div className="ts">před 14 min</div>
              </div>
            </div>
            <div className="feed-item">
              <div className="pip info"></div>
              <div>
                <div className="body"><b>Ticket #T-2087</b> přiřazen technikovi <b>Pavel K.</b> — výpadek na patch panelu BRA-01.</div>
                <div className="ts">před 42 min</div>
              </div>
            </div>
            <div className="feed-item">
              <div className="pip warn"></div>
              <div>
                <div className="body">Faktura <b>2025-04-0123</b> přechází do stavu <b>po splatnosti</b> (Tomáš Černý).</div>
                <div className="ts">před 1 h 6 min</div>
              </div>
            </div>
            <div className="feed-item">
              <div className="pip"></div>
              <div>
                <div className="body"><b>SVJ Vodojem 2281</b> — uzavřena nová smlouva, 18× Komplet 1G.</div>
                <div className="ts">před 2 h</div>
              </div>
            </div>
            <div className="feed-item">
              <div className="pip info"></div>
              <div>
                <div className="body">Plánovaná údržba páteře <b>BRA-01 → PRA-02</b> nastavena na neděli 2:00.</div>
                <div className="ts">před 3 h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

window.Dashboard = Dashboard;
