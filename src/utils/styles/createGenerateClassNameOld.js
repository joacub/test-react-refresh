/* eslint-disable no-underscore-dangle */

import warning from 'warning';

const escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g;
function safePrefix(classNamePrefix) {
  const prefix = String(classNamePrefix);
  warning(prefix.length < 256, `Material-UI: the class name prefix is too long: ${prefix}.`);
  // Sanitize the string as will be used to prefix the generated class name.
  return prefix.replace(escapeRegex, '-');
}

const keyClassesCached = {};
const hashCode = str => {
  if (keyClassesCached[str]) {
    return keyClassesCached[str];
  }

  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i); // eslint-disable-line
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  hash >>>= 0; // eslint-disable-line
  keyClassesCached[str] = hash;
  return hash;
};

// Returns a function which generates unique class names based on counters.
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's inspired by
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
export default function createGenerateClassName(options = {}) {
  const { dangerouslyUseGlobalCSS = false, productionPrefix = 'jss', seed = '' } = options;
  let ruleCounter = 0;
  return (rule, styleSheet) => {
    ruleCounter += 1;
    warning(
      ruleCounter < 1e10,
      ['Material-UI: you might have a memory leak.', 'The ruleCounter is not supposed to grow that much.'].join('')
    );

    if (dangerouslyUseGlobalCSS && styleSheet && styleSheet.options.name) {
      return `${safePrefix(styleSheet.options.name)}-${rule.key}`;
    }

    if (process.env.NODE_ENV === 'production') {
      const keyCounter = `${safePrefix(styleSheet.options.name)}-${rule.key}`;
      const hash = hashCode(keyCounter);
      return `${productionPrefix}${seed}${hash}`;
    }

    if (styleSheet && styleSheet.options.classNamePrefix) {
      const prefix = safePrefix(styleSheet.options.classNamePrefix);
      return `${prefix}-${rule.key}-${seed}${ruleCounter}`;
    }

    return `${rule.key}-${seed}${ruleCounter}`;
  };
}
