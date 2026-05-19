import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cx from '../../utils/cx.js';
import layout from '../../styles/layout.module.css';
import styles from './CoverageSection.module.css';

const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';
const SECTION_TITLE = 'Pokrytí a aktuální stav naší sítě.';
const SECTION_DESCRIPTION = 'Aktuální pokrytí a připravované lokality v síti BMB-Green.';

export default function CoverageSection() {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [locationsData, setLocationsData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/locations`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setLocationsData(data))
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

  if (!locationsData) return null;

  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <div className={layout.sectionHead}>
          <h2>{SECTION_TITLE}</h2>
          <p>{SECTION_DESCRIPTION}</p>
        </div>
        <div className={styles.coverage}>
          <div className={styles.map} ref={mapElementRef} aria-label={SECTION_TITLE}></div>
        </div>
      </div>
    </section>
  );
}

function createLocationIcon(location) {
  const safeStatus = ['active', 'warning', 'error'].includes(location.status) ? location.status : 'active';
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
