# Managing Multiple Auth for Your Users

## Linking Accounts

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

## Managing Master Auth and Child Linked Auth

When managing multiple authentication providers, it is important to determine a primary (master) authentication method and handle child linked accounts accordingly.

### Switching Master Auth

If the current master auth method is incorrect or needs to be changed, follow these steps to switch to another provider:

1. **Sign in with the new provider**:

    ```javascript
    const newCredential = firebase.auth.GoogleAuthProvider.credential(googleAccessToken);

    firebase.auth().signInWithCredential(newCredential)
        .then((userCredential) => {
            // User signed in with new provider
            const user = userCredential.user;
            console.log('Signed in with new provider:', user);

            // Link the old provider to the new account
            const oldCredential = firebase.auth.EmailAuthProvider.credential(email, password);
            return user.linkWithCredential(oldCredential);
        })
        .then((usercred) => {
            console.log('Old provider linked to new provider:', usercred);
        })
        .catch((error) => {
            console.error('Error linking old provider to new provider:', error);
        });
    ```

2. **Unlink the previous master auth**:

    ```javascript
    const user = firebase.auth().currentUser;
    user.unlink(firebase.auth.EmailAuthProvider.PROVIDER_ID)
        .then(() => {
            console.log('Old master auth unlinked');
        })
        .catch((error) => {
            console.error('Error unlinking old master auth:', error);
        });
    ```

## Handling Guest Authentication

Guest authentication allows users to use your app without creating an account. Once a guest decides to register, you can link their guest session to a permanent account.

### Promoting a Guest Account to a Permanent Account

1. **Sign in as a guest**:

    ```javascript
    firebase.auth().signInAnonymously()
        .then((userCredential) => {
            // Guest user signed in
            const user = userCredential.user;
            console.log('Guest signed in:', user);
        })
        .catch((error) => {
            console.error('Error signing in as guest:', error);
        });
    ```

2. **Link guest account to a permanent account**:

    ```javascript
    const guestUser = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    guestUser.linkWithCredential(credential)
        .then((usercred) => {
            console.log('Guest account linked to permanent account:', usercred);
        })
        .catch((error) => {
            console.error('Error linking guest account to permanent account:', error);
        });
    ```

## Migrating Auth with External Providers

Migrating users from external authentication providers to Firebase can be done by creating custom tokens or linking the external provider directly.

### Creating Custom Tokens for External Providers

1. **Create a custom token**:

    ```javascript
    const additionalClaims = {
        provider: 'externalProvider',
        externalId: 'externalUserId'
    };

    admin.auth().createCustomToken(uid, additionalClaims)
        .then((customToken) => {
            // Send token back to client
            console.log('Custom Token:', customToken);
        })
        .catch((error) => {
            console.error('Error creating custom token:', error);
        });
    ```

2. **Sign in with the custom token**:

    ```javascript
    firebase.auth().signInWithCustomToken(customToken)
        .then((userCredential) => {
            // User signed in with custom token
            console.log('Signed in with custom token:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error signing in with custom token:', error);
        });
    ```

### Linking External Provider Directly

1. **Sign in with the external provider**:

    ```javascript
    const provider = new firebase.auth.OAuthProvider('externalProvider.com');
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // User signed in with external provider
            console.log('Signed in with external provider:', result.user);
        })
        .catch((error) => {
            console.error('Error signing in with external provider:', error);
        });
    ```

2. **Link the external provider to an existing account**:

    ```javascript
    const user = firebase.auth().currentUser;
    const credential = provider.credential(externalAccessToken);

    user.linkWithCredential(credential)
        .then((usercred) => {
            console.log('External provider linked to existing account:', usercred);
        })
        .catch((error) => {
            console.error('Error linking external provider to existing account:', error);
        });
    ```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
