import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './CoverageSection.module.css';
import { defaultLocationsData, normalizeLocationsData } from './locationsData.js';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';
const SECTION_TITLE = 'Pokrytí a aktuální stav naší sítě.';
const SECTION_DESCRIPTION = 'Aktuální pokrytí a připravované lokality v síti BMB-Green.';

export default function CoverageSection({ className }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [locationsData, setLocationsData] = useState(defaultLocationsData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/locations`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setLocationsData(normalizeLocationsData(data)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapElementRef.current || !locationsData) return;

    const pins = locationsData.locations;

    if (!mapRef.current) {
      mapRef.current = L.map(mapElementRef.current, {
        scrollWheelZoom: false,
      }).setView([50.1871, 14.6633], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      setTimeout(() => mapRef.current?.invalidateSize(), 0);
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = pins
      .filter((location) => Number.isFinite(location.lat) && Number.isFinite(location.lng))
      .map((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: createLocationIcon(location),
        }).addTo(mapRef.current);

        marker.on('click', (event) => {
          if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
          const element = marker.getElement()?.querySelector(`.${styles.markerWrap}`);
          const shouldOpen = !element?.classList.contains(styles.isOpen);
          closeMarkerMenus();
          element?.classList.toggle(styles.isOpen, shouldOpen);
        });

        return marker;
      });

    mapRef.current.off('click', closeMarkerMenus);
    mapRef.current.on('click', closeMarkerMenus);

    const markerPoints = markersRef.current.map((marker) => marker.getLatLng());
    if (markerPoints.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(markerPoints), {
        padding: [72, 72],
        maxZoom: 11,
      });
    }
  }, [locationsData]);

  useEffect(() => () => {
    mapRef.current?.remove();
    mapRef.current = null;
    markersRef.current = [];
  }, []);

  const statusCards = locationsData.locations
    .filter((location) => location.statusMessage?.trim())
    .map((location, index) => {
      const safeStatus = normalizeStatus(location.status);
      const name = location.label || location.address || 'Lokace';
      const message = location.statusMessage.trim();

      return {
        id: `${safeStatus}-${name}-${index}`,
        name,
        status: safeStatus,
        statusLabel: statusLabel(safeStatus),
        message,
      };
    });

  return (
    <section className={cx(layout.section, className)}>
      <div className={layout.container}>
        <div className={layout.sectionHead}>
          <h2>{SECTION_TITLE}</h2>
          <p>{SECTION_DESCRIPTION}</p>
        </div>
        <div className={styles.coverage}>
          <div className={styles.map} ref={mapElementRef} aria-label={SECTION_TITLE}></div>
          {statusCards.length > 0 && (
            <div className={styles.statusGrid}>
              {statusCards.map((item) => (
                <article
                  className={cx(
                    styles.statusCard,
                    item.status === 'warning' && styles.statusCardWarning,
                    item.status === 'error' && styles.statusCardError,
                  )}
                  key={item.id}
                >
                  <h3>{item.name} - {item.statusLabel}</h3>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function createLocationIcon(location) {
  const safeStatus = normalizeStatus(location.status);
  const label = escapeHtml(location.label || location.address || 'Lokace');
  const status = escapeHtml(statusLabel(safeStatus));
  const detail = escapeHtml(location.statusMessage || markerDetail(location));
  const statusClass = safeStatus === 'warning' ? styles.statusWarning : safeStatus === 'error' ? styles.statusError : '';

  return L.divIcon({
    className: styles.divIcon,
    html: `
      <span class="${styles.markerWrap}">
        <span class="${cx(styles.markerDot, statusClass)}"></span>
        <span class="${styles.markerLabel}">${label}</span>
        <span class="${styles.markerDetail}">
          <strong>${status}</strong>
          <span>${detail}</span>
        </span>
      </span>
    `,
    iconSize: [310, 92],
    iconAnchor: [12, 12],
  });
}

function normalizeStatus(status) {
  return ['active', 'warning', 'error'].includes(status) ? status : 'active';
}

function statusLabel(status) {
  if (status === 'warning') return 'Upozornění';
  if (status === 'error') return 'Výpadek';
  return 'Aktivní';
}

function markerDetail(location) {
  if (location.connectionsText && location.speedText) return `${location.connectionsText} · až ${location.speedText}`;
  if (location.connectionsText) return location.connectionsText;
  if (location.speedText) return `až ${location.speedText}`;
  return location.address || location.label || '';
}

function closeMarkerMenus() {
  document.querySelectorAll(`.${styles.markerWrap}.${styles.isOpen}`).forEach((element) => {
    element.classList.remove(styles.isOpen);
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
