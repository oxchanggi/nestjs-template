import { toNumber } from 'lodash';
import moment from 'moment';

export const shortenString = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  const halfLength = Math.floor((maxLength - 3) / 2);
  const firstHalf = text.slice(0, halfLength);
  const secondHalf = text.slice(text.length - halfLength);

  return `${firstHalf}...${secondHalf}`;
};
export const currencyFormatter = (value: number | string, maxLength = 3) =>
  value
    ? Number(value)
        ?.toFixed(maxLength)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    : '0';

export function formatNumber(
  value: number | string,
  maximumFractionDigits = 6,
  compact = false,
  defaultZero = false,
) {
  if (typeof value === 'string') value = Number(value);
  if (isNaN(value)) return defaultZero ? '0' : value;
  return new Intl.NumberFormat('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
  }).format(value);
}

export const formatSmartNumber = (num: number | string): string => {
  if (typeof num === 'string') {
    num = Number(num);
  }

  if (num >= 10) {
    return parseFloat(num.toFixed(1)).toString();
  } else if (num >= 1) {
    return parseFloat(num.toFixed(2)).toString();
  } else {
    let numberDecimalAfterZero = 3;

    if (Number(num) >= 0.1) {
      numberDecimalAfterZero = 4;
    }

    const strNumber = num.toFixed(13).toString();
    const arr = strNumber.split('.');
    if (arr.length === 1) {
      return num.toString();
    }
    const decimal = arr[1];
    //find first non-zero number
    let index = 0;
    while (index < decimal.length && decimal[index] === '0') {
      index++;
    }
    if (index === decimal.length) {
      return parseFloat(num.toString()).toString();
    }

    let threeDecimal = decimal.slice(index, index + numberDecimalAfterZero);

    threeDecimal = Number(threeDecimal.split('').reverse().join(''))
      .toString()
      .split('')
      .reverse()
      .join('');

    return `${arr[0]}.${decimal.slice(0, index)}${threeDecimal}`;
  }
};

const byteSize = (str: string) => new Blob([str]).size;
// clickZkSyncLooting::amountPercent=25
export const parseCommand = (
  url: string,
): { cmd: string; params: Record<string, any> } => {
  const [cmd, query] = url.split('::');
  const params = {};
  if (query) {
    query.split('&').forEach(function (part) {
      const item = part.split('=');
      params[item[0]] = decodeURIComponent(item[1]);
    });
  }
  return { cmd, params };
};

export const buildCommand = (
  cmd: string,
  params: Record<string, any>,
): string => {
  const queryString = Object.keys(params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${
          params[key] ? encodeURIComponent(params[key]) : ''
        }`,
    )
    .join('&');
  const builtCmd = `${cmd}::${queryString}`;

  if (byteSize(builtCmd) > 64) {
    throw Error('Command is over 64 byte');
  }
  return builtCmd;
};

export const buildOptionBin = (
  previos: number,
  index?: number,
  isSingle = false,
) => {
  if (isSingle) {
    return bitToggleSingle(index);
  }
  if (index !== undefined && previos !== undefined) {
    return bitToggle(previos, index);
  }
  return 0;
};
const bitToggleSingle = (bit: number) => {
  return 1 << bit;
};

export const checkOnBit = (num: number, index: number, len: number) => {
  const _tmp = len - num.toString(2).split('').length;
  return index - _tmp >= 0 && num.toString(2).split('')[index - _tmp] == '1';
};
const bitTest = (num: number, bit: number) => {
  return (num >> bit) % 2 != 0;
};
const bitSet = (num: number, bit: number) => {
  return num | (1 << bit);
};
const bitClear = (num: number, bit: number) => {
  return num & ~(1 << bit);
};
const bitToggle = (num: number, bit: number) => {
  return bitTest(num, bit) ? bitClear(num, bit) : bitSet(num, bit);
};

export const insertNewlines = (array: string[], numberItemPerLine = 2) => {
  const newArray = [];

  for (let i = 0; i < array?.length; i++) {
    newArray.push(array[i]);

    if ((i + 1) % numberItemPerLine === 0 && i !== array.length - 1) {
      newArray.push('\n');
    }
  }

  return newArray;
};

export const convertStringToNumber = (input: string) => {
  return Number(input?.match(/\d+/g)?.join('') || 0);
};

export const modifiedWallets = (
  covertBalances: any[],
  contractAddress?: string,
) => {
  const wallets = covertBalances.map(({ balance, name }) => {
    const roundBalance = currencyFormatter(balance);

    return `<b> ${name} :</b><code> ~${roundBalance} SOL | $${roundBalance}</code>`;
  });

  const numberItemPerLine = 1;

  const joinedWallet = insertNewlines(wallets, numberItemPerLine).join(' ');

  return joinedWallet;
};

// Function to convert percentage to value
export const percentageToValue = (
  percentage: number | string,
  total: number | string,
) => {
  return (toNumber(percentage) / 100) * toNumber(total);
};

// Function to calculate percentage
export const calculatePercentage = (
  value: number | string,
  total: number | string,
) => {
  return (toNumber(value) / toNumber(total)) * 100;
};

// Function to calculate percentage increase
export const calculatePercentageIncrease = (
  initialValue: number,
  finalValue: number,
) => {
  if (initialValue === 0) return;

  const increaseAmount = finalValue - initialValue;
  const percentageIncrease = (increaseAmount / Math.abs(initialValue)) * 100;

  return formatSmartNumber(percentageIncrease);
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function secondToHumanize(seconds: number) {
  if (seconds < 0) return;

  return moment
    .duration(seconds, 'seconds')
    .humanize()
    .replace('a ', '1 ')
    .replace('an ', '1 ');
}
