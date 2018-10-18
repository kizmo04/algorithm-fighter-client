export function toNewFormatString(ISOString) {
  return new Date(ISOString).toString().substring(0, 10);
}
