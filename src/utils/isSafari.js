function isSafari() {
  if (process.browser) {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        return false; // Chrome
      }
      return true; // Safari
    }
  }
  return true;
}

export default isSafari;
