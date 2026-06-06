import { useRef, useState } from 'react';
import cx from '../../utils/cx.js';
import styles from './KeStazeni.module.css';

export default function KeStazeniContent({ data, editable = false, onFieldChange, onImageUpload }) {
  const titleId = 'ke-stazeni-title';

  const heroTitle = data?.hero?.title ?? '';
  const heroDescription = data?.hero?.description ?? '';
  const heroImageUrl = data?.hero?.imageUrl ?? '';
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <>
      <div className={styles.head}>
        <h1 className={styles.title} id={!editable ? titleId : undefined}>
          <EditableText
            editable={editable}
            value={heroTitle}
            onChange={(value) => onFieldChange?.(['hero', 'title'], value)}
            ariaLabel="Nadpis stránky"
            placeholder="Dokumenty ke stažení"
          />
        </h1>
        <div className={styles.subtitlePanel}>
          <EditableTextarea
            editable={editable}
            value={heroDescription}
            onChange={(value) => onFieldChange?.(['hero', 'description'], value)}
            ariaLabel="Popis stránky"
            placeholder="Krátký popis stránky…"
          />
        </div>
        <ImagePanel
          editable={editable}
          imageUrl={heroImageUrl}
          onChange={(value) => onFieldChange?.(['hero', 'imageUrl'], value)}
          onImageUpload={onImageUpload}
        />
      </div>

      <div className={styles.list} aria-labelledby={!editable ? titleId : undefined}>
        {items.length === 0 && (
          <p className={styles.empty}>Žádné dokumenty nejsou k dispozici.</p>
        )}

        {items.map((item, index) => (
          <a
            key={`${item.path}-${index}`}
            className={cx(styles.row, editable && styles.rowDisabled)}
            href={editable ? undefined : item.path}
            target={editable ? undefined : '_blank'}
            rel={editable ? undefined : 'noreferrer'}
            aria-disabled={editable ? 'true' : undefined}
            onClick={editable ? (e) => e.preventDefault() : undefined}
          >
            <span className={styles.rowIcon}>
              <img src="/assets/icons/download.svg" alt="" />
            </span>
            <span className={styles.rowLabel}>{item.label}</span>
            <span className={styles.rowAction}>
              Stáhnout PDF
              <img src="/assets/icons/arrow-right.svg" alt="" />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

function ImagePanel({ editable, imageUrl, onChange, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (!editable && !imageUrl) return null;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !onImageUpload) return;
    event.target.value = '';

    setUploading(true);
    setUploadError('');

    try {
      const imagePath = await onImageUpload(file);
      onChange?.(imagePath);
    } catch (err) {
      setUploadError(err.message || 'Nahrání selhalo.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange?.('');
    setUploadError('');
  };

  if (!editable) {
    return (
      <div className={styles.imagePanel}>
        <img src={imageUrl} alt="" className={styles.imageDisplay} />
      </div>
    );
  }

  return (
    <div className={styles.imagePanel}>
      <span className={styles.imageUploadLabel}>Nahrajte obrázek (tabulka pro internet atd.)</span>
      <button
        type="button"
        className={styles.imageUploadZone}
        onClick={() => !uploading && fileInputRef.current?.click()}
        aria-label="Nahrát obrázek"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Náhled" className={styles.imageUploadPreview} />
        ) : (
          <div className={styles.imageUploadPlaceholder}>
            <span className={styles.imageUploadIcon}>Obrázek</span>
            <span>Klikněte pro nahrání obrázku</span>
            <span className={styles.imageUploadHint}>JPEG, PNG, WebP, GIF · max 10 MB</span>
          </div>
        )}
        {uploading && (
          <div className={styles.imageUploadOverlay}>
            <span>Nahrávám...</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {uploadError && <div className={styles.imageUploadError}>{uploadError}</div>}

      {imageUrl && !uploading && (
        <div className={styles.imageUploadMeta}>
          <span>{imageUrl.startsWith('/uploads/') ? 'Nahráno na server' : 'Obrázek nastaven'}</span>
          <button type="button" className={styles.imageUploadRemove} onClick={removeImage}>
            Odebrat
          </button>
        </div>
      )}
    </div>
  );
}

function EditableText({ editable, value, onChange, ariaLabel, placeholder }) {
  if (!editable) return value;

  return (
    <input
      aria-label={ariaLabel}
      className={styles.editField}
      value={value || ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function EditableTextarea({ editable, value, onChange, ariaLabel, placeholder }) {
  if (!editable) return value;

  return (
    <textarea
      aria-label={ariaLabel}
      className={cx(styles.editField, styles.editArea)}
      value={value || ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}


