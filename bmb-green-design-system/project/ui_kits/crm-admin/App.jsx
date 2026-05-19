// App.jsx — composes the CRM/Admin
const { useState: useStateApp } = React;

const ROUTES = {
  dashboard:  { crumbs: ['CRM', 'Přehled', 'Dashboard'],  render: () => <Dashboard /> },
  inbox:      { crumbs: ['CRM', 'Přehled', 'Tickety'],     render: () => <TicketsPage /> },
  customers:  { crumbs: ['CRM', 'Zákazníci', 'Zákazníci'], render: () => <CustomersPage /> },
  billing:    { crumbs: ['CRM', 'Zákazníci', 'Fakturace'], render: () => <BillingPage /> },
  network:    { crumbs: ['CRM', 'Síť', 'Síťové prvky'],     render: () => <NetworkPage /> },
};

function EmptyPage({ title }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>{title}</h3></div>
      <div className="empty-state">Tato sekce zatím není připravena.</div>
    </div>
  );
}

function CrmApp() {
  const [view, setView] = useStateApp('dashboard');
  const route = ROUTES[view];

  return (
    <React.Fragment>
      <Sidebar active={view} onChange={setView} />
      <div className="main">
        <TopBar crumbs={route ? route.crumbs : ['CRM', view]} onNewCustomer={() => setView('customers')} />
        <div className="content">
          {route ? route.render() : <EmptyPage title={view} />}
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CrmApp />);
