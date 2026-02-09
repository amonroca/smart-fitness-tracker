const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDb, disconnectDb } = require('./data/database');

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 8080;

app.use('/', require('./routes'));

let server;

async function startWithRetry(maxRetries = 3, baseDelayMs = 500) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDb();
      server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
      return;
    } catch (err) {
      const isLast = attempt === maxRetries;
      const delay = Math.min(5000, baseDelayMs * Math.pow(2, attempt - 1));
      console.error(
        `DB connection attempt ${attempt}/${maxRetries} failed: ${err.message}`
      );
      if (isLast) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function shutdown(signal) {
  try {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log('HTTP server closed.');
    }
    await disconnectDb();
  } catch (err) {
    console.error('Error during shutdown:', err.message);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startWithRetry();