export const handleError = (e) => {
  let err = '';
  if (e?.response?.data) {
    err = e?.response?.data?.message;
  }
  console.error('-- ERROR:', err);
  throw new Error(JSON.stringify(err));
};

export const parserResponse = (res) => {
  if (res?.data?.statusCode === 200) {
    return res.data.data;
  } else {
    console.log(res?.data?.data);
    throw new Error('invalid response');
  }
};
