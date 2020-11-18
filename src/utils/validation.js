import isValid from 'date-fns/isValid';
import isPostalCode from 'validator/lib/isPostalCode';
import _isFloat from 'validator/lib/isFloat';
import _isInt from 'validator/lib/isInt';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber, parsePhoneNumber, getCountryCallingCode } from 'react-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { validate as cpfValidate } from 'cpf-check';
import get from 'lodash.get';

export const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data, params) => rules.map(rule => rule(value, data, params)).filter(error => !!error)[0];

export function cpf(value) {
  if (!isEmpty(value) && !cpfValidate(value)) {
    return 'Invalid CPF';
  }
}

export function isFloat(options) {
  return value => {
    if (!isEmpty(value)) {
      const _value = Number(String(value).replace(/[^0-9.-]+/g, ''));
      if (!_isFloat(String(_value), options)) {
        if (options && options.max) {
          return options.msgMax || `The number is greater than ${options.max}`;
        }

        if (options && options.min) {
          return options.msgMin || `The number is less than ${options.min}`;
        }

        if (options && options.gt) {
          return options.msgGt || `The number has to be greater than ${options.gt}`;
        }

        if (options && options.lt) {
          return options.msgLt || `The number has to be less than ${options.lt}`;
        }

        return 'The number is invalid';
      }
    }
  };
}
export function isInt(options) {
  return value => {
    if (!isEmpty(value)) {
      const _value = Number(String(value).replace(/[^0-9.-]+/g, ''));
      if (!_isInt(String(_value), options)) {
        if (options && options.max) {
          return options.msgMax || `The number is greater than ${options.max}`;
        }

        if (options && options.min) {
          return options.msgMin || `The number is less than ${options.min}`;
        }

        if (options && options.gt) {
          return options.msgGt || `The number has to be greater than ${options.gt}`;
        }

        if (options && options.lt) {
          return options.msgLt || `The number has to be less than ${options.lt}`;
        }

        return 'The number is invalid';
      }
    }
  };
}

export function url(options) {
  return value => {
  // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !isURL(value, options)) {
      return 'Invalid url / hostname';
    }
  };
}

export function phone(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value)) {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!isValidPhoneNumber(value) || !phoneNumber.isValid()) { return 'Invalid phone number'; }
  }
}

// eslint-disable-next-line no-unused-vars
export function phoneNumberBelongsTo(localeField) {
  // Let's not start a debate on email regex. This is just for an example app!
  return (value, data) => {
    if (!isEmpty(value)) {
      const phoneNumber = parsePhoneNumber(value);
      if (!phoneNumber
        || (
          phoneNumber.country
          && getCountryCallingCode(phoneNumber.country) !== getCountryCallingCode(get(data, localeField, 'US'))
        )) {
        return `Invalid phone number for ${get(data, localeField, 'US')}`;
      }
    }
  };
}

export function postalCode(localeField, datafield = false) {
  return (value, data) => {
    try {
      if (!isEmpty(value) && !isPostalCode(datafield
        ? get(value, datafield, value) : value, get(data, localeField, 'US'))) {
        return 'Invalid postal code';
      }
    } catch (e) {
      return undefined;
    }
  };
}

export function email(value) {
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
}

export function date(value) {
  if (typeof value === 'string') {
    value = new Date(value);
  }
  if (!isEmpty(value) && !isValid(value)) {
    return 'Invalid date';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }

  if (Array.isArray(value)) {
    if (!value.some(item => !isEmpty(item))) {
      return 'Required';
    }
  }
}

export function requiredIf(condition) {
  return (value, data, params) => {
    if (condition(value, data, params)) {
      if (isEmpty(value)) {
        return 'Required';
      }
    }
  };
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function integer(value) {
  if (!isEmpty(value) && !Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!enumeration.includes(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function createValidator(rules, params) {
  return async (data = {}, rest) => {
    const errors = {};
    const promsies = [];
    Object.keys(rules).forEach(key => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      let error;
      try {
        error = rule(data[key], data, { key, ...params, ...rest });
      } catch (e) {
        error = e.toString();
      }
      if (error && !isPromise(error)) {
        errors[key] = error;
      }

      if (isPromise(error)) {
        promsies.push(error.then(r => {
          if (r) {
            errors[key] = r;
          }
        }).catch(e => {
          errors[key] = e;
        }));
      }
    });
    await Promise.all(promsies);
    return errors;
  };
}
