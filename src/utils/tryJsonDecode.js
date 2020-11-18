const tryJsonDecode = str => {
  if (typeof str === 'object') { return str; }
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export default tryJsonDecode;
