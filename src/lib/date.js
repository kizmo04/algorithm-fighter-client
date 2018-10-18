export function toNewFormatString(ISOString) {
  return new Date(ISOString).toString().substring(0, 10);
}

export function toMatchTimeFormatString(milliseconds) {
  const seconds = Number(milliseconds) / 1000;
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds - (hour * 3600)) / 60);
  const sec = seconds - (min * 60);

  return hour ? `${hour}h ${min}m` :
  min > 3 || !sec ? `${min}m` :
  min ? `${min}m ${sec}s` :
  `${sec}s`;
}