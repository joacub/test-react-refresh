module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'API-BRINGER-BPS',
      script: 'bin/api.js',
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      instances: 2,
      exec_mode: 'cluster_mode',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        UV_THREADPOOL_SIZE: 12,
        NODE_ENV: 'production',
        NODE_PATH: 'api',
        PORT: 9777,
        APIPORT: 5757,
        HOST: '127.0.0.1',
      },
      env_dev: {
        NODE_ENV: 'development',
        NODE_PATH: 'api',
        PORT: 3000,
        APIPORT: 3030,
      }
    },

    // Second application
    {
      name: 'WEB-BRINGER-BPS',
      script: 'bin/server.js',
      error_file: './logs/web-err.log',
      out_file: './logs/web-out.log',
      instances: 2,
      exec_mode: 'cluster_mode',
      env_production: {
        UV_THREADPOOL_SIZE: 12,
        NODE_ENV: 'production',
        NODE_PATH: 'src',
        PORT: 9777,
        APIPORT: 5757,
        HOST: '127.0.0.1',
      },
      env_dev: {
        NODE_ENV: 'development',
        NODE_PATH: 'src',
        PORT: 3000,
        APIPORT: 3030,
      }
    },
    // Second application
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'node',
      host: '167.114.100.28',
      ref: 'origin/master',
      repo: 'git@github.com:joacub/react-bringer-webapp.git',
      path: '/var/www/bringerparcel.com.production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/master',
      repo: 'git@github.com:joacub/react-bringer-webapp.git',
      path: '/var/www/bringerparcel.com.development',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
      // env: {
      //   NODE_ENV: 'dev'
      // }
    }
  }
};
