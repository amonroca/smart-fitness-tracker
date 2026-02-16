const passport = {
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  authenticate: jest.fn(() => (req, res) => {
    res.status(302).set('Location', '/mock').end();
  }),
  use: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn()
};

module.exports = passport;
