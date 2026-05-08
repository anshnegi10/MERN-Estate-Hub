import { NextResponse } from 'next/server';
import { demoProperties } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { calculateDistance, UPES_COORDS } from '@/utils/commute';

export async function POST(req: Request) {
  try {
    const { budget, distance, gender, amenities } = await req.json();

    const results = demoProperties.map(property => {
      // Clean rent string (e.g. "20,000" -> 20000, "1,70,000/year" -> 170000 / 12)
      let numericPrice = 0;
      const cleanRent = property.price.replace(/,/g, '').toLowerCase();
      const match = cleanRent.match(/(\d+)/);
      if (match) {
        numericPrice = parseInt(match[1]);
        if (cleanRent.includes('year')) numericPrice = Math.floor(numericPrice / 12); // monthly approx
      }

      const coords = getPropertyCoords(property.location, parseInt(property.id.replace(/\D/g, '')) || 0);
      const distKm = calculateDistance(UPES_COORDS.lat, UPES_COORDS.lng, coords[0], coords[1]);

      let score = 100;
      let reasons: string[] = [];

      // Budget scoring
      if (numericPrice && typeof budget === 'number') {
         if (numericPrice <= budget) {
            reasons.push("Perfectly fits within your budget");
         } else {
            score -= ((numericPrice - budget) / budget) * 50; // penalize 50 pts per 100% over budget
         }
      }

      // Distance scoring
      if (typeof distance === 'number') {
         if (distKm <= distance) {
            reasons.push(`Close to campus (${distKm.toFixed(1)} km)`);
         } else {
            score -= (distKm - distance) * 10; // penalize 10 pts per km over
         }
      }

      // Gender scoring
      const propGender = property.details.gender.toLowerCase();
      if (gender && gender !== 'any') {
         if (propGender === gender.toLowerCase() || propGender === 'co-ed') {
            reasons.push(`Matches your gender preference (${property.details.gender})`);
         } else {
            score -= 1000; // Hard filter
         }
      }

      // Amenities mapping
      let matchedAmenities = 0;
      const propertyAmenitiesLower = property.amenities.map(a => a.toLowerCase());
      if (Array.isArray(amenities)) {
         amenities.forEach((preferred: string) => {
            if (propertyAmenitiesLower.some(a => a.includes(preferred.toLowerCase()))) {
               matchedAmenities++;
            }
         });
         if (amenities.length > 0) {
            // Give 5 points per matched amenity
            score += matchedAmenities * 5;
            if (matchedAmenities === amenities.length) {
               reasons.push("Has all your requested amenities!");
            } else if (matchedAmenities > 0) {
               reasons.push(`Has ${matchedAmenities} of your requested amenities.`);
            }
         }
      }

      const safety = property.safetyScore || 8;
      if (safety >= 8) {
         score += 10; // Bonus for high safety
         reasons.push("Excellent safety rating in the area");
      }

      return { property, score, reasons, distKm, numericPrice };
    });

    const validMatches = results.filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    if (validMatches.length === 0) {
       return NextResponse.json({ success: true, match: null });
    }

    const bestMatch = validMatches[0];
    return NextResponse.json({ success: true, match: bestMatch });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Recommendation failed' }, { status: 500 });
  }
}
