import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { port } from './config/index.js';
import routes from './routes/router.js';

const app = express();

app.use(
  cors(),
  express.json(),
  routes
);

app.listen(port, () =>
  console.log(`🚀 Backend rodando em http://localhost:${port}`)
);
