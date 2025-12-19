/**
 * Geofencing utilities for attendance validation using polygon-based geofencing
 */

// Valid attendance area polygon (corners of the allowed area)
// Coordinates are in [latitude, longitude] format
const GEOFENCE_POLYGON: [number, number][] = [
    [14.5724949, 121.1324738],
    [14.5724949, 121.1324738], // Duplicate point, will be filtered
    [14.5726001, 121.1325499],
    [14.5726487, 121.1325891],
    [14.5726886, 121.1326217],
    [14.5727191, 121.1326569],
];

// Remove duplicate points
const UNIQUE_POLYGON = GEOFENCE_POLYGON.filter(
    (point, index, self) =>
        index === 0 ||
        point[0] !== self[index - 1][0] ||
        point[1] !== self[index - 1][1]
);

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 * @param lat Point latitude
 * @param lon Point longitude
 * @param polygon Array of [lat, lon] coordinates defining the polygon
 * @returns true if point is inside polygon, false otherwise
 */
function isPointInPolygon(
    lat: number,
    lon: number,
    polygon: [number, number][]
): boolean {
    let inside = false;
    const n = polygon.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
        const [lat1, lon1] = polygon[i];
        const [lat2, lon2] = polygon[j];

        // Check if point is on the edge (ray crosses the edge)
        const intersect =
            lon1 > lon !== lon2 > lon &&
            lat < ((lat2 - lat1) * (lon - lon1)) / (lon2 - lon1) + lat1;

        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * Check if a scan location is within the valid geofence area
 * @param scanLat Scan latitude in degrees
 * @param scanLon Scan longitude in degrees
 * @returns Object with isWithin boolean
 */
export function isWithinGeofence(
    scanLat: number,
    scanLon: number
): { isWithin: boolean } {
    const isWithin = isPointInPolygon(scanLat, scanLon, UNIQUE_POLYGON);
    return { isWithin };
}

/**
 * Get the configured geofence polygon
 * @returns Array of [lat, lon] coordinates
 */
export function getGeofencePolygon(): [number, number][] {
    return UNIQUE_POLYGON;
}

/**
 * Check if geofencing is enabled
 * @returns true if geofencing is configured
 */
export function isGeofencingEnabled(): boolean {
    return UNIQUE_POLYGON.length >= 3; // Need at least 3 points for a polygon
}
