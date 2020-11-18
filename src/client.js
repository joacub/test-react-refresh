/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { AppContainer as HotEnabler } from 'react-hot-loader';
import * as React from 'react';
import ReactDOM from 'react-dom';
import routes from 'routes';
import closest from 'utils/polyfill/closest';
import NProgress from 'nprogress';
import raf from 'raf';
import App from 'containers/App/App';

raf.polyfill();

// polyfill localstorage
const isStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage != null;
  } catch (e) {
    return false;
  }
};

if (!isStorage()) {
  window.localStorage = {
    _data: {},
    setItem(id, val) {
      this._data[id] = String(val);
      return this._data[id];
    },
    getItem(id) {
      // eslint-disable-next-line no-prototype-builtins
      return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem(id) {
      return delete this._data[id];
    },
    clear() {
      this._data = {};
      return this._data;
    }
  };
}

NProgress.configure({ trickleSpeed: 200 });

closest(window);

(async () => {
  if (!global.Buffer) {
    const getBuffer = () => import(/* webpackChunkName: 'buffer-polyfill' */ 'buffer');
    global.Buffer = await getBuffer().then(r => (r.__esModule ? r.default.Buffer : r.Buffer));
  }

  if (global.Intl) {
    // // Determine if the built-in `Intl` has the locale data we need.
    // if (!areIntlLocalesSupported(localesMyAppSupports)) {
    //     // `Intl` exists, but it doesn't have the data we need, so load the
    //     // polyfill and patch the constructors we need with the polyfill's.
    //     var IntlPolyfill    = require('intl');
    //     Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    //     Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    // }
  } else {
    // No `Intl`, so use and load the polyfill.
    const getIntl = () => import(/* webpackChunkName: 'intl-polyfill' */ 'intl');
    global.Intl = await getIntl().then(r => (r.__esModule ? r.default : r));
  }

  // import IntlPolyfill from 'intl';
  // import 'intl/locale-data/jsonp/es';

  // Intl.NumberFormat = IntlPolyfill.NumberFormat;
  // Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

  const dest = document.getElementById('content');

  const initSocket = () => socket;

  global.socket = initSocket();

  const hydrate = async () => {
    const element = (
      <App />
    );

    if (dest.hasChildNodes()) {
      ReactDOM.hydrate(element, dest);
    } else {
      ReactDOM.render(element, dest);
    }
  };

  // await Loadable.preloadReady();
  // await loadableReady();

  hydrate(routes);

  // Hot reload
  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes);
    });
  }

  // enable debugger
  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
  }

  // Service worker
  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      registration.onupdatefound = () => {
        // The updatefound event implies that reg.installing is set; see
        // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
        const installingWorker = registration.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // It's the perfect time to display a "New content is available; please refresh."
                // message in the page's interface.
                if (console && console.log) {
                  console.log('New or updated content is available.');
                }
              } else if (console && console.log) {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              if (console && console.error) {
                console.error('The installing service worker became redundant.');
              }
              break;
            default:
          }
        };
      };
    } catch (error) {
      if (console && console.log) {
        console.log('Error registering service worker: ', error);
      }
    }

    await navigator.serviceWorker.ready;
    if (console && console.log) {
      console.log('Service Worker Ready');
    }
  }
})().catch(e => {
  if (!__DEVELOPMENT__) {
    window.__wm_injectImgEvent(`${e.toString()} => ${window.location.host + window.location.pathname}`);
  }
});
