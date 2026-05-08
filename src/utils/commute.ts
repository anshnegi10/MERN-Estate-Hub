export const UPES_COORDS = {
  lat: 30.4158,
  lng: 77.9667,
};

/**
 * Calculates straight line distance in km using the Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type CommuteScore = 'Excellent' | 'Good' | 'Moderate' | 'Far';

export interface CommuteInfo {
  distanceKm: number;
  distanceStr: string;
  walkingTimeMin: number;
  drivingTimeMin: number;
  score: CommuteScore;
}

export function getCommuteInfo(propertyLat?: number, propertyLng?: number): CommuteInfo | null {
  if (propertyLat === undefined || propertyLng === undefined) return null;

  const distanceKm = calculateDistance(UPES_COORDS.lat, UPES_COORDS.lng, propertyLat, propertyLng);
  
  const walkingTimeMin = Math.round((distanceKm / 5) * 60);
  const drivingTimeMin = Math.round((distanceKm / 30) * 60);

  let score: CommuteScore = 'Far';
  if (distanceKm < 1) score = 'Excellent';
  else if (distanceKm <= 3) score = 'Good';
  else if (distanceKm <= 6) score = 'Moderate';

  return {
    distanceKm,
    distanceStr: `${distanceKm.toFixed(1)} km`,
    walkingTimeMin,
    drivingTimeMin,
    score,
  };
}
