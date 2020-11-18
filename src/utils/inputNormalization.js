import { normalizeZip as _normalizeZip } from 'utils/helpers';
import { AsYouType } from 'libphonenumber-js';

export const normalizeCPF = value => {
  const onlyNums = value.replace(/[^\d]/g, '');
  const stringValue = String(onlyNums);
  if (stringValue.length <= 3) {
    return stringValue.slice(0, 3);
  }

  if (stringValue.length <= 6) {
    return `${stringValue.slice(0, 3)}.${stringValue.slice(3, 6)}`;
  }

  if (stringValue.length <= 9) {
    return `${stringValue.slice(0, 3)}.${stringValue.slice(3, 6)}.${stringValue.slice(6, 9)}`;
  }

  if (stringValue.length > 9) {
    // eslint-disable-next-line max-len
    return `${stringValue.slice(0, 3)}.${stringValue.slice(3, 6)}.${stringValue.slice(6, 9)}-${stringValue.slice(9, 11)}`;
  }
};

export const normalizeCNPJ = value => {
  const lastString = String(value).slice(-1);

  const onlyNums = value.replace(/[^\d]/g, '');
  const stringValue = String(onlyNums);
  if (stringValue.length <= 2) {
    return stringValue.slice(0, 3);
  }

  if (stringValue.length <= 5) {
    return `${stringValue.slice(0, 2)}.${stringValue.slice(2, 5)}${lastString === '.' ? lastString : ''}`;
  }

  if (stringValue.length <= 8) {
    return `${stringValue.slice(0, 2)}.${stringValue.slice(2, 5)}.${stringValue.slice(5, 8)}`;
  }

  if (stringValue.length <= 12) {
    // eslint-disable-next-line max-len
    return `${stringValue.slice(0, 2)}.${stringValue.slice(2, 5)}.${stringValue.slice(5, 8)}/${stringValue.slice(8, 12)}`;
  }

  if (stringValue.length > 12) {
    // eslint-disable-next-line max-len
    return `${stringValue.slice(0, 2)}.${stringValue.slice(2, 5)}.${stringValue.slice(5, 8)}/${stringValue.slice(8, 12)}-${stringValue.slice(12, 14)}`;
  }
};

export const normalizeZip = values => value => _normalizeZip({ country: values.recipientCountry })(value);

export const normalizePhone = value => {
  const phone = new AsYouType().input(value);
  return phone;
};

export const normalizeInteger = value => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, '');
  return parseInt(onlyNums, 10) || 0;
};

export const normalizeNumber = value => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, '');
  return parseFloat(onlyNums) || 0;
};
export const normalizeFloat = value => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d.]/g, '');
  return onlyNums;
};

export const normalizeHarmonizer = value => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, '');
  return onlyNums.slice(0, 6);
};
