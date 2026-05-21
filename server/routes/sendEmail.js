import nodemailer from 'nodemailer';

const SMTP_HOST = 'smtp.example.com';
const SMTP_PORT = 465;
const SMTP_USER = 'smlouva@bmb-green.cz';
const SMTP_PASS = 'DOPLNIT_HESLO_EMAILU';

const COMPANY_NAME = 'BMB-Green s.r.o.';
const FROM_EMAIL = `"${COMPANY_NAME}" <${SMTP_USER}>`;
const NEW_CUSTOMER_TO = 'smlouva@bmb-green.cz';
const EXISTING_CUSTOMER_TO = 'vypadky@bmb-green.cz';
const CONTACT_PHONE = '+420 266 317 129';
const CONTACT_EMAIL = 'smlouva@bmb-green.cz';

const serviceInterestReasons = new Set([
  'zajem-o-sluzby',
  'overeni-dostupnosti',
]);

const outageSupportReasons = new Set([
  'oznameni-vypadku',
  'technicka-podpora',
]);

const reasonLabels = {
  'zajem-o-sluzby': 'Zájem o služby',
  'overeni-dostupnosti': 'Ověření dostupnosti na adrese',
  'oznameni-vypadku': 'Oznámení výpadku',
  'technicka-podpora': 'Technická podpora',
  'fakturace-smlouva': 'Fakturace nebo smlouva',
  jine: 'Jiné',
};

const serviceLabels = {
  internet: 'Internet',
  televize: 'Televize',
  volani: 'Volání',
  zabezpeceni: 'Zabezpečení',
  fotovoltaika: 'Fotovoltaika',
  'site-a-kabelaz': 'Sítě a kabeláž',
  'kamerove-systemy': 'Kamerové systémy',
  'pro-developery': 'Pro developery',
};

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export default async function sendEmailRoute(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readRequestBody(req);
    const data = JSON.parse(body || '{}');
    const normalized = normalizeSubmission(data);
    const validationError = validateSubmission(normalized);

    if (validationError) {
      sendJson(res, 400, { success: false, error: validationError });
      return;
    }

    if (!isSmtpConfigured()) {
      throw new Error('SMTP není nakonfigurované. Doplňte SMTP_HOST, SMTP_USER a SMTP_PASS v server/routes/sendEmail.js.');
    }

    const needsServiceInterest = serviceInterestReasons.has(normalized.reason);
    const recipient = outageSupportReasons.has(normalized.reason) ? EXISTING_CUSTOMER_TO : NEW_CUSTOMER_TO;
    const reasonLabel = reasonLabels[normalized.reason];
    const serviceLabel = serviceLabels[normalized.service] || '';
    const submittedAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: recipient,
      replyTo: normalized.email || undefined,
      subject: buildCompanySubject(reasonLabel, normalized.name),
      html: buildCompanyEmail({ ...normalized, reasonLabel, serviceLabel, submittedAt, recipient }),
    });

    if (needsServiceInterest && normalized.email) {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: normalized.email,
        subject: `Potvrzení kontaktu - ${COMPANY_NAME}`,
        html: buildClientEmail({ ...normalized, reasonLabel, serviceLabel }),
      });
    }

    sendJson(res, 200, { success: true });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    sendJson(res, 500, { success: false, error: 'Zprávu se nepodařilo odeslat.' });
  }
}

function normalizeSubmission(data) {
  const reason = typeof data.reason === 'string' ? data.reason.trim() : '';
  const needsServiceInterest = serviceInterestReasons.has(reason);

  return {
    reason,
    name: stringValue(data.name),
    phone: stringValue(data.phone),
    email: needsServiceInterest ? stringValue(data.email) : '',
    service: needsServiceInterest ? stringValue(data.service) : '',
    message: stringValue(data.message),
  };
}

function validateSubmission(data) {
  if (!reasonLabels[data.reason]) return 'Vyberte důvod zprávy.';
  if (!data.name) return 'Vyplňte jméno a příjmení.';
  if (!data.phone) return 'Vyplňte telefon.';
  if (!data.message) return 'Vyplňte zprávu.';

  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9) return 'Telefon musí mít alespoň 9 číslic.';

  if (serviceInterestReasons.has(data.reason)) {
    if (!data.email) return 'Vyplňte e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Zadejte platný e-mail.';
    if (!serviceLabels[data.service]) return 'Vyberte službu, která Vás zajímá.';
  }

  return '';
}

function buildCompanySubject(reasonLabel, name) {
  return `${reasonLabel} - ${name}`;
}

function buildClientEmail({ name, reasonLabel, serviceLabel }) {
  return emailShell({
    title: 'Potvrzení kontaktu',
    subtitle: COMPANY_NAME,
    content: `
      <p>Dobrý den${name ? `, ${escapeHtml(name)}` : ''},</p>
      <p>děkujeme za Vaši zprávu. Vaši poptávku jsme přijali a brzy se Vám ozveme.</p>
      <div class="highlight">
        <p><strong>Co bude následovat:</strong></p>
        <p>• Prověříme Vaši poptávku</p>
        <p>• Ozveme se Vám na uvedené kontaktní údaje</p>
        <p>• Připravíme další postup nebo konkrétní nabídku</p>
      </div>
      <div class="contact-info">
        <p><strong>Souhrn:</strong></p>
        <p>Důvod zprávy: ${escapeHtml(reasonLabel)}</p>
        ${serviceLabel ? `<p>Nejvíce Vás zajímá: ${escapeHtml(serviceLabel)}</p>` : ''}
      </div>
      <div class="contact-info">
        <p><strong>Kontakty BMB-Green:</strong></p>
        <p>${escapeHtml(CONTACT_EMAIL)}</p>
        <p>${escapeHtml(CONTACT_PHONE)}</p>
      </div>
      <p>S pozdravem<br><strong>${COMPANY_NAME}</strong></p>
    `,
  });
}

function buildCompanyEmail({ reasonLabel, serviceLabel, name, phone, email, message, submittedAt, recipient }) {
  return emailShell({
    title: 'Nová zpráva z webu',
    subtitle: 'bmb-green.cz',
    content: `
      <p>Dobrý den,</p>
      <p>z kontaktního formuláře přišla nová zpráva.</p>
      <div class="details">
        <p><span class="detail-label">Důvod zprávy:</span> <span class="detail-value">${escapeHtml(reasonLabel)}</span></p>
        <p><span class="detail-label">Jméno:</span> <span class="detail-value">${escapeHtml(name)}</span></p>
        <p><span class="detail-label">Telefon:</span> <span class="detail-value">${escapeHtml(phone)}</span></p>
        ${email ? `<p><span class="detail-label">E-mail:</span> <span class="detail-value">${escapeHtml(email)}</span></p>` : ''}
        ${serviceLabel ? `<p><span class="detail-label">Nejvíce se zajímá o:</span> <span class="detail-value">${escapeHtml(serviceLabel)}</span></p>` : ''}
        <p><span class="detail-label">Doručeno na:</span> <span class="detail-value">${escapeHtml(recipient)}</span></p>
      </div>
      <div class="message-box">
        <p><span class="detail-label">Zpráva:</span></p>
        <p>${message ? escapeHtml(message).replace(/\n/g, '<br>') : 'Bez zprávy.'}</p>
      </div>
      <div class="timestamp">
        <p><strong>Čas přijetí:</strong> ${escapeHtml(submittedAt)}</p>
      </div>
    `,
  });
}

function emailShell({ title, subtitle, content }) {
  return `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(title)} - ${COMPANY_NAME}</title>
      <style>
        body {
          background-color: #f4f6f4;
          color: #121514;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          background: #ffffff;
          border: 1px solid #eaecec;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(18, 21, 20, 0.08);
          margin: 20px auto;
          max-width: 600px;
          padding: 30px;
        }
        .header {
          border-bottom: 3px solid #14ae4b;
          margin-bottom: 30px;
          padding-bottom: 20px;
          text-align: center;
        }
        h1 {
          color: #121514;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px;
        }
        .subtitle {
          color: #14ae4b;
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
        }
        p {
          color: #434947;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 16px;
        }
        .highlight,
        .details {
          background: #ecfbf1;
          border-left: 4px solid #14ae4b;
          border-radius: 8px;
          margin: 20px 0;
          padding: 20px;
        }
        .contact-info,
        .message-box,
        .timestamp {
          background: #f4f6f4;
          border-radius: 8px;
          margin: 16px 0;
          padding: 15px;
        }
        .detail-label {
          color: #121514;
          font-weight: 700;
        }
        .detail-value {
          color: #434947;
          font-weight: 500;
        }
        .footer {
          border-top: 1px solid #eaecec;
          color: #5f6764;
          font-size: 0.9rem;
          margin-top: 30px;
          padding-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${escapeHtml(title)}</h1>
          <p class="subtitle">${escapeHtml(subtitle)}</p>
        </div>
        ${content}
        <div class="footer">
          <p>Toto je automaticky generovaný e-mail z webu.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function stringValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isSmtpConfigured() {
  return SMTP_HOST && SMTP_HOST !== 'smtp.example.com' && SMTP_USER && SMTP_PASS && SMTP_PASS !== 'DOPLNIT_HESLO_EMAILU';
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
