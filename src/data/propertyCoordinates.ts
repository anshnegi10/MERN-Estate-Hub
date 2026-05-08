// Approximate coordinates for Dehradun areas used in demo properties
export const locationCoordinates: Record<string, [number, number]> = {
  'Bidholi, Dehradun':        [30.4159, 77.9668],
  'Pondha, Dehradun':         [30.3800, 77.9500],
  'Upper Kandoli, Dehradun':  [30.3950, 77.9750],
  'Kandoli, Dehradun':        [30.3900, 77.9700],
  'Doonga, Dehradun':         [30.4300, 77.9400],
};

// Small jitter to avoid exact overlap for properties in the same area
export function getPropertyCoords(location: string, index: number): [number, number] {
  const base = locationCoordinates[location] || [30.3165, 78.0322]; // fallback: Dehradun center
  const jitter = 0.002;
  return [
    base[0] + (Math.sin(index * 2.1) * jitter),
    base[1] + (Math.cos(index * 3.7) * jitter),
  ];
}
