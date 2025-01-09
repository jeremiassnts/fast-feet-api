interface Coordinate {
    latitude: number
    longitude: number
}

export class MapsUtils {
    public static getDifferenceBetweenCoordinates(coordinate1: Coordinate, coordinate2: Coordinate): number {
        const earthRadius = 6371.0; // Average Earth radius in km
        const lat1Rad = MapsUtils.toRadians(coordinate1.latitude);
        const lon1Rad = MapsUtils.toRadians(coordinate1.longitude);
        const lat2Rad = MapsUtils.toRadians(coordinate2.latitude);
        const lon2Rad = MapsUtils.toRadians(coordinate1.longitude);
        // Differences in coordinates
        const deltaLat = lat2Rad - lat1Rad;
        const deltaLon = lon2Rad - lon1Rad;
        // Haversine formula
        const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Final distance
        return earthRadius * c;
    }
    private static toRadians(degrees: number) {
        return (degrees * Math.PI) / 180;
    }
}