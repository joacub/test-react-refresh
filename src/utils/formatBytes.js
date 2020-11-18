export default function formatBytes(a, b) {
  if (a === 0) return '0 Bytes';
  const c = 1024;
  const d = b || 2;
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const f = Math.floor(Math.log(a) / Math.log(c));
  const p = c ** f;
  return `${parseFloat((a / p).toFixed(d))} ${e[f]}`;
}
