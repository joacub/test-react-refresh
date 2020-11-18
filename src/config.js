/* eslint-disable max-len */

import configLocal from 'config-local.js';

const environment = {
  development: {
    domain: 'http://localhost:3000',
    domainIframe: 'http://localhost:3000',
    domainImages: 'http://localhost:3000',
    isProduction: false,
    assetsPath: `http://${process.env.HOST || 'localhost'}:${+process.env.PORT + 1 || 3001}/dist/`
  },
  production: {
    isProduction: true,
    assetsPath: '/dist/',
    domain: 'https://Testparcel.com',
    domainIframe: 'https://iframe.Testparcel.com',
    domainImages: 'https://Testparcel.com'
  }
}[process.env.NODE_ENV || 'development'];

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  integrations: {
    correiosDoBrazil: {
      contractNumber: 9912466056,
    }
  },
  app: {
    title: 'Test',
    description: 'Test ',
    head: {
      titleTemplate: '%s',
      defaultTitle: 'Test',
      link: [{ type: 'text/plain', rel: 'author', href: 'https://Testparcel.com/humans.txt' }],
      meta: [
        { name: 'description', content: 'Test - Storeis And More.' },
        { charset: 'utf-8' },
        { property: 'fb:pages', content: '2198307663748082' },
        { property: 'fb:app_id', content: '296111991114313' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Test ' },
        {
          property: 'og:image',
          content: 'https://Testparcel.com/media/max_1200/1*NaXapbTluUAlP1Xmqib5mQ.png'
        },
        // { property: 'twitter:image:src', content: 'https://Testparcel.com/media/max_1200/1*NaXapbTluUAlP1Xmqib5mQ.png' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Test ' },
        { property: 'og:description', content: 'Test .' },
        // { property: 'og:card', content: 'summary' }
        { property: 'twitter:site', content: '@Test' },
        { property: 'og:site', content: '@Test' },
        { property: 'og:creator', content: '@Test' }
        // { property: 'og:image:width', content: '200' },
        // { property: 'og:image:height', content: '200' }
      ]
    }
  }
};

Object.assign(config, environment);
Object.assign(config, configLocal);

export default config;
