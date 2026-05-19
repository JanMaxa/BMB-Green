import cx from '../../utils/cx.js';
import styles from './Admin.module.css';
export default function AdminLayout({ activeTab, activeLabel, tabs, onChangeTab, onSignOut, headerAction, children }) {
  return (
    <div className={styles.adminApp}>
      <aside className={styles.adminSidebar}>
        <div className={styles.adminLogo}>
          <img src="/assets/logo-on-dark.svg" alt="BMB-Green" />
        </div>
        <div className={styles.adminSectionLabel}>Obsah webu</div>
        {tabs.map((tab) => (
          <button
            className={cx(styles.adminNav, activeTab === tab.slug && styles.active)}
            onClick={() => onChangeTab(tab.slug)}
            key={tab.slug}
            type="button"
          >
            <img src={`/assets/icons/${tab.icon}.svg`} alt="" />
            {tab.label}
          </button>
        ))}
        <button className={cx(styles.adminNav, styles.adminLogout)} onClick={onSignOut} type="button">
          <img src="/assets/icons/x.svg" alt="" />
          Odhlásit se
        </button>
      </aside>

      <div className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div>
            <h1>{activeLabel}</h1>
            <p>Admin / {activeLabel}</p>
          </div>
          {headerAction && <div className={styles.adminTopbarActions}>{headerAction}</div>}
        </header>
        <div className={styles.adminContent}>{children}</div>
      </div>
    </div>
  );
}
