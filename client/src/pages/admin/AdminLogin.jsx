import { useState } from 'react';
import { loginAdmin } from './adminApi.js';
import styles from './Admin.module.css';

export default function AdminLogin({ onSignedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginAdmin(password);
      onSignedIn();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.adminLoginPage}>
      <form className={styles.adminLoginCard} onSubmit={handleSubmit}>
        <img src="/assets/logo.svg" alt="BMB-Green" />
        <label>
          Heslo
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
          />
        </label>
        {error && <p className={styles.adminError}>{error}</p>}
        <button className={styles.adminPrimary} disabled={isSubmitting} type="submit">Přihlásit se</button>
      </form>
    </div>
  );
}
