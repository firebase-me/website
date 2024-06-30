# Firebase Auth with Custom Tokens

## Creating Custom Tokens

Custom tokens are a powerful way to authenticate users in Firebase. They allow you to integrate with your existing authentication systems and create tokens that Firebase can understand. Here’s how you can create custom tokens using the Firebase Admin SDK.

### Step-by-Step Guide

1. **Set up the Firebase Admin SDK**:

    First, you need to set up the Firebase Admin SDK in your server environment. Install the SDK using npm:

    ```sh
    npm install firebase-admin
    ```

    Initialize the SDK in your application:

    ```javascript
    const admin = require('firebase-admin');

    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
    ```

2. **Create a Custom Token**:

    Use the `createCustomToken` method to create a custom token for a user:

    ```javascript
    const uid = 'some-uid';

    admin.auth().createCustomToken(uid)
        .then((customToken) => {
            // Send token back to client
            console.log('Custom Token:', customToken);
        })
        .catch((error) => {
            console.error('Error creating custom token:', error);
        });
    ```

## Best Use Cases

Custom tokens are particularly useful in several scenarios:

1. **Migrating Users**: If you are migrating users from an existing authentication system to Firebase Auth, you can create custom tokens to authenticate users with their existing credentials.

2. **Integrating with External Services**: When you need to integrate with external authentication services that Firebase Auth does not support natively, custom tokens provide a way to bridge the gap.

3. **Role-Based Access Control (RBAC)**: Custom tokens can include additional claims to manage user roles and permissions.

    ```javascript
    const additionalClaims = {
        admin: true,
        premiumAccount: true
    };

    admin.auth().createCustomToken(uid, additionalClaims)
        .then((customToken) => {
            // Send token back to client
            console.log('Custom Token with Claims:', customToken);
        })
        .catch((error) => {
            console.error('Error creating custom token with claims:', error);
        });
    ```

## Expanding on 2FA Concepts

Two-Factor Authentication (2FA) adds an extra layer of security to your authentication process. Firebase can work with custom tokens to implement 2FA. Here’s a basic approach:

1. **Initial Authentication**:

    Authenticate the user with their primary credential (e.g., email and password).

2. **Send a Verification Code**:

    After the initial authentication, send a verification code to the user's phone or email.

3. **Verify the Code**:

    Once the user receives the code, prompt them to enter it in your application. Verify the code on the server:

    ```javascript
    const verificationCode = 'user-entered-code';
    // Verify the code with your logic

    // If verification is successful, issue a custom token
    admin.auth().createCustomToken(uid)
        .then((customToken) => {
            // Send token back to client
            console.log('Custom Token after 2FA:', customToken);
        })
        .catch((error) => {
            console.error('Error creating custom token after 2FA:', error);
        });
    ```

4. **Authenticate with Firebase**:

    Use the custom token to authenticate with Firebase on the client:

    ```javascript
    firebase.auth().signInWithCustomToken(customToken)
        .then((userCredential) => {
            // User is authenticated
            console.log('User signed in after 2FA:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error signing in with custom token after 2FA:', error);
        });
    ```

## Temporary Properties and Custom Claims

Custom claims can be used to add temporary properties or roles to a user’s token. This can be useful for features that are only available for a limited time or under certain conditions.

### Adding Temporary Properties

You can add temporary properties to a user’s token by including them in the additional claims when creating the custom token. These properties can be checked on the client side to enforce temporary access.

```javascript
const additionalClaims = {
    tempAccess: true,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)  // 1 hour expiration
};

admin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
        // Send token back to client
        console.log('Custom Token with Temporary Properties:', customToken);
    })
    .catch((error) => {
        console.error('Error creating custom token with temporary properties:', error);
    });
```

### Using Custom Claims for Role-Based Access

Custom claims are particularly useful for managing user roles and permissions. For example, you can add roles such as `admin`, `editor`, or `viewer` to a user’s token.

```javascript
const additionalClaims = {
    role: 'admin'
};

admin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
        // Send token back to client
        console.log('Custom Token with Role:', customToken);
    })
    .catch((error) => {
        console.error('Error creating custom token with role:', error);
    });
```

## Setting Custom Expiration Times

Custom tokens can be set to expire at different times based on your application's requirements. You can create short-lived tokens for security-sensitive operations or long-lived tokens for persistent user sessions.

### Short-Lived Tokens

Short-lived tokens are ideal for temporary access or single-use scenarios. You can set a short expiration time using the `exp` claim.

```javascript
const additionalClaims = {
    exp: Math.floor(Date.now() / 1000) + (5 * 60)  // 5 minutes expiration
};

admin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
        // Send token back to client
        console.log('Short-Lived Custom Token:', customToken);
    })
    .catch((error) => {
        console.error('Error creating short-lived custom token:', error);
    });
```

### Long-Lived Tokens

Long-lived tokens can be used for user sessions that need to persist over a long period. You can set a long expiration time, such as several months or even years.

```javascript
const additionalClaims = {
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)  // 1 year expiration
};

admin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
        // Send token back to client
        console.log('Long-Lived Custom Token:', customToken);
    })
    .catch((error) => {
        console.error('Error creating long-lived custom token:', error);
    });
```

## Linking Behavior

Firebase allows you to link multiple authentication providers to a single user account. This can be useful if you want to allow users to sign in with different methods while maintaining a single user profile.

### Linking Accounts

To link an account, the user must sign in with one provider and then link another provider to their account.

1. **Sign in with the first provider**:

    ```javascript
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in
            const user = userCredential.user;
            console.log('Signed in with Email:', user);

            // Link with the second provider
            const credential = firebase.auth.GoogleAuthProvider.credential(googleAccessToken);
            return user.linkWithCredential(credential);
        })
        .then((usercred) => {
            console.log('Account linking success', usercred);
        })
        .catch((error) => {
            console.error('Error linking account', error);
        });
    ```

2. **Unlink an account**:

    If a user decides to unlink a provider from their account, you can do so by calling the `unlink` method.

    ```javascript
    const user = firebase.auth().currentUser;
    user.unlink(firebase.auth.GoogleAuthProvider.PROVIDER_ID)
        .then(() => {
            console.log('Account unlinked');
        })
        .catch((error) => {
            console.error('Error unlinking account', error);
        });
    ```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)

By leveraging custom tokens, temporary properties, custom claims, and linking behavior, you can create a flexible and secure authentication system tailored to your application's needs.
