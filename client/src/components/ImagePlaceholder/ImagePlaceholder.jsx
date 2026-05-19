import cx from '../../utils/cx.js';
import styles from './ImagePlaceholder.module.css';

export default function ImagePlaceholder({ icon, label, fill = false }) {
  return (
    <div className={cx(styles.placeholder, fill && styles.fill)}>
      <div className={styles.mark}>
        <img src={`/assets/icons/${icon}.svg`} alt="" />
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
