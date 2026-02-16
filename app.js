const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

function createApp(options = {}) {
  const { enableSwagger = true } = options;

  // Load environment variables from .env file
  dotenv.config();

  const app = express();

  // Middleware setup
  app.use(bodyParser.json());

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

  // Initialize Passport.js for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV === 'test') {
    app.use((req, res, next) => {
      const testUser = req.headers['x-test-user'];
      if (testUser) {
        req.session.user = { username: testUser };
      }
      if (!req.logout) {
        req.logout = (cb) => (cb ? cb() : undefined);
      }
      next();
    });
  }

  // CORS configuration to allow requests from any origin
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Serialize and deserialize user information for session management
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Define routes
  app.get('/', (req, res) => {
    if (req.session.appName) {
      return res.send(`Authentication successful. Application: ${req.session.appName}.`);
    }
    res.send('Application client not logged in.');
  });

  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (enableSwagger) {
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swagger-output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.use('/', require('./routes'));

  return app;
}

module.exports = { createApp };
