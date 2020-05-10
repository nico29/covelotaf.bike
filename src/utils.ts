export function toKM(distance: number) {
  if (!distance) return "distance inconnue";
  const km = distance / 1000;
  const rounded = Math.round(km * 100) / 100;
  return `${rounded} km`;
}
