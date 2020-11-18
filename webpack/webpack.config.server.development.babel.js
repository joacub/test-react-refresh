import configuration from './webpack.config.server.production.babel'
import { setDevFileServer } from './devserver'

// Same as production configuration
// with the only change that all files
// are served by webpack devserver.
const data = setDevFileServer(configuration);

export default data;