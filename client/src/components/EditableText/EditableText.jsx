import { useLayoutEffect, useRef } from 'react';
import cx from '../../utils/cx.js';
import styles from './EditableText.module.css';

// A one-line text field in the admin that wraps onto more lines when the text is longer than the field.
export default function EditableText({ editable, value, onChange, ariaLabel, placeholder, className }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [value, editable]);

  if (!editable) return value;

  return (
    <textarea
      ref={ref}
      rows={1}
      aria-label={ariaLabel}
      className={cx(className, styles.text)}
      value={value || ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
    />
  );
}
