import Decimal from 'decimal.js';

export const getRandomInt = (min, max) => {
  if (min > max) {
    throw new Error('Random error:  min <= max');
  }
  min = ceil(min);
  max = floor(max);
  return add(
    floor(
      Decimal.random()
        .mul(minus(max, add(min, 0)))
        .toNumber(),
    ),
    min,
  );
};

export const getRandomFloat = (min, max, precision) => {
  min = ceil(mul(min, 10 ** precision));
  max = floor(mul(max, 10 ** precision));
  return div(getRandomInt(min, max), 10 ** precision);
};

export const add = (a: number | string, b: number | string) => {
  return new Decimal(a).plus(b).toNumber();
};

export const mul = (a: number | string, b: number | string) => {
  return new Decimal(a).mul(b).toNumber();
};

export const minus = (a: number | string, b: number | string) => {
  return new Decimal(a).minus(b).toNumber();
};

export const div = (a: number | string, b: number | string) => {
  return new Decimal(a).div(b).toNumber();
};

export const ceil = (a: number | string) => {
  return new Decimal(a).ceil().toNumber();
};

export const floor = (a: number | string) => {
  return new Decimal(a).floor().toNumber();
};

export const toNumber = (a: number | string, precision = 9) => {
  const DecimalPrecision = Decimal.clone({ precision: precision });

  return new DecimalPrecision(a)
    .toNearest(1 / 10 ** precision, Decimal.ROUND_DOWN)
    .toNumber();
};

export const getPrecision = (a: number | string) => {
  const arr = a.toString().split('.');
  return arr[1] ? arr[1].length : 0;
};
