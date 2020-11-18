const encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export default encodeSpecialCharacters;
