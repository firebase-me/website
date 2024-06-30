# Custom Claims in Firebase Auth

Custom claims in Firebase allow you to add additional information to the user's ID token, enabling you to implement role-based access control and other features. This guide covers the limitations, best use case examples, and common caveats of using custom claims, including forbidden claim names.

## Overview of Custom Claims

Custom claims are additional attributes that you can add to a user's ID token. They are typically used to store user roles and permissions, which can then be used to control access to different parts of your application.

### Setting Custom Claims

Custom claims are set using the Firebase Admin SDK. Here’s how you can set custom claims for a user:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

async function setCustomClaims(uid, claims) {
    try {
        await admin.auth().setCustomUserClaims(uid, claims);
        console.log('Custom claims set for user:', uid);
    } catch (error) {
        console.error('Error setting custom claims:', error);
    }
}

// Example usage
setCustomClaims('user-uid', { admin: true, accessLevel: 5 })
    .then(() => console.log('Custom claims set successfully'))
    .catch(error => console.error('Error setting custom claims:', error));
```

### Accessing Custom Claims

On the client side, you can access the custom claims after the user signs in:

```javascript
firebase.auth().currentUser.getIdTokenResult()
    .then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
            console.log('User is an admin');
        } else {
            console.log('User is not an admin');
        }
    })
    .catch((error) => {
        console.error('Error accessing custom claims:', error);
    });
```

## Limitations of Custom Claims

1. **Size Limit**: Custom claims should be small in size, as they are included in the ID token, which has a size limit of 1,000 bytes.
2. **Write Frequency**: Avoid frequently changing custom claims, as changes to custom claims invalidate the user's existing ID tokens, requiring them to sign in again.
3. **Synchronization**: Custom claims are not immediately available on the client after setting them on the server. The user needs to sign out and sign back in to get the updated claims.

## Best Use Case Examples

1. **Role-Based Access Control (RBAC)**:

    Use custom claims to assign roles to users and control access to different parts of your application.

    ```javascript
    const claims = { role: 'admin' };
    setCustomClaims('user-uid', claims);
    ```

2. **Feature Flags**:

    Use custom claims to enable or disable features for specific users.

    ```javascript
    const claims = { betaTester: true };
    setCustomClaims('user-uid', claims);
    ```

3. **Multi-Tenancy**:

    Use custom claims to manage access in multi-tenant applications.

    ```javascript
    const claims = { tenantId: 'tenant-123' };
    setCustomClaims('user-uid', claims);
    ```

## Caveats and Best Practices

1. **Forbidden Custom Claims**:

    The following is a list of custom claims that are forbidden to use as key names:
    > "amr", "at_hash", "aud", "auth_time", "azp", "cnf", "c_hash", "exp", "iat", "iss", "jti", "nbf", "nonce", "sub", "firebase"

2. **Security Considerations**:

    - Ensure that custom claims are only set by trusted backend services.
    - Do not store sensitive information in custom claims, as they can be read by the client.

3. **Token Size**:

    - Be mindful of the token size limit. Keep custom claims as small as possible.
    - If you need to store more data, consider using Firestore or Realtime Database and reference it using custom claims.

4. **Handling Changes**:

    - Inform users to sign out and sign back in to get updated claims.
    - Consider using a refresh mechanism to force token refresh on the client.

5. **Error Handling**:

    - Handle errors when setting custom claims, such as permission issues or invalid user IDs.

    ```javascript
    async function setCustomClaims(uid, claims) {
        try {
            await admin.auth().setCustomUserClaims(uid, claims);
            console.log('Custom claims set for user:', uid);
        } catch (error) {
            if (error.code === 'auth/invalid-uid') {
                console.error('Invalid user ID');
            } else if (error.code === 'auth/permission-denied') {
                console.error('Permission denied');
            } else {
                console.error('Error setting custom claims:', error);
            }
        }
    }
    ```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
