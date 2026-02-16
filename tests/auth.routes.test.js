jest.mock('passport');

const request = require('supertest');
const { createApp } = require('../app');
const OAuthClients = require('../models/OAuthClients');
const database = require('../data/database');

jest.mock('../models/OAuthClients');
jest.mock('../data/database');

database.getConnectionState.mockReturnValue(true);
database.getDb.mockReturnValue({});

const app = createApp({ enableSwagger: false });

const validClientPayload = {
  name: 'Test App',
  clientId: 'client-123',
  clientSecret: 'secret-456',
  callbackUrl: 'http://localhost:8080/auth/github/callback'
};

describe('Authentication routes', () => {
  beforeEach(() => {
    OAuthClients.findClientByClientId.mockReset();
    OAuthClients.insertClient.mockReset();
  });

  test('POST /auth/clients rejects missing admin token', async () => {
    OAuthClients.findClientByClientId.mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/clients')
      .send(validClientPayload);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized.' });
  });

  test('POST /auth/clients registers client with admin token', async () => {
    OAuthClients.findClientByClientId.mockResolvedValue(null);
    OAuthClients.insertClient.mockResolvedValue({ _id: 'mongo-id' });

    const response = await request(app)
      .post('/auth/clients')
      .set('x-admin-token', process.env.OAUTH_ADMIN_TOKEN)
      .send(validClientPayload);

    expect(response.status).toBe(201);
    expect(response.body.clientId).toBe(validClientPayload.clientId);
  });

  test('POST /auth/clients rejects invalid payload with 400', async () => {
    OAuthClients.findClientByClientId.mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/clients')
      .set('x-admin-token', process.env.OAUTH_ADMIN_TOKEN)
      .send({ clientId: 'client-123', clientSecret: 'secret-456' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('POST /auth/clients rejects duplicate clientId', async () => {
    OAuthClients.findClientByClientId.mockResolvedValue({ clientId: 'client-123' });

    const response = await request(app)
      .post('/auth/clients')
      .set('x-admin-token', process.env.OAUTH_ADMIN_TOKEN)
      .send(validClientPayload);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'OAuth client already exists.' });
  });

  test('GET /auth/login requires client_id', async () => {
    const response = await request(app)
      .get('/auth/login');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'client_id is required.' });
  });

  test('GET /auth/login redirects with valid client', async () => {
    OAuthClients.findClientByClientId.mockResolvedValue({
      clientId: 'client-123',
      clientSecret: 'secret-456',
      callbackUrl: 'http://localhost:8080/auth/github/callback',
      enabled: true
    });

    const response = await request(app)
      .get('/auth/login')
      .query({ client_id: 'client-123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/mock');
  });

  test('GET /auth/logout responds with success message', async () => {
    const response = await request(app)
      .get('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Application client logged out successfully' });
  });
});
