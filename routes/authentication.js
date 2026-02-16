const router = require('express').Router();
const { registerOAuthClientValidation, validateRequest } = require('../middleware/validate');
const {
    requireAdminToken,
    registerClient,
    login,
    githubCallback,
    logout
} = require('../controllers/authenticationController');

router.post('/clients', /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Registers a GitHub OAuth client for use with this API.'
    #swagger.parameters['client'] = {
        in: 'body',
        description: 'OAuth client info',
        required: true,
        schema: {
            name: 'My App',
            clientId: 'github_client_id',
            clientSecret: 'github_client_secret',
            callbackUrl: 'https://your-api.com/auth/github/callback'
        }
    }
    #swagger.parameters['x-admin-token'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Admin token for OAuth client registration'
    }
    #swagger.responses[201] = { description: 'OAuth client registered successfully' }
    #swagger.responses[409] = { description: 'OAuth client already exists' }
*/ requireAdminToken, registerOAuthClientValidation, validateRequest, registerClient);

router.get('/login', /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Initiates GitHub OAuth authentication flow using a registered client.'
    #swagger.parameters['client_id'] = {
        in: 'query',
        description: 'Registered OAuth clientId',
        required: true,
        type: 'string'
    }
    #swagger.responses[302] = { description: 'Redirect to GitHub for authentication' }
*/ login);

router.get('/github/callback', /*
    #swagger.ignore = true
*/ githubCallback);

router.get('/logout', /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Logs out the current user and destroys the session.'
    #swagger.responses[200] = { description: 'User logged out successfully' }
    #swagger.responses[500] = { description: 'Logout failed' }
*/ logout);

module.exports = router;