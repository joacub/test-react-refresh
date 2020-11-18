import path from 'path';
import express from 'express';
// import cors from 'cors';
import ReactDOM from 'react-dom/server';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import httpProxy from 'http-proxy';
import PrettyError from 'pretty-error';
import http from 'http';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server';
import config from 'config';
import apiClient from 'helpers/apiClient';
import Html from 'helpers/Html';
import { createApp } from 'app';
import { waitChunks } from 'utils/chunks';
// import blocked from 'blocked';
import humans from 'express-humans';
import chalk from 'chalk';
import { successBox, errorBox } from 'utils/cli/formatting';
import { getFormattedMemoryUsage } from 'utils/cli/memory';
import App from 'containers/App/App';

export default parameters => {
  // const expireTimeCookieLink = 1 * 365 * 24 * 60 * 60 * 1000;

  // You can find a benchmark of the available CSS minifiers under
  // https://github.com/GoalSmashers/css-minification-benchmark
  // We have found that clean-css is faster than cssnano but the output is larger.
  // Waiting for https://github.com/cssinjs/jss/issues/279
  // 4% slower but 12% smaller output than doing it in a single step.
  //
  // It's using .browserslistrc
  // let prefixer;
  // let cleanCSS;

  // if (process.env.NODE_ENV === 'production') {
  //   const postcss = require('postcss');
  //   const autoprefixer = require('autoprefixer');
  //   const CleanCSS = require('clean-css');

  //   prefixer = postcss([autoprefixer]);
  //   cleanCSS = new CleanCSS();
  // }

  // blocked(ms => {
  //   console.warn('SERVER ------>>> event loop blocked for', ms, 'ms');
  // });

  // const chunksPath = path.join(__dirname, '..', 'static', 'dist', 'loadable-chunks.json');
  // This is the stats file generated by webpack loadable plugin
  const statsFile = path.join(__dirname, '..', '..', 'static', 'dist', 'loadable-stats.json');
  // const statsFile = path.join(__dirname, '..', 'server', 'loadable-stats.json');
  const pretty = new PrettyError();
  // eslint-disable-next-line
  process.on('unhandledRejection', (reason, p) => process.stdout.write(
    `${errorBox(['Unhandled Rejection at: Promise ', p, pretty.render(reason)].join('\n'), 'SERVER')}\n\n\n\n`
  ));
  process.on('uncaughtException', (reason, p) => process.stdout.write(
    `${errorBox(['Unhandled Rejection at: Promise ', p, pretty.render(reason)].join('\n'), 'SERVER')}\n\n\n\n`
  ));

  const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
  const app = express();
  const server = new http.Server(app);
  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true,
  });

  if (__DEVELOPMENT__) {
    app.use(morgan('dev', { skip: req => req.originalUrl.indexOf('/ws') !== -1 }));
  }

  app
    .use(cookieParser())
    .use(compression())
    .use(
      humans({
        header: 'Test',
        team: [
          {
            'Original developer': 'Test',
            Twitter: '@Test',
          },
        ],
        thanks: ['Node'],
        site: {
          Standards: 'HTML5, CSS3',
          Softwares: 'Visual Studio code',
        },
        note: 'Built with love by Testparcel.com.',
      })
    )
    .use(favicon(path.join(__dirname, '../../', 'static', 'favicon.ico')))
    .use('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '../../', 'static', 'manifest.json')));
  app.use('/service-worker.js', (req, res) => {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-store');
    return res.sendFile(path.join(__dirname, '..', 'static', 'dist', 'service-worker.js'));
  });

  app.use('/sw-import.js', (req, res) => {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-store');
    return res.sendFile(path.join(__dirname, '..', 'static', 'dist', 'sw-import.js'));
  });

  app.use(express.static(path.join(__dirname, '..', 'static')));

  app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    res.setHeader('X-Real-IP', ip);
    res.setHeader('X-Forwarded-For', ip);
    next();
  });

  app.use('/ws', (req, res) => {
    proxy.web(req, res, { target: `${targetUrl}/ws` });
  });

  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }

    if (!res.headersSent && typeof res.writeHead !== 'undefined') {
      res.writeHead(500, { 'content-type': 'application/json' });
    }

    const json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
  });

  app.use(async (req, res) => {
    const _app = createApp(req);

    const providers = {
      client: apiClient(req),
      app: _app,
      restApp: _app,
    };

    let preloadedState;
    try {
      preloadedState = {};
      if (preloadedState) {
        delete preloadedState._persist;
      }
    } catch (e) {
      preloadedState = {};
    }

    const helmetContext = {};

    const assets = parameters.chunks();

    function hydrate() {
      res.write('<!doctype html>');

      ReactDOM.renderToNodeStream(<Html helmetContext={helmetContext} assets={assets} store={{}} />).pipe(res);
    }

    if (__DISABLE_SSR__) {
      return hydrate();
    }

    try {
      const extractor = new ChunkExtractor({ statsFile });
      const context = {};
      const component = extractor.collectChunks(
        <StaticRouter location={req.originalUrl} context={context}>
          <App />
        </StaticRouter>
      );

      const content = ReactDOM.renderToString(component);

      if (context.url) {
        return res.redirect(context.code || 301, context.url);
      }

      // const bundles = getBundles(getChunks(), modules);

      // You can now collect your script tags
      const scriptElements = extractor.getScriptElements({ async: false, defer: true }); // or extractor.getScriptElements();

      // You can also collect your "preload/prefetch" links
      const linkElements = extractor.getLinkElements(); // or extractor.getLinkElements();

      // And you can even collect your style tags (if you use "mini-css-extract-plugin")
      const styleElements = extractor.getStyleElements(); // or extractor.getStyleElements();

      const bundles = {
        scriptElements,
        linkElements,
        styleElements,
      };

      // console.log(styleElements, 'styleelements');

      const css = '';
      // if (process.env.NODE_ENV === 'production') {
      //   const result1 = await prefixer.process(css, { from: undefined });
      //   ({ css } = result1);
      //   css = cleanCSS.minify(css).styles;
      // }

      const html = (
        <Html
          intl={providers.intl}
          helmetContext={helmetContext}
          assets={assets}
          bundles={bundles}
          content={content}
          store={{}}
          styles={css}
          originalUrl={req.originalUrl}
        />
      );

      const code = context.code ? context.code : 200;

      // let Link = '';

      // if (bundles.linkElements) {
      //   bundles.linkElements.forEach(bundle => {
      //     if (Link === '') {
      //       Link += `<${bundle.key}>; rel=preload; as=script`;
      //     } else {
      //       Link += `, <${bundle.key}>; rel=preload; as=script`;
      //     }
      //   });
      // }

      // const cookieLink = req.cookies.linkPushed;
      // if (assets.styles) {
      //   Object.keys(assets.styles)
      //     .forEach(style => {
      //       if (style === 'main' && cookieLink !== assets.styles[style]) {
      //         res.cookie('linkPushed', assets.styles[style], { maxAge: expireTimeCookieLink, httpOnly: true });
      //         if (Link === '') {
      //           Link += `<${assets.styles[style]}>; rel=preload; as=style`;
      //         } else {
      //           Link += `, <${assets.styles[style]}>; rel=preload; as=style`;
      //         }
      //       }
      //     });
      // }

      // if (Link !== '') {
      //   res.setHeader('Link', Link);
      // }

      if (context.cacheControl) {
        // 'public, max-age=300'
        res.set('Cache-control', context.cacheControl);
      }

      res.status(code).send(`<!doctype html>${ReactDOM.renderToString(html)}`);
      // }
    } catch (mountError) {
      console.error('MOUNT ERROR:', pretty.render(mountError));
      res.status(500);
      hydrate();
    }
  });

  (async () => {
    if (config.port) {
      try {
        process.stdout.write(
          `\n----\n==> ${chalk.yellow('⚠ Waiting for chunks: ')}${chalk.underline.blue(statsFile)}\n`
        );
        await waitChunks(statsFile);
        process.stdout.write(`\n----\n==> ${chalk.green('✔ Chunks files created')}\n`);
        // We create an extractor from the statsFile
      } catch (error) {
        process.stdout.write(errorBox(error, 'Server preload error'));
      }

      server.listen(config.port, err => {
        if (err) {
          console.error(err);
        }

        const titleLines = [];
        const messageLines = [];

        titleLines.push('SERVER');
        // Name and version
        titleLines.push(`${chalk.green.bold('Node.js')} ${process.version}`);
        // Running mode
        titleLines.push(
          `Running in ${
            __DEVELOPMENT__ ? chalk.bold.blue('development') : chalk.bold.green('production')
          } mode (${chalk.bold('Universal SSR')})`
        );
        titleLines.push(getFormattedMemoryUsage());

        messageLines.push(`----\n==> ✅  ${config.app.title} is running, talking to API server on ${config.apiPort}.`);
        messageLines.push(`==> 💻  Open http://${config.host}:${config.port} in a browser to view the app.`);
        process.stdout.write(successBox(messageLines.join('\n'), titleLines.join('\n')));
        process.stdout.write('\n\n\n\n\n');
      });

      server.setTimeout(600000);

      process.on('SIGINT', () => {
        server.close(err => {
          process.exit(err ? 1 : 0);
        });
      });
    } else {
      process.stdout.write(errorBox('==>     ERROR: No PORT environment variable has been specified'));
    }
  })();
};
