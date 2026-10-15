import nodemailer from 'nodemailer';
import { getContent } from './content.js';
import { isRateLimited, json, readJson } from './http.js';

const COMPANY_NAME = 'BMB-Green s.r.o.';

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

export async function contactFormRoute(request, { storage, ip }) {
  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);

  const data = (await readJson(request)) || {};

  // The hidden "hpCheck" field is filled in only by bots; they get a success without anything being sent.
  if (stringValue(data.hpCheck)) return json({ success: true });

  if (isRateLimited(`form:${ip}`, 5, 10 * 60 * 1000)) {
    return json({ success: false, error: 'Příliš mnoho zpráv za krátkou dobu. Zkuste to prosím později.' }, 429);
  }

  const normalized = normalizeSubmission(data);
  const validationError = validateSubmission(normalized);
  if (validationError) return json({ success: false, error: validationError }, 400);

  try {
    const settings = mailSettings();
    if (!isMailConfigured()) throw new Error('E-mail is not configured: fill in SMTP_* and MAIL_TO_* in .env.');

    const contacts = await getContent(storage, 'contacts');
    const transporter = createTransport(settings);
    const needsServiceInterest = serviceInterestReasons.has(normalized.reason);
    const recipient = outageSupportReasons.has(normalized.reason) ? settings.toVypadky : settings.toPoptavky;
    const reasonLabel = reasonLabels[normalized.reason];
    const serviceLabel = serviceLabels[normalized.service] || '';
    const submittedAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    await transporter.sendMail({
      from: fromAddress(settings),
      to: recipient,
      replyTo: normalized.email || undefined,
      subject: `${reasonLabel} - ${normalized.name}`,
      html: buildCompanyEmail({ ...normalized, reasonLabel, serviceLabel, submittedAt, recipient }),
    });

    // The message has reached BMB at this point, so a failed confirmation still counts as sent.
    if (needsServiceInterest && normalized.email) {
      try {
        await transporter.sendMail({
          from: fromAddress(settings),
          to: normalized.email,
          subject: `Potvrzení kontaktu - ${COMPANY_NAME}`,
          html: buildClientEmail({ contacts }),
        });
      } catch (error) {
        console.error('Customer confirmation failed:', error);
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return json({ success: false, error: 'Zprávu se nepodařilo odeslat.' }, 500);
  }
}

// The sending mailbox and the two recipient addresses come from .env.
function mailSettings() {
  return {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    toPoptavky: process.env.MAIL_TO_POPTAVKY,
    toVypadky: process.env.MAIL_TO_VYPADKY,
  };
}

export function isMailConfigured() {
  return Object.values(mailSettings()).every(Boolean);
}

function createTransport(settings) {
  const port = Number(settings.port);
  return nodemailer.createTransport({
    host: settings.host,
    port,
    secure: port === 465,
    auth: { user: settings.user, pass: settings.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
  });
}

function fromAddress(settings) {
  return `"${COMPANY_NAME}" <${settings.user}>`;
}

function normalizeSubmission(data) {
  const reason = stringValue(data.reason);
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
  if (data.name.length > 200 || data.phone.length > 50 || data.message.length > 5000) return 'Zpráva je příliš dlouhá.';

  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9) return 'Telefon musí mít alespoň 9 číslic.';

  if (serviceInterestReasons.has(data.reason)) {
    if (!data.email) return 'Vyplňte e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Zadejte platný e-mail.';
    if (!serviceLabels[data.service]) return 'Vyberte službu, která Vás zajímá.';
  }

  return '';
}

function buildClientEmail({ contacts }) {
  const contactLines = [contacts?.email, contacts?.telefon]
    .filter(Boolean)
    .map((value) => `<p>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
    .join('');

  return emailShell({
    title: 'Potvrzení kontaktu',
    subtitle: COMPANY_NAME,
    content: `
      <p>Dobrý den,</p>
      <p>děkujeme za Vaši zprávu. Vaši poptávku jsme přijali a brzy se Vám ozveme.</p>
      <div class="highlight">
        <p><strong>Co bude následovat:</strong></p>
        <p>• Prověříme Vaši poptávku</p>
        <p>• Ozveme se Vám na uvedené kontaktní údaje</p>
        <p>• Připravíme další postup nebo konkrétní nabídku</p>
      </div>
      ${contactLines ? `
      <div class="contact-info">
        <p><strong>Kontakty BMB-Green:</strong></p>
        ${contactLines}
      </div>` : ''}
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
