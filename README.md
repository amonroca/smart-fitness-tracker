# smart-fitness-tracker

A RESTful API for a smart fitness tracker with CRUD for users, workouts, nutrition, and goals, plus GitHub OAuth authentication for client applications.

## Download and install

1. Clone the repository:
   ```bash
   git clone https://github.com/amonroca/smart-fitness-tracker.git
   cd smart-fitness-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (example):
   ```dotenv
   PORT=8080
   DATABASE_URL=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   OAUTH_ADMIN_TOKEN=your_admin_token
   OAUTH_CLIENT_SECRET_KEY=base64_32_bytes_key
   ```
4. Start the API:
   ```bash
   node server.js
   ```

## Register new applications (OAuth clients)

To register a new client, send a POST request to `/auth/clients` with the admin token.

```bash
curl -X POST http://localhost:8080/auth/clients \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{
	 "name": "My App",
	 "clientId": "GITHUB_CLIENT_ID",
	 "clientSecret": "GITHUB_CLIENT_SECRET",
	 "callbackUrl": "http://localhost:8080/auth/github/callback"
  }'
```

## Authentication flow

1. Initiate the login:
   ```
   GET /auth/login?client_id=GITHUB_CLIENT_ID
   ```
2. GitHub redirects back to:
   ```
   GET /auth/github/callback
   ```
3. After success, the API redirects to `/` and displays the authenticated application name.

## Swagger documentation

- Local Swagger UI: http://localhost:8080/api-docs
- Regenerate docs (if needed):
  ```bash
  npm run swagger
  ```

## Environment variables

| Name                      | Required | Description                                                      |
| ------------------------- | -------- | ---------------------------------------------------------------- |
| `PORT`                    | No       | API port (default: 8080).                                        |
| `DATABASE_URL`            | Yes      | MongoDB connection string.                                       |
| `OAUTH_ADMIN_TOKEN`       | Yes      | Admin token required by `POST /auth/clients`.                    |
| `OAUTH_CLIENT_SECRET_KEY` | Yes      | 32-byte base64 key used to encrypt OAuth client secrets at rest. |

## Generate environment values

Use the commands below to generate secure values for the secrets:

### Admin token

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### OAuth client secret key

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### MongoDB connection string

Example MongoDB connection string:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart-fitness-tracker?retryWrites=true&w=majority
```

## Production address

https://smart-fitness-tracker-knr2.onrender.com

## Testing on Production Environment

### Prod Admin Token

- JLhv7TA5L57oFhXpDvXV1tLiz72o3H6WpS3kk1C3Kv8=

### Prod Client IDs

You can use the Prod Admin Token to register your own GitHub OAuth apps or use one of the following client ids:

- Ov23li45Si2AOVj1zucN
- Ov23liMEBkR8i3QcqOaS
