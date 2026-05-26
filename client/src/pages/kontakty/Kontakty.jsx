import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import ContactCta from '../../components/ContactCta/ContactCta.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import autoImage from '../../assets/auto.webp';
import styles from './Kontakty.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

const serviceInterestReasons = [
  'zajem-o-sluzby',
  'overeni-dostupnosti',
];

export default function Kontakty() {
  const [reason, setReason] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const showServiceInterest = serviceInterestReasons.includes(reason);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramReason = params.get('reason');
    const paramService = params.get('service');
    if (paramReason) setReason(paramReason);
    if (paramService) setFormData((current) => ({ ...current, service: paramService }));
  }, []);

  const handleReasonChange = (event) => {
    const nextReason = event.target.value;
    setReason(nextReason);
    setSubmitStatus(null);
    setErrors((current) => ({ ...current, reason: '' }));

    if (!serviceInterestReasons.includes(nextReason)) {
      setFormData((current) => ({ ...current, email: '', service: '' }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSubmitStatus(null);

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (!reason) nextErrors.reason = 'Vyberte důvod zprávy.';
    if (!formData.name.trim()) nextErrors.name = 'Vyplňte jméno a příjmení.';
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Vyplňte telefon.';
    } else if (phoneDigits.length < 9) {
      nextErrors.phone = 'Telefon musí mít alespoň 9 číslic.';
    }

    if (showServiceInterest) {
      if (!formData.email.trim()) {
        nextErrors.email = 'Vyplňte e-mail.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        nextErrors.email = 'Zadejte platný e-mail.';
      }

      if (!formData.service) nextErrors.service = 'Vyberte službu.';
    }

    if (!formData.message.trim()) nextErrors.message = 'Vyplňte zprávu.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          name: formData.name,
          phone: formData.phone,
          email: showServiceInterest ? formData.email : '',
          service: showServiceInterest ? formData.service : '',
          message: formData.message,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Send failed');
      }

      setSubmitStatus('success');
      setReason('');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className={cx(layout.section, layout.topSection, layout.topGradient)}>
        <div className={layout.container}>
          <div className={styles.contactFormLayout}>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <label>
                <span>Důvod zprávy <span className={styles.requiredMark}>*</span></span>
                <select
                  name="reason"
                  value={reason}
                  onChange={handleReasonChange}
                  className={errors.reason ? styles.invalidField : undefined}
                >
                  <option value="" disabled>Vyberte důvod, proč nám píšete</option>
                  <option value="zajem-o-sluzby">Zájem o služby</option>
                  <option value="overeni-dostupnosti">Ověření dostupnosti na adrese</option>
                  <option value="oznameni-vypadku">Oznámení výpadku</option>
                  <option value="technicka-podpora">Technická podpora</option>
                  <option value="fakturace-smlouva">Fakturace nebo smlouva</option>
                  <option value="jine">Jiné</option>
                </select>
                {errors.reason && <span className={styles.errorText}>{errors.reason}</span>}
              </label>
              <div className={styles.contactFields}>
                <label>
                  <span>Jméno a příjmení <span className={styles.requiredMark}>*</span></span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? styles.invalidField : undefined}
                    placeholder="Jan Novák"
                  />
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </label>
                <label>
                  <span>Telefon <span className={styles.requiredMark}>*</span></span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? styles.invalidField : undefined}
                    placeholder="+420 123 456 789"
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </label>
                {showServiceInterest && (
                  <>
                    <label>
                      <span>E-mail <span className={styles.requiredMark}>*</span></span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? styles.invalidField : undefined}
                        placeholder="jan@novak.cz"
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </label>
                    <label>
                      <span>Nejvíce mě zajímá <span className={styles.requiredMark}>*</span></span>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={errors.service ? styles.invalidField : undefined}
                        required
                      >
                        <option value="" disabled>Vyberte službu</option>
                        <option value="internet">Internet</option>
                        <option value="televize">Televize</option>
                        <option value="volani">Volání</option>
                        <option value="zabezpeceni">Zabezpečení</option>
                        <option value="fotovoltaika">Fotovoltaika</option>
                        <option value="site-a-kabelaz">Sítě a kabeláž</option>
                        <option value="kamerove-systemy">Kamerové systémy</option>
                        <option value="pro-developery">Pro developery</option>
                      </select>
                      {errors.service && <span className={styles.errorText}>{errors.service}</span>}
                    </label>
                  </>
                )}
              </div>
              <label>
                <span>Zpráva <span className={styles.requiredMark}>*</span></span>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? styles.invalidField : undefined}
                  placeholder="Napište adresu, požadovanou službu nebo termín, který Vám vyhovuje."
                ></textarea>
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </label>
              <div className={styles.formFooter}>
                <Button className={styles.submitButton} size="lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Odesílám...' : 'Odeslat poptávku'}
                  <img src="/assets/icons/arrow-right.svg" alt="" />
                </Button>
              </div>
              {submitStatus === 'success' && (
                <div className={styles.successMessage}>Zpráva byla úspěšně odeslána. Brzy se Vám ozveme.</div>
              )}
              {submitStatus === 'error' && (
                <div className={styles.errorMessage}>Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo zavolejte.</div>
              )}
            </form>
            <div className={styles.contactFormCopy}>
              <h2>Nezávazná poptávka</h2>
              <p>Napište nám, co potřebujete vyřešit. Ozveme se Vám nejpozději do druhého pracovního dne.</p>
              <ul className={styles.contactReasons}>
                <li><img src="/assets/icons/check.svg" alt="" />Prověříme dostupnost služby na Vaší adrese.</li>
                <li><img src="/assets/icons/check.svg" alt="" />Doporučíme vhodný tarif, technologii i termín instalace.</li>
                <li><img src="/assets/icons/check.svg" alt="" />Připravíme konkrétní nabídku bez závazku.</li>
              </ul>
              <div className={styles.contactFormImage}>
                <img src={autoImage} alt="Servisní vůz BMB-Green" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
