// App.jsx — composes the full landing page
function LandingApp() {
  return (
    <React.Fragment>
      <Header />
      <Hero />
      <PackagesSection />
      <ServicesSection />
      <CoverageSection />
      <TrustBand />
      <ContactCard />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LandingApp />);
