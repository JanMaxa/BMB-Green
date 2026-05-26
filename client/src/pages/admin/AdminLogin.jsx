import { useState } from 'react';
import { loginAdmin } from './adminApi.js';
import styles from './Admin.module.css';

export default function AdminLogin({ onSignedIn }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const ok = await loginAdmin(username, password);

    if (!ok) {
      setError('Přihlášení se nepodařilo.');
      return;
    }

    localStorage.setItem('bmb-admin', 'true');
    onSignedIn();
  };

  return (
    <div className={styles.adminLoginPage}>
      <form className={styles.adminLoginCard} onSubmit={handleSubmit}>
        <img src="/assets/logo.svg" alt="BMB-Green" />
        <label>
          Uživatelské jméno
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Heslo
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
        </label>
        {error && <p className={styles.adminError}>{error}</p>}
        <button className={styles.adminPrimary} type="submit">Přihlásit se</button>
      </form>
    </div>
  );
}
