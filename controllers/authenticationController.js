const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { getDb, getConnectionState } = require('../data/database');
const OAuthClients = require('../models/OAuthClients');
const { encryptSecret, decryptSecret } = require('../config/crypto');

const githubStrategies = new Map();
const ADMIN_TOKEN_HEADER = 'x-admin-token';

function requireAdminToken(req, res, next) {
    const configuredToken = process.env.OAUTH_ADMIN_TOKEN;
    if (!configuredToken) {
        return res.status(500).json({ message: 'OAUTH_ADMIN_TOKEN not configured.' });
    }
    const providedToken = req.headers[ADMIN_TOKEN_HEADER];
    if (!providedToken || providedToken !== configuredToken) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    next();
}

function getStrategyName(clientId) {
    return `github-${clientId}`;
}

function getClientSecret(client) {
    if (client.clientSecret) {
        return client.clientSecret;
    }
    if (client.clientSecretEnc && client.clientSecretIv && client.clientSecretTag) {
        return decryptSecret({
            enc: client.clientSecretEnc,
            iv: client.clientSecretIv,
            tag: client.clientSecretTag
        });
    }
    throw new Error('Client secret not available.');
}

function ensureGithubStrategy(client) {
    const strategyName = getStrategyName(client.clientId);
    if (!githubStrategies.has(strategyName)) {
        const clientSecret = getClientSecret(client);
        passport.use(strategyName, new GitHubStrategy({
            clientID: client.clientId,
            clientSecret,
            callbackURL: client.callbackUrl
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }));
        githubStrategies.set(strategyName, true);
    }
    return strategyName;
}

async function getOAuthClient(clientId) {
    if (!getConnectionState()) {
        return { error: { status: 503, message: 'Database connection not established.' } };
    }
    const client = await OAuthClients.findClientByClientId(getDb(), clientId);
    if (!client) {
        return { error: { status: 404, message: 'OAuth client not found.' } };
    }
    if (client.enabled === false) {
        return { error: { status: 403, message: 'OAuth client disabled.' } };
    }
    return { client };
}

async function registerClient(req, res, next) {
    try {
        if (!getConnectionState()) {
            return res.status(503).json({ message: 'Database connection not established.' });
        }

        const existing = await OAuthClients.findClientByClientId(getDb(), req.body.clientId);
        if (existing) {
            return res.status(409).json({ message: 'OAuth client already exists.' });
        }

        const encrypted = encryptSecret(req.body.clientSecret);
        const client = {
            name: req.body.name || null,
            clientId: req.body.clientId,
            clientSecretEnc: encrypted.enc,
            clientSecretIv: encrypted.iv,
            clientSecretTag: encrypted.tag,
            callbackUrl: req.body.callbackUrl,
            enabled: true,
            createdAt: new Date()
        };

        const result = await OAuthClients.insertClient(getDb(), client);
        return res.status(201).json({
            message: 'OAuth client registered successfully.',
            id: result._id,
            clientId: client.clientId
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const clientId = req.query.client_id;
        if (!clientId) {
            return res.status(400).json({ message: 'client_id is required.' });
        }

        const { client, error } = await getOAuthClient(clientId);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        const strategyName = ensureGithubStrategy(client);
        req.session.oauthClientId = clientId;
        return passport.authenticate(strategyName)(req, res, next);
    } catch (error) {
        next(error);
    }
}

async function githubCallback(req, res, next) {
    try {
        const clientId = req.session.oauthClientId || req.query.client_id;
        if (!clientId) {
            return res.status(400).json({ message: 'client_id is required.' });
        }

        const { client, error } = await getOAuthClient(clientId);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        const strategyName = ensureGithubStrategy(client);
        return passport.authenticate(strategyName, { failureRedirect: '/api-docs' }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/api-docs');
            }
            req.session.user = user;
            req.session.appName = client.name || client.clientId;
            delete req.session.oauthClientId;
            return res.redirect('/');
        })(req, res, next);
    } catch (error) {
        next(error);
    }
}

function logout(req, res) {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.json({ message: 'Application client logged out successfully' });
        });
    });
}

module.exports = {
    requireAdminToken,
    registerClient,
    login,
    githubCallback,
    logout
};
