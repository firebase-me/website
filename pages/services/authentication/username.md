# Firebase Auth with Usernames

Usernames are not the most secure solution, but they can be very convenient for users. This guide covers how to implement a username-based authentication system using email extensions and provides solutions for account recovery.

## Implementing Username-Based Authentication

To allow users to sign in with usernames, you can use email extensions. This involves treating the username as part of an email address in the format `username@<app.domain>`. 

### Setting Up Username Authentication

1. **Configure Firebase Authentication**:

    Ensure Firebase Authentication is set up for email/password sign-in in your Firebase console.

2. **Registering Users with Usernames**:

    When a user registers, create an email using their username and your app's domain.

    ```javascript
    const admin = require('firebase-admin');
    admin.initializeApp();

    async function registerUser(username, password) {
        const email = `${username}@myapp.com`;
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });

        console.log('User registered with username:', userRecord.uid);
    }

    // Example usage
    registerUser('johnsmith', 'password123')
        .then(() => console.log('Registration successful'))
        .catch(error => console.error('Error registering user:', error));
    ```

3. **Signing In with Usernames**:

    During sign-in, construct the email from the username and authenticate using Firebase's email/password sign-in.

    ```javascript
    const firebase = require('firebase');
    require('firebase/auth');

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_AUTH_DOMAIN',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_STORAGE_BUCKET',
        messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
        appId: 'YOUR_APP_ID'
    };
    firebase.initializeApp(firebaseConfig);

    async function signInWithUsername(username, password) {
        const email = `${username}@myapp.com`;
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('User signed in with username:', userCredential.user.uid);
        } catch (error) {
            console.error('Error signing in with username:', error);
        }
    }

    // Example usage
    signInWithUsername('johnsmith', 'password123')
        .then(() => console.log('Sign-in successful'))
        .catch(error => console.error('Error signing in:', error));
    ```

### Account Recovery

To facilitate account recovery, ensure users can reset their passwords using the username-based email format.

1. **Password Reset**:

    Use Firebase's password reset functionality to allow users to reset their passwords.

    ```javascript
    async function sendPasswordResetEmail(username) {
        const email = `${username}@myapp.com`;
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            console.log('Password reset email sent to:', email);
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }

    // Example usage
    sendPasswordResetEmail('johnsmith')
        .then(() => console.log('Password reset email sent'))
        .catch(error => console.error('Error sending password reset email:', error));
    ```

2. **Routing and Managing Emails**:

    Ensure your app's domain points to a known email server to manage and route emails appropriately. You may need to set up email forwarding or a catch-all email address to handle communications.

### Security Considerations

While username-based authentication can be convenient, it is important to consider the following security measures:

1. **Enforce Strong Passwords**:

    Ensure users create strong passwords to enhance security.

    ```javascript
    const password = 'StrongP@ssw0rd!'; // Example of a strong password
    ```

2. **Rate Limiting and Monitoring**:

    Implement rate limiting and monitor for suspicious activity to prevent brute-force attacks.

    ```javascript
    // Example of rate limiting (implementation depends on your backend setup)
    const rateLimit = require('express-rate-limit');

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // Limit each IP to 100 requests per windowMs
    });

    app.use('/auth', limiter);
    ```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
