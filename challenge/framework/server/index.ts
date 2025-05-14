import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import buildHtmlDoc from './buildHtmlDoc';
import renderApp from './renderApp';
import * as fs from 'fs';
import { startMswServer } from '../mock-server/server';
import { wipeCache } from '../../caching-fetch-library/cachingFetch';
import { landing } from './landing.ts';

const runServer = async () => {
  // start the msw server
  await startMswServer();

  const fastify = Fastify({
    logger: true,
  });

  // helmet security and CORS (cors looks not to be needed in this scope)
  // fastify.register(helmet);
  // fastify.register(cors);

  // serve the framwork runtime
  fastify.get('/client.js', async (request, reply) => {
    try {
      const clientJs = fs.readFileSync('./dist/client.js');
      reply
        .header('content-type', 'text/javascript')
        .send(clientJs);
    } catch (error) {
      console.error(`Error serving client.js:`, error);
      reply
        .status(500)
        .send('Internal Server Error');
    }
  });

  // serve the service worker for msw to work in the browser
  fastify.get('/mockServiceWorker.js', async (request, reply) => {
    try {
      const mswJs = fs.readFileSync('./dist/mockServiceWorker.js');
      reply
        .header('content-type', 'text/javascript')
        .send(mswJs);
    } catch (error) {
      console.error(`Error serving mockServiceWorker.js:`, error);
      reply
        .status(500)
        .send('Internal Server Error');
    }
  });

  // serve a static landing page to provide links to the two versions of the app
  fastify.get('/', async (request, reply) => {
    try {
      reply
        .header('content-type', 'text/html')
        .send(
          buildHtmlDoc([landing], false));
    } catch (error) {
      console.error(`Error serving landing page:`, error);
      reply
        .status(500)
        .send('Internal Server Error');
    }
  });

  // serve the application, with data loader on the server
  fastify.get('/appWithSSRData', async (request, reply) => {
    try {
      wipeCache();
      reply
        .header('content-type', 'text/html')
        .send(buildHtmlDoc(await renderApp(true)));
    } catch (error) {
      console.error(`Error serving appWithSSRData:`, error);
      reply
        .status(500)
        .send('Internal Server Error');
    }
  });

  // serve the application, without data loader on the server
  fastify.get('/appWithoutSSRData', async (request, reply) => {
    try {
      wipeCache();
      reply
        .header('content-type', 'text/html')
        .send(buildHtmlDoc(await renderApp(false)));
    } catch (error) {
      console.error(`Error serving appWithoutSSRData:`, error);
      reply
        .status(500)
        .send('Internal Server Error');
    }
  });

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
  });
};

runServer();
