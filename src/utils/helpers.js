import cache from './globalCache';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const multipliersUnits = {
  inches: 2.54,
  cm: 1,
};

/**
 *
 * @param {('inches'|'cm')} measurementUnit
 * @param {number} value
 * @param {('inches'|'cm')} from
 */
const convertDimensions = (measurementUnit, value, from = 'cm') => {
  if (!from) {
    return value;
  }
  if (!measurementUnit) {
    return value;
  }

  if (!value) {
    return value;
  }

  if (Number.isNaN(parseFloat(value))) {
    value = 0;
  }

  if (from !== 'cm') {
    value *= multipliersUnits[from];
  }

  return (value / multipliersUnits[measurementUnit]).toFixed(2);
};

const multipliersUnitsWeights = {
  ounce: 28.34952,
  gram: 1,
  pound: 453.592,
  kilogram: 1000
};

/**
 *
 * @param {('ounce'|'gram'|'pound'|'kilogram')} unit
 * @param {number} value
 * @param {('ounce'|'gram'|'pound'|'kilogram')} from
 */
const convertWeights = (unit, value, from = 'gram') => {
  if (!from) {
    return value;
  }

  if (!unit) {
    return value;
  }

  if (!value) {
    return value;
  }

  if (Number.isNaN(parseFloat(value))) {
    value = 0;
  } else if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (from !== 'gram') {
    value *= multipliersUnitsWeights[from];
  }

  return (value / multipliersUnitsWeights[unit]).toFixed(2);
};

const zipsOnlyNumbersByCountry = {
  CL: true,
  US: true,
  MX: true,
};

const normalizeZip = ({ country }) => value => {
  if (value && zipsOnlyNumbersByCountry[country]) {
    const onlyNums = value.replace(/[^\d]/g, '');
    return onlyNums;
  }
  if (value && (country === 'BR')) {
    const onlyNums = value.replace(/[^\d]/g, '');
    const stringValue = String(onlyNums);
    if (stringValue.length > 5) {
      return `${stringValue.slice(0, 5)}-${stringValue.slice(5, 8)}`;
    }
  }

  return value;
};

const requester = {
  // one second
  timeToWaitNextRequest: 100,
  lastRequest: new Date(2000, 0, 1),
  intervals: [],
  clearIntervals() {
    this.intervals.forEach(interval => {
      if (interval) {
        clearInterval(interval);
      }
    });
    this.intervals = [];
  },
  async makeRequest({ keyCache: key, action }) {
    const value = cache.get(key);
    if (value !== undefined && value !== 'pending') {
      return value;
    }

    if (value === 'pending') {
      const resolvedResult = await new Promise(resolve => {
        const intervalChecker = setInterval(() => {
          const valueResolved = cache.get(key);
          if (valueResolved !== 'pending') {
            this.intervals = this.intervals.filter(interval => interval !== intervalChecker);
            clearInterval(intervalChecker);
            resolve(valueResolved);
          }
        }, 100);
        this.intervals.push(intervalChecker);
      });
      return resolvedResult;
    }

    cache.set(key, 'pending');
    // Check when last request was made
    const timeSinceLast = (new Date()).getTime() - this.lastRequest.getTime();
    this.lastRequest = new Date();
    if (timeSinceLast < this.timeToWaitNextRequest) {
      this.lastRequest = new Date(this.lastRequest.getTime() + (this.timeToWaitNextRequest - timeSinceLast));
      await sleep(this.timeToWaitNextRequest);
    }

    const response = await action().catch(error => {
      // do not cached errorded request
      cache.set(response, undefined);
      throw error;
    });
    cache.set(key, response);
    return response;
  }
};

const checkDeepHasErrors = object => {
  if (!object) {
    return false;
  }
  if (Array.isArray(object)) {
    return object.some(item => checkDeepHasErrors(item));
  }
  const keys = Object.keys(object);
  if (!keys.length) {
    return false;
  }
  return keys.some(key => {
    if (typeof object[key] === 'string') {
      return true;
    }
    if (typeof object[key] === 'object') {
      // eslint-disable-next-line no-unused-vars
      const result = checkDeepHasErrors(object[key]);
      return result;
    }
    return false;
  });
};

export {
  convertDimensions, convertWeights, normalizeZip, sleep, requester, checkDeepHasErrors
};
