import cx from '../../utils/cx.js';
import styles from './Button.module.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cx(
        styles.button,
        styles[variant],
        size === 'lg' && styles.lg,
        block && styles.block,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
