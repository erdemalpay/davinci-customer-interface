// Secret key for encoding/decoding - Keep this secret!
const SECRET_SALT = "DaVinci_QR_2024_Secret_Key_!@#$%";

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

    if (parts.length !== 3 || parts[2] !== SECRET_SALT) {
      return null;
    }

    const location = parseInt(parts[0], 10);
    const tableName = parts[1];

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
 * Location 1 (Bahçeli): 16 tables
 * Location 2 (Neorama): 28 tables
 */
export function generateAllEncodedUrls(baseUrl: string): Array<{
  locationId: number;
  locationName: string;
  tableName: string;
  encodedUrl: string;
  fullUrl: string;
}> {
  const locations = [
    { id: 1, name: 'Bahçeli', tableCount: 16 },
    { id: 2, name: 'Neorama', tableCount: 28 }
  ];

  const urls: Array<{
    locationId: number;
    locationName: string;
    tableName: string;
    encodedUrl: string;
    fullUrl: string;
  }> = [];

  locations.forEach(location => {
    for (let i = 1; i <= location.tableCount; i++) {
      const tableName = i.toString();
      const encoded = encodeTableUrl(location.id, tableName);
      urls.push({
        locationId: location.id,
        locationName: location.name,
        tableName,
        encodedUrl: `/${encoded}`,
        fullUrl: `${baseUrl}/${encoded}`
      });
    }
  });

  return urls;
}
