import config from '../config';

const { domainImages } = config;

const getImageLink = (md5, version, format) => {
  const formatSplit = format.split('/');
  const ext = formatSplit[formatSplit.length - 1];
  if (version.indexOf('webp') !== -1) {
    return `${domainImages}/media/${version}/${md5}*${ext}.webp`;
  }
  return `${domainImages}/media/${version}/${md5}.${ext}`;
  // return `https://Testparcel.com/media/${version}/${md5}.${ext}`;
};

export default getImageLink;
const getImage = (image, version) => {
  if (image && image.md5) return getImageLink(image.md5, version, image.format);
  return false;
};

export { getImage };
