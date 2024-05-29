export const isValidTxHash = (input) => {
  const txHashRegExp = /^(0x)?[0-9a-fA-F]{64}$/;
  return txHashRegExp.test(input);
};
