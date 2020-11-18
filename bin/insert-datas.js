require('../server.babel'); // babel registration (runtime transpilation for node)
const init = require('../api/database/insert-datas').default;

init().then(() => {
  process.exit();
});
