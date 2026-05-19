// ContactFooter.jsx — contact CTA card + dark footer
function ContactCard() {
  return (
    <section className="section">
      <div className="container">
        <div className="contact-card">
          <div>
            <h2>Pomůžeme Vám vybrat to&nbsp;správné.</h2>
            <p>
              Nevíte si rady s&nbsp;tarifem, plánujete novostavbu nebo Vás zajímá fotovoltaika?
              Zavolejte v&nbsp;pracovní dny 8–17&nbsp;h nebo nám napište — odpovíme do druhého pracovního dne.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary btn-lg">Zavolat technika</button>
              <button className="btn btn-secondary btn-lg">Napsat e-mail</button>
            </div>
          </div>
          <div className="contact-list">
            <div className="contact-row">
              <div className="ic"><img src="../../assets/icons/phone.svg" alt="" /></div>
              <div><div className="l">Telefon</div><div className="v">+420 266 317 129</div></div>
            </div>
            <div className="contact-row">
              <div className="ic"><img src="../../assets/icons/mail.svg" alt="" /></div>
              <div><div className="l">E-mail</div><div className="v">info@bmb-green.cz</div></div>
            </div>
            <div className="contact-row">
              <div className="ic"><img src="../../assets/icons/map-pin.svg" alt="" /></div>
              <div><div className="l">Sídlo</div><div className="v">Brandýs nad Labem, 250 01</div></div>
            </div>
            <div className="contact-row">
              <div className="ic"><img src="../../assets/icons/clock.svg" alt="" /></div>
              <div><div className="l">Provozní doba</div><div className="v">Po–Pá 8:00–17:00</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="../../assets/logo-on-dark.svg" alt="BMB-Green" style={{ height: 28, marginBottom: 18 }} />
            <p className="footer-blurb">
              Česká technologická společnost. Stavíme rychlé sítě, instalujeme bezpečnostní
              a&nbsp;fotovoltaické systémy. Od roku 1991.
            </p>
          </div>
          <div>
            <h4>Produkty</h4>
            <ul>
              <li><a href="#">Internet</a></li>
              <li><a href="#">Televize</a></li>
              <li><a href="#">Volání</a></li>
              <li><a href="#">Fotovoltaika</a></li>
            </ul>
          </div>
          <div>
            <h4>Pro firmy</h4>
            <ul>
              <li><a href="#">Developerské projekty</a></li>
              <li><a href="#">EZS, EPS a CCTV</a></li>
              <li><a href="#">Optické trasy</a></li>
              <li><a href="#">Servis a revize</a></li>
            </ul>
          </div>
          <div>
            <h4>Podpora</h4>
            <ul>
              <li><a href="#">Kontakty</a></li>
              <li><a href="#">Ke stažení</a></li>
              <li><a href="#">Smluvní podmínky</a></li>
              <li><a href="#">Mapa pokrytí</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 1991–2026 BMB-Green s.r.o. · IČO 24658391</div>
          <div>U Vodojemu 2281, Brandýs nad Labem · +420 266 317 129</div>
        </div>
      </div>
    </footer>
  );
}

window.ContactCard = ContactCard;
window.Footer = Footer;
