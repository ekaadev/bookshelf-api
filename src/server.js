import Hapi from '@hapi/hapi';
import { routers } from './routes.js';


const init = async () => {

  const server = Hapi.server({
    host: 'localhost',
    port: 9000
  });

  server.route(routers);

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

init();