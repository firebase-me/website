# External Auth Providers

## Firebase Auth Providers

Firebase provides built-in authentication for various providers such as Google, Facebook, Twitter, and more. However, there may be cases where you need to integrate an external authentication provider that is not natively supported by Firebase. This guide will cover the basics of handling custom providers, validating them, and using Discord as a primary example. We will also look at integrating OpenID Connect (OIDC) using the Google Identity Toolkit.

## Custom Authentication Providers

To integrate a custom authentication provider, you need to handle the provider's authentication flow, validate the obtained credentials, and create custom tokens for Firebase.

### Handling Custom Providers

1. **OAuth2 Flow**:

    Custom authentication providers typically use OAuth2 for authentication. You will need to handle the OAuth2 flow to obtain an access token and user information.

2. **Create Custom Tokens**:

    Once you have validated the user's credentials, create a custom token using Firebase Admin SDK. This custom token can then be used to authenticate with Firebase.

### Example: Integrating Discord

Discord is a popular platform that supports OAuth2 authentication. Here’s how you can integrate Discord as an authentication provider with Firebase.

1. **Set Up Discord OAuth2**:

    - Create an OAuth2 application in the [Discord Developer Portal](https://discord.com/developers/applications).
    - Add a redirect URI in the OAuth2 section.
    - Note down the Client ID and Client Secret.

2. **Implement OAuth2 Flow**:

    Use a suitable OAuth2 library or HTTP client to handle the authentication flow with Discord.

    ```javascript
    const axios = require('axios');
    const firebaseAdmin = require('firebase-admin');
    const functions = require('firebase-functions');

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault()
    });

    exports.authDiscord = functions.https.onRequest(async (req, res) => {
        const code = req.query.code;
        const discordClientId = 'YOUR_DISCORD_CLIENT_ID';
        const discordClientSecret = 'YOUR_DISCORD_CLIENT_SECRET';
        const redirectUri = 'YOUR_REDIRECT_URI';

        try {
            const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', null, {
                params: {
                    client_id: discordClientId,
                    client_secret: discordClientSecret,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const accessToken = tokenResponse.data.access_token;

            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const user = userResponse.data;

            const firebaseToken = await firebaseAdmin.auth().createCustomToken(user.id, {
                discord: true
            });

            res.json({ firebaseToken });
        } catch (error) {
            console.error('Error during Discord OAuth2 flow:', error);
            res.status(500).send('Authentication failed');
        }
    });
    ```

### Example: Integrating OpenID Connect (OIDC)

OpenID Connect (OIDC) is a popular authentication protocol supported by many identity providers. Firebase supports OIDC integration through the Google Identity Toolkit.

1. **Upgrade to Google Identity Toolkit**:

    To use OIDC, you need to upgrade Firebase Auth to use the Google Identity Toolkit. This process involves enabling the Identity Platform in the Google Cloud Console.

    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Navigate to "APIs & Services" > "Library".
    - Enable the "Identity Platform API".

2. **Configure OIDC Provider**:

    - Go to the Firebase Console.
    - Navigate to "Authentication" > "Sign-in method".
    - Add an OIDC provider and provide the necessary details (client ID, client secret, issuer URL).

3. **Implement OIDC Authentication**:

    Here is an example using Firebase Functions to handle OIDC authentication with a generic OpenID provider.

    ```javascript
    const { Issuer } = require('openid-client');
    const firebaseAdmin = require('firebase-admin');
    const functions = require('firebase-functions');

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault()
    });

    exports.authOIDC = functions.https.onRequest(async (req, res) => {
        const code = req.query.code;
        const oidcIssuerUrl = 'YOUR_OIDC_ISSUER_URL';
        const clientId = 'YOUR_OIDC_CLIENT_ID';
        const clientSecret = 'YOUR_OIDC_CLIENT_SECRET';
        const redirectUri = 'YOUR_REDIRECT_URI';

        try {
            const oidcIssuer = await Issuer.discover(oidcIssuerUrl);
            const client = new oidcIssuer.Client({
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uris: [redirectUri],
                response_types: ['code']
            });

            const tokenSet = await client.callback(redirectUri, { code });
            const userinfo = await client.userinfo(tokenSet.access_token);

            const firebaseToken = await firebaseAdmin.auth().createCustomToken(userinfo.sub, {
                oidc: true
            });

            res.json({ firebaseToken });
        } catch (error) {
            console.error('Error during OIDC flow:', error);
            res.status(500).send('Authentication failed');
        }
    });
    ```

## Expanding on Auth Permissions

With custom authentication, you can also define and manage user permissions more granularly. Firebase allows you to include custom claims in your tokens to manage user roles and permissions.

### Adding Custom Claims

Custom claims can be added to the Firebase token to include additional user information or permissions.

```javascript
const additionalClaims = {
    admin: true,
    accessLevel: 'full'
};

firebaseAdmin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
        // Send token back to client
        console.log('Custom Token with Claims:', customToken);
    })
    .catch((error) => {
        console.error('Error creating custom token with claims:', error);
    });
```

### Verifying Custom Claims

On the client side, you can verify these custom claims after the user signs in.

```javascript
firebase.auth().signInWithCustomToken(customToken)
    .then((userCredential) => {
        return userCredential.user.getIdTokenResult();
    })
    .then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
            console.log('User is an admin');
        } else {
            console.log('User is not an admin');
        }
    })
    .catch((error) => {
        console.error('Error verifying custom claims:', error);
    });
```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [OpenID Connect (OIDC) Documentation](https://openid.net/connect/)
- [Google Identity Platform Documentation](https://cloud.google.com/identity-platform/docs)
