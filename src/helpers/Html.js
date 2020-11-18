import { Component } from 'react';
import PropTypes from 'prop-types';

let serialize = null;
if (global.__webworker) {
  serialize = JSON.stringify;
} else {
  serialize = require('serialize-javascript');
}

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
// eslint-disable-next-line
export default class Html extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    assets: PropTypes.shape({
      styles: PropTypes.object,
      javascript: PropTypes.object,
    }),
    bundles: PropTypes.objectOf(PropTypes.any),
    content: PropTypes.string,
    originalUrl: PropTypes.string,
    styles: PropTypes.string,
    helmetContext: PropTypes.objectOf(PropTypes.any),
    intl: PropTypes.objectOf(PropTypes.any),
    store: PropTypes.shape({
      getState: PropTypes.func,
    }).isRequired,
  };

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    assets: {},
    bundles: {},
    content: '',
    originalUrl: '',
    helmetContext: {},
    intl: { locale: 'en', messages: {} },
  };

  render() {
    const {
      assets, store, content, bundles, styles, helmetContext, intl, originalUrl
    } = this.props;

    const intlObject = intl || { locale: 'en', messages: {} };

    const { helmet } = helmetContext;
    const htmlAttrs = helmet && helmet.htmlAttributes.toComponent();

    /* eslint-disable react/no-danger,jsx-a11y/html-has-lang */
    return (
      <html className="no-js" {...htmlAttrs}>
        <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# Test-com: http://ogp.me/ns/fb/Test-com#">
          {helmet && helmet.base.toComponent()}
          {helmet && helmet.title.toComponent()}
          {helmet && helmet.meta.toComponent()}

          <meta property="fb:pages" content="419884231449669" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=contain" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Test" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="Test" />

          {helmet && helmet.link.toComponent()}

          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          {/* <link rel="manifest" href="/manifest.json" /> */}

          <link rel="icon" type="image/png" sizes="16x16" href="/dist/assets/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="228x228" href="/dist/assets/coast-228x228.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/dist/assets/favicon-32x32.png" />
          <link rel="manifest" href="/dist/assets/manifest.json" />
          <link rel="shortcut icon" href="/dist/assets/favicon.ico" />
          <link rel="yandex-tableau-widget" href="/dist/assets/yandex-browser-manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Test" />
          <meta name="application-name" content="Test" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#fff" />
          <meta name="msapplication-TileImage" content="/dist/assets/mstile-144x144.png" />
          <meta name="msapplication-config" content="/dist/assets/browserconfig.xml" />
          <meta name="theme-color" content="#fff" />
          <link rel="search" type="application/opensearchdescription+xml" title="Test" href="/osd.xml" />

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {/* {assets.styles
            && Object.keys(assets.styles)
              .map(style => style === 'main'
                ? (
                  <link
                    href={assets.styles[style]}
                    key={style}
                    rel="stylesheet"
                    charSet="UTF-8"
                  />
                )
                : null)
          } */}

          {!__DEVELOPMENT__ && bundles.linkElements && bundles.linkElements.map(ele => ele.props.as === 'style' && ele)}
          {bundles.styleElements && bundles.styleElements.map(ele => ele)}

          {/* (will be present only in development mode) */}
          {assets.styles && Object.keys(assets.styles).length === 0 && __DEVELOPMENT__ ? (
            <style dangerouslySetInnerHTML={{ __html: '#content{display:none}' }} />
          ) : null}

          <noscript id="jss-insertion-point" />
          {!!styles && <style type="text/css" id="server-side-styles" dangerouslySetInnerHTML={{ __html: styles }} />}

        </head>
        <body>
          <div id="content" disable-lazy-test="true" dangerouslySetInnerHTML={{ __html: content }} />
          {!content && (
            <div id="pg-loading-screen" style={{ display: 'none' }} className="pg-loading-screen pg-loading">
              <div className="pg-loading-inner">
                <div className="pg-loading-center-outer">
                  <div className="pg-loading-center-middle">
                    <h3 className="pg-loading-logo-header">Testparcel.com</h3>
                    <div className="pg-loading-html pg-loaded">
                      <p className="loading-message" />
                      <div className="sk-spinner sk-spinner-double-bounce">
                        <div className="sk-double-bounce1" />
                        <div className="sk-double-bounce2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!content && (
            <noscript>
              <div className="pg-loading-screen pg-loading">
                <div className="pg-loading-inner">
                  <div className="pg-loading-center-outer">
                    <div className="pg-loading-center-middle">
                      <h3 className="pg-loading-logo-header">Testparcel.com</h3>
                      <div className="pg-loading-html pg-loaded">
                        <p className="loading-message">
                          <div className="NoScriptForm-content">
                            <p>
                              We've detected that JavaScript is disabled in your browser. Testparcel.com need
                              JavaScript for work, please active and reload this page.
                            </p>
                          </div>
                        </p>
                        <div className="sk-spinner sk-spinner-double-bounce">
                          <div className="sk-double-bounce1" />
                          <div className="sk-double-bounce2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </noscript>
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.App = ${serialize({ locale: intlObject.lang, messages: intlObject.messages })};`,
            }}
          />
          {/* {assets.javascript && <script async src={assets.javascript.main} charSet="UTF-8" />} */}
          {/* {assets.javascript && <script async src={assets.javascript.vendor} charSet="UTF-8" />} */}
          {bundles.scriptElements && bundles.scriptElements.map(ele => ele)}
          {!__DEVELOPMENT__ && bundles.linkElements && bundles.linkElements.map(ele => ele.props.as !== 'style' && ele)}
          {/* {bundles.styleElements && bundles.styleElements.map(ele => ele)} */}

          {/* (will be present only in development mode) */}
          {assets.styles && Object.keys(assets.styles).length === 0 && __DEVELOPMENT__ ? (
            <script
              dangerouslySetInnerHTML={{
                __html: 'document.getElementById("content").style.display="block";',
              }}
            />
          ) : null}
          {!content && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  // eslint-disable-next-line
                  'if(document.getElementById("pg-loading-screen")) { document.getElementById("pg-loading-screen").style.display="block"; }',
              }}
            />
          )}
        </body>
      </html>
    );
    /* eslint-enable react/no-danger */
  }
}
