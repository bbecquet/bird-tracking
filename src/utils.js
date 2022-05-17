export const min = (values = []) =>
  values.reduce((min, v) => Math.min(min, v), Number.MAX_SAFE_INTEGER);
