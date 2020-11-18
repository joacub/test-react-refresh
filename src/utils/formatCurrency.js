import currencyFormatter from 'currency-formatter';

/**
 * Adds the appropriate symbol & separators to `value` based on the input `currencyCode`
 * @param {string} value
 * @param {string} currencyCode
 * @returns Formatted currency string
 */
function formatCurrency(value, currencyCode = 'USD') {
  return currencyFormatter.format(value, {
    code: currencyCode.toUpperCase()
  });
}

export default formatCurrency;
