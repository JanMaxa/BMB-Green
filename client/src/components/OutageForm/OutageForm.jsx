import { useState } from 'react';
import Button from '../Button/Button.jsx';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './OutageForm.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';
const REASON = 'oznameni-vypadku';

export default function OutageForm({ className }) {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((curr) => ({ ...curr, [name]: value }));
    setSubmitStatus(null);
    if (errors[name]) setErrors((curr) => ({ ...curr, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Vyplňte jméno a příjmení.';
    if (!formData.phone.trim()) {
      next.phone = 'Vyplňte telefon.';
    } else if (formData.phone.replace(/\D/g, '').length < 9) {
      next.phone = 'Telefon musí mít alespoň 9 číslic.';
    }
    if (!formData.message.trim()) next.message = 'Popište problém.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: REASON, ...formData, email: '', service: '' }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cx(layout.section, className)}>
      <div className={layout.container}>
        <div className={styles.outageLayout}>
          <div className={styles.outageCopy}>
            <h2>Nahlásit výpadek nebo problém</h2>
            <p>Zaznamenali jste problém s připojením? Dejte nám vědět — naši technici se Vaším hlášením okamžitě zabývají.</p>
            <ul className={styles.outageReasons}>
              <li><img src="/assets/icons/check.svg" alt="" />Hlášení dorazí přímo k našim technikům na dispečink.</li>
              <li><img src="/assets/icons/check.svg" alt="" />Ozveme se Vám a potvrdíme zahájení řešení.</li>
              <li><img src="/assets/icons/check.svg" alt="" />Výpadky opravujeme prioritně, obvykle do několika hodin.</li>
            </ul>
          </div>

          <form className={styles.outageForm} onSubmit={handleSubmit}>
            <div className={styles.outageFields}>
              <label>
                <span>Jméno a příjmení <span className={styles.requiredMark}>*</span></span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className={errors.phone ? styles.invalidField : undefined}
                  placeholder="+420 123 456 789"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </label>
            </div>
            <label>
              <span>Popis problému <span className={styles.requiredMark}>*</span></span>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? styles.invalidField : undefined}
                placeholder="Popište výpadek nebo problém, který jste zaznamenali."
              />
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            </label>
            <div className={styles.formFooter}>
              <Button className={styles.submitButton} size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Odesílám...' : 'Nahlásit výpadek'}
                <img src="/assets/icons/arrow-right.svg" alt="" />
              </Button>
            </div>
            {submitStatus === 'success' && (
              <div className={styles.successMessage}>Hlášení bylo odesláno. Naši technici se Vám brzy ozvou.</div>
            )}
            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>Zprávu se nepodařilo odeslat. Zkuste to znovu nebo zavolejte.</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
