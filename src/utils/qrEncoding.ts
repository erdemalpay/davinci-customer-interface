// Salt is loaded exclusively from environment variables (VITE_QR_SECRET_SALT).
const SECRET_SALT = (import.meta.env.VITE_QR_SECRET_SALT as string | undefined)?.trim() ?? "";

// Legacy salts to keep old/broken production URLs working.
const LEGACY_ACCEPTED_SALTS = new Set([
  SECRET_SALT,
  "DaVinci_QR_2024_Secret_Key_!@#$%", // initial hardcoded salt
  "undefined",                          // broken production URLs before env var was set
]);

/**
 * Encodes location and table name into a URL-safe string
 * @param location - Location ID (1 or 2)
 * @param tableName - Table name (e.g., "1", "2", "15", etc.)
 * @returns Encoded string for URL
 */
export function encodeTableUrl(location: number, tableName: string): string {
  // Combine location and tableName with a separator
  const combined = `${location}|${tableName}|${SECRET_SALT}`;

  // Convert to base64
  const base64 = btoa(combined);

  // Make it URL-safe by replacing characters
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove padding

  return urlSafe;
}

/**
 * Decodes an encoded table URL back to location and table name
 * @param encoded - Encoded string from URL
 * @returns Object with location and tableName, or null if invalid
 */
export function decodeTableUrl(encoded: string): { location: number; tableName: string } | null {
  try {
    // Convert from URL-safe back to base64
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    // Decode from base64
    const decoded = atob(base64);

    // Split and verify
    const parts = decoded.split('|');

    // Support both current format (with valid salt) and legacy broken URLs.
    if (parts.length < 2 || parts.length > 3) {
      return null;
    }

    const location = parseInt(parts[0], 10);
    const tableName = parts[1];
    const salt = parts[2];

    if (parts.length === 3 && (!salt || !LEGACY_ACCEPTED_SALTS.has(salt))) {
      return null;
    }

    // Validate location and tableName
    if (isNaN(location) || !tableName) {
      return null;
    }

    return { location, tableName };
  } catch {
    // Invalid encoding
    return null;
  }
}

/**
 * Generates all encoded URLs for both locations
 * Location 1 (Bahçeli): 17 tables (1-17)
 * Location 2 (Neorama): 29 tables (1-14, 20-34)
 */
export function generateAllEncodedUrls(baseUrl: string): Array<{
  locationId: number;
  locationName: string;
  tableName: string;
  encodedUrl: string;
  fullUrl: string;
}> {
  // Bahçeli: 1-17 arası masalar
  const bahceliTables = Array.from({ length: 17 }, (_, i) => (i + 1).toString());

  // Neorama: 1-14 ve 20-34 arası masalar (15-19 yok)
  const neoramaTables = [
    ...Array.from({ length: 14 }, (_, i) => (i + 1).toString()),  // 1-14
    ...Array.from({ length: 15 }, (_, i) => (i + 20).toString())  // 20-34
  ];

  const locations = [
    { id: 1, name: 'Bahçeli', tableNames: bahceliTables },
    { id: 2, name: 'Neorama', tableNames: neoramaTables }
  ];

  const urls: Array<{
    locationId: number;
    locationName: string;
    tableName: string;
    encodedUrl: string;
    fullUrl: string;
  }> = [];

  locations.forEach(location => {
    location.tableNames.forEach(tableName => {
      const encoded = encodeTableUrl(location.id, tableName);
      urls.push({
        locationId: location.id,
        locationName: location.name,
        tableName,
        encodedUrl: `/${encoded}`,
        fullUrl: `${baseUrl}/${encoded}`
      });
    });
  });

  return urls;
}
