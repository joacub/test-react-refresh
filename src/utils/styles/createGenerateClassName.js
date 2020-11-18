import warning from 'warning';

const nested = Symbol('nested');

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

/**
 * This is the list of the style rule name we use as drop in replacement for the built-in
 * pseudo classes (:checked, :disabled, :focused, etc.).
 *
 * Why do they exist in the first place?
 * These classes are used at a specificity of 2.
 * It allows them to override previously definied styles as well as
 * being untouched by simple user overrides.
 */
const pseudoClasses = [
  'checked',
  'disabled',
  'error',
  'focused',
  'focusVisible',
  'required',
  'expanded',
  'selected',
];

// Returns a function which generates unique class names based on counters.
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's inspired by
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
export default function createGenerateClassName(options = {}) {
  const { disableGlobal = false, productionPrefix = 'jss', seed = '' } = options;
  const seedPrefix = seed === '' ? '' : `${seed}-`;
  let ruleCounter = 0;

  return (rule, styleSheet) => {
    ruleCounter += 1;
    warning(
      ruleCounter < 1e10,
      ['Material-UI: you might have a memory leak.', 'The ruleCounter is not supposed to grow that much.'].join('')
    );

    const { name } = styleSheet.options;

    if (process.env.NODE_ENV === 'production' && name) {
      if (pseudoClasses.indexOf(rule.key) !== -1) {
        return rule.key;
      }

      if (styleSheet.options.link) {
        return `${seedPrefix}${productionPrefix}${ruleCounter}`;
      }

      const keyCounter = `${name}-${rule.key}`;
      const hash = hashCode(keyCounter);
      return `${productionPrefix}${seed}${hash}`;
      // return `${seedPrefix}${productionPrefix}${ruleCounter}`;
    }

    // Is a global static MUI style?
    if (name /* && name.indexOf('Mui') === 0 */ && !styleSheet.options.link && !disableGlobal) {
      // We can use a shorthand class name, we never use the keys to style the components.
      if (pseudoClasses.indexOf(rule.key) !== -1) {
        return rule.key;
      }

      const prefix = `${seedPrefix}${name}-${rule.key}`;

      if (!styleSheet.options.theme[nested] || seed !== '') {
        return prefix;
      }

      return `${prefix}-${ruleCounter}`;
    }

    const suffix = `${rule.key}-${ruleCounter}`;

    // Help with debuggability.
    if (styleSheet.options.classNamePrefix) {
      return `${seedPrefix}${styleSheet.options.classNamePrefix}-${suffix}`;
    }

    return `${seedPrefix}${suffix}`;
  };
}
