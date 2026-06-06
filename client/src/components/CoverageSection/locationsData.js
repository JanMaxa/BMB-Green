export const defaultLocationsData = {
  locations: [
    {
      "lat": 50.1871,
      "lng": 14.6633,
      "label": "Brandýs n. L.",
      "address": "Brandýs nad Labem",
      "speedText": "1 Gb/s",
      "status": "active",
      "statusMessage": "",
      "connections": 70,
      "streets": "Ulice: Hlaví, Školní, Nádražní"
    },
    {
      "lat": 50.091,
      "lng": 14.379,
      "label": "Praha 6",
      "address": "Praha 6, Střešovice",
      "speedText": "220 Mb/s",
      "status": "active",
      "statusMessage": "ahoj",
      "streets": "Hlaví\nŠkolní\nNádražní",
      "connections": 90
    },
    {
      "lat": 49.9765,
      "lng": 14.3932,
      "label": "Praha 5",
      "address": "Praha 5, Zbraslav",
      "speedText": "220 Mb/s",
      "status": "active",
      "statusMessage": "",
      "streets": "Ulice: Hlaví, Školní, Nádražní",
      "connections": 20
    },
    {
      "lat": 50.2014,
      "lng": 14.8328,
      "label": "Lysá n. L.",
      "address": "Lysá nad Labem",
      "speedText": "500 Mb/s",
      "status": "error",
      "statusMessage": "Nestabilni pripojeni",
      "streets": "Ulice: Hlaví, Školní, Nádražní",
      "connections": 30
    },
    {
      "lat": 50.2593,
      "lng": 14.5176,
      "label": "Neratovice",
      "address": "Neratovice",
      "speedText": "500 Mb/s",
      "status": "warning",
      "statusMessage": "neco nefunguje, velky problem v siti, odhadovana doba vypadku je tak 3 dny",
      "streets": "Hlaví, Školní, Nádražní, Nová, brzy i U Stodoly",
      "connections": 47
    }
  ],
};

function parseConnectionsText(text) {
  return Number(String(text || '').replace(/\D/g, '')) || 0;
}

function normalizeStreets(streets) {
  return Array.isArray(streets) ? streets.join('\n') : String(streets || '');
}

export function normalizeLocationsData(loaded) {
  if (!loaded?.locations) return defaultLocationsData;
  return {
    locations: loaded.locations.map((item) => ({
      lat: 0,
      lng: 0,
      label: '',
      address: '',
      speedText: '',
      status: 'active',
      statusMessage: '',
      ...item,
      streets: normalizeStreets(item.streets ?? defaultStreets),
      connections: Number(item.connections) || parseConnectionsText(item.connectionsText) || 0,
    })),
  };
}
