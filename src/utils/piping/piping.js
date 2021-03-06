// Generated by CoffeeScript 1.10.0
const piping = () => {
  const cluster = require('cluster');

  const path = require('path');

  require('colors');

  const options = {
    hook: false,
    includeModules: false,
    main: require.main.filename,
    ignore: /(\/\.|~$)/,
    respawnOnExit: true
  };

  module.exports = ops => {
    let chokidar; let fixChokidar; let initial; let key; let lastErr; let respawnPending; let value; let
      watcher;
    if (typeof ops === 'string' || ops instanceof String) {
      options.main = path.resolve(ops);
    } else {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (key in ops) {
        value = ops[key];
        options[key] = value;
      }
    }
    if (cluster.isMaster) {
      cluster.setupMaster({
        exec: path.join(path.dirname(module.filename), 'launcher.js')
      });
      chokidar = require('chokidar');
      fixChokidar = file => `${file.slice(0, -1)}[${file.slice(-1)}]`;
      initial = options.hook ? fixChokidar(options.main) : options.rootFolder || path.dirname(options.main);
      watcher = chokidar.watch(initial, {
        ignored: options.ignore,
        ignoreInitial: true,
        usePolling: options.usePolling,
        interval: options.interval || 100,
        binaryInterval: options.binaryInterval || 300
      });
      cluster.fork();
      respawnPending = false;
      lastErr = '';
      cluster.on('exit', () => {
        let hasWorkers;
        hasWorkers = false;
        const ref = cluster.workers;
        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const id in ref) {
          // eslint-disable-next-line no-unused-vars
          const worker = ref[id];
          hasWorkers = true;
        }
        if (!hasWorkers && (respawnPending || options.respawnOnExit)) {
          cluster.fork();
          respawnPending = false;
          return respawnPending;
        }
      });
      cluster.on('online', worker => {
        worker.send(options);
        return worker.on('message', message => {
          if (message.err && (!options.respawnOnExit || message.err !== lastErr)) {
            console.log('[piping]'.bold.red, "can't execute file:", options.main);
            console.log('[piping]'.bold.red, 'error given was:', message.err);
            if (options.respawnOnExit) {
              lastErr = message.err;
              return console.log('[piping]'.bold.red, 'further repeats of this error will be suppressed...');
            }
          } else if (message.file) {
            if (options.usePolling) {
              return watcher.add(message.file);
            }
            return watcher.add(fixChokidar(message.file));
          }
        });
      });
      watcher.on('change', file => {
        let id; let
          worker;
        console.log('[piping]'.bold.red, 'File', path.relative(process.cwd(), file), 'has changed, reloading.');
        const ref = cluster.workers;
        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (id in ref) {
          worker = ref[id];
          respawnPending = true;
          process.kill(worker.process.pid, 'SIGTERM');
        }
        if (!respawnPending) {
          return cluster.fork();
        }
      });
      return false;
    }
    return true;
  };
};
piping.call(this);
