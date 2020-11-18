import { find as findShipping } from 'redux/modules/shipping';
import {
  isEmpty
} from 'utils/validation';
import { requester } from './helpers';

const formHsCodeValidator = async (value, data, { dispatch, values, disableHsCodeAsyncValidation }) => {
  // Disabled on DEV env validation with correos
  // if (__DEVELOPMENT__) {
  //   return;
  // }

  if (disableHsCodeAsyncValidation) {
    return;
  }

  if (!isEmpty(value) && value.length === 6) {
    const key1 = `checkHsCode-isCodeProhibited-${value}-${values.recipientCountry}`;
    const query = {
      action: 'isHarmonizedCodeProhibited',
      country: { isoCode: values.recipientCountry },
      code: value,
    };
    const response = await requester.makeRequest({
      keyCache: key1,
      action: async () => {
        const result = await dispatch(findShipping('checkHsCode-isCodeProhibited', {
          query
        })).catch(error => `Error validating the HS CODE: ${error.toString()}`);
        return result;
      }
    });

    if (!response.valid) {
      return 'Prohibited by the selected service';
    }

    if (response.valid === true) {
      if (!values.packageServiceType) {
        return 'Select  service';
      }

      // eslint-disable-next-line max-len
      const key2 = `checkHsCode-isHarmonizedCodeAllowed-${value}-${values.packageServiceType.split('-')[0]}-${values.recipientCountry}`;

      const query2 = {
        action: 'isHarmonizedCodeProhibitedServiceCall',
        country: { isoCode: values.recipientCountry },
        code: value,
        serviceId: values.packageServiceType.split('-')[0]
      };
      const response2 = await requester.makeRequest({
        keyCache: key2,
        action: async () => {
          const result = await dispatch(findShipping('checkHsCode-isHarmonizedCodeAllowed', {
            query: query2
          })).catch(error => `Error validating the HS CODE: ${error.toString()}`);
          return result;
        }
      });

      if (typeof response2 === 'object') {
        if (response2.valid) {
          return undefined;
        }
        return 'Prohibited by the selected service';
      }
    }
    return undefined;
  }
  return 'We can not validate yet the harmonized code';
};

// eslint-disable-next-line import/prefer-default-export
export { formHsCodeValidator };
