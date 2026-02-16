process.env.NODE_ENV = 'test';
process.env.OAUTH_ADMIN_TOKEN = 'test-admin-token';
process.env.OAUTH_CLIENT_SECRET_KEY = Buffer.alloc(32, 1).toString('base64');
