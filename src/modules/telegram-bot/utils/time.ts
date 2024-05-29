import moment from 'moment';

export const convertDateToUnixTimestamp = () =>
  Math.floor(new Date().getTime() / 1000);

export const parseTime = (time: string) => {
  return moment
    .duration(
      `P${time
        ?.toUpperCase()
        ?.replace(/\s/g, '')
        ?.replace(/\d+H?\d*M?\d*S?$/, 'T$&')}`,
    )
    ?.asSeconds();
};
