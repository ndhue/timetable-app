export function roundToQuarter(date: Date) {
  const d = new Date(date);
  const m = d.getMinutes();
  const q = Math.round(m / 15) * 15;
  d.setMinutes(q);
  d.setSeconds(0);
  return d;
}
