# Web BMB-Green

Webové stránky bmb-green.cz a jejich administrace.

- **Část 1** je pro BMB-Green: jak web upravovat a co dělat, když něco nefunguje.
- **Část 2** je pro správce serveru: instalace, nastavení, aktualizace a zálohy.

---

# Část 1: Pro BMB-Green

## Co web obsahuje

- **Veřejné stránky** – úvod, Balíčky, Internet, Televize, Volání, Pro zákazníky, Kontakty, Ke stažení.
- **Administrace** na adrese **bmb-green.cz/admin** – tady se upravuje obsah webu. Programátora k tomu nepotřebujete.

## Administrace

Přihlásíte se heslem, které nastavil správce serveru. Přihlášení vydrží 30 dní.

| Záložka | Co upravuje |
|---|---|
| Pokrytí | Lokality na mapě, rychlosti, ulice, počty přípojek. Stav lokality (výpadek, omezení) se zobrazí i jako upozornění v horní liště webu. |
| Časté dotazy | Otázky a odpovědi. |
| Novinky | Zprávy na stránce Pro zákazníky. Dokud žádná novinka není, sekce se nezobrazuje. |
| Kontakty | Telefon, e-mail, adresy, IČO, DIČ, provozní doba. Zobrazují se v patičce, na stránce Kontakty a v potvrzovacích e-mailech zákazníkům. |
| Balíčky, Internet, Televize, Volání | Texty a ceny na stránkách služeb. |
| Ke stažení | Dokumenty ve formátu PDF (ceníky, podmínky…), nejvýše 20 MB na soubor. |

Každá změna se na webu projeví po kliknutí na **Uložit**. Nahrané obrázky se automaticky zmenší na velikost vhodnou pro web.

Texty na úvodní stránce (služby, „proč my“, statistiky) se v administraci neupravují – jejich změna je práce pro vývojáře.

## E-maily z formulářů

Web má dva formuláře: **Kontakty** a **Nahlásit výpadek** (na stránce Pro zákazníky).

- Poptávky a ostatní dotazy chodí na jednu adresu, výpadky a technická podpora na druhou.
- Zákazník, který poptává služby, dostane automatické potvrzení.
- Na zprávu z webu stačí kliknout na **Odpovědět** – odpověď půjde přímo zákazníkovi.
- Formuláře jsou chráněné proti spamu.

Adresy, ze které a na které se e-maily posílají, nastavuje správce serveru (část 2).

## Když něco nefunguje

- **Formulář hlásí chybu při odesílání** – správce serveru zkontroluje nastavení e-mailu v souboru `.env` a záznam (log) serveru.
- **Zapomenuté heslo do administrace** – správce serveru nastaví nové v souboru `.env`.

---

# Část 2: Pro správce serveru

## Jak web funguje

Jeden Node.js proces obsluhuje celý web: stránky (sestavený React), API pro administraci a formuláře a nahrané soubory. Databáze není potřeba – obsah se ukládá do souborů ve složce `server/data/`.

```
BMB-Green/
├─ client/              React + Vite: veřejný web i administrace (/admin)
└─ server/
   ├─ server.js         spuštění serveru: načte .env, obsluhuje stránky, API a nahrané soubory
   ├─ router.js         URL → handler
   ├─ content.js        čtení a ukládání obsahu sekcí
   ├─ uploads.js        nahrávání, servírování a mazání obrázků a PDF
   ├─ auth.js           přihlášení do administrace
   ├─ email.js          odesílání formulářů
   ├─ http.js           pomocné funkce (JSON odpovědi, omezení počtu požadavků)
   ├─ storage.js        ukládání do server/data/
   ├─ data/             obsah webu (JSON) a nahrané soubory (uploads/)
   └─ .env.example      vzor nastavení
```

## Instalace

Potřeba je **Node.js 20.12 nebo novější**.

```
cd client
npm install
npm run build          # sestaví web do client/dist

cd ../server
npm install
cp .env.example .env   # pak .env vyplňte
npm start
```

Server poslouchá na portu z `server/.env` (výchozí 8090). Před něj patří reverzní proxy s HTTPS, která na tento port přeposílá všechny požadavky pro bmb-green.cz. Proces spouštějte jako službu, aby se po restartu serveru spustil znovu.

### Příklad: nginx

```
server {
    server_name bmb-green.cz www.bmb-green.cz;
    client_max_body_size 25m;   # nahrávání PDF do 20 MB (výchozí limit nginx je 1 MB)

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

HTTPS certifikát doplní např. `certbot --nginx -d bmb-green.cz -d www.bmb-green.cz`.

### Příklad: Apache

Potřebné moduly: `proxy`, `proxy_http` (`a2enmod proxy proxy_http`).

```
<VirtualHost *:80>
    ServerName bmb-green.cz
    ServerAlias www.bmb-green.cz
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8090/
    ProxyPassReverse / http://127.0.0.1:8090/
</VirtualHost>
```

Apache posílá hlavičku `X-Forwarded-For` sám. HTTPS certifikát doplní např. `certbot --apache -d bmb-green.cz -d www.bmb-green.cz`.

### Příklad: služba (systemd)

`/etc/systemd/system/bmb-green.service` (cestu a uživatele upravte):

```
[Unit]
Description=Web BMB-Green
After=network.target

[Service]
WorkingDirectory=/srv/bmb-green/server
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

Uživatel služby musí mít právo zápisu do `server/data/`. Spuštění: `systemctl enable --now bmb-green`, záznam (log): `journalctl -u bmb-green`.

## Nastavení (server/.env)

| Proměnná | Význam |
|---|---|
| `PORT` | port serveru |
| `ADMIN_PASSWORD` | heslo do administrace; jeho změna odhlásí všechny přihlášené |
| `SMTP_HOST`, `SMTP_PORT` | server odchozí pošty; port 465 = SSL, 587 = STARTTLS |
| `SMTP_USER`, `SMTP_PASS` | schránka, ze které web posílá (např. web@bmb-green.cz) |
| `MAIL_TO_POPTAVKY` | kam chodí poptávky a ostatní dotazy |
| `MAIL_TO_VYPADKY` | kam chodí výpadky a technická podpora |

Server čte `.env` při spuštění – po změně ho restartujte. Když něco chybí, vypíše při startu varování.

## Data a zálohy

`server/data/` obsahuje celý obsah webu: každá sekce je jeden soubor (`news.json`, `balicky.json`…) a nahrané obrázky a PDF jsou v `uploads/`. Administrace ukládá přímo sem. **Tuto složku zálohujte.**

## Aktualizace kódu

Nahraďte soubory kódu novou verzí (`server/data/` a `server/.env` nechte být), pak spusťte `npm install` a `npm run build` v `client/`, `npm install` v `server/` a restartujte službu.

## Bezpečnost

- Všechny zápisy (ukládání, nahrávání, mazání) vyžadují přihlášení. Přihlášení je podepsaný token s platností 30 dní.
- Přihlášení: nejvýše 10 pokusů za 15 minut z jedné adresy. Formuláře: nejvýše 5 zpráv za 10 minut z jedné adresy a skryté pole proti robotům.
- Adresu návštěvníka server bere z hlavičky `X-Forwarded-For` (viz příklady výše), pokud požadavek přichází od proxy na stejném počítači nebo z vnitřní sítě.

## Lokální vývoj

Dva terminály:

```
cd server && npm install && npm start    # API na http://localhost:8090
cd client && npm install && npm run dev  # web na http://localhost:5173 (požadavky na /api a /uploads jdou na port 8090)
```
