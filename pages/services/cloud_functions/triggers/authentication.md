# Firebase Authentication Triggers

## Overview
Firebase Authentication triggers allow you to execute Cloud Functions in response to events related to user authentication. These triggers are useful for implementing custom authentication workflows, enforcing additional security measures, and integrating with other services.

## Authentication Triggers

### onCreate

#### Introduction
The `onCreate` trigger is invoked when a new user account is created in Firebase Authentication. This trigger can be used to initialize user profiles, send welcome emails, or set custom claims.

#### Use Cases
1. **Initialize User Profiles:** Set up default user profiles or preferences upon account creation.
2. **Send Welcome Emails:** Send a welcome email to new users.
3. **Set Custom Claims:** Assign roles or permissions to new users.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onUserCreate = functions.auth.user().onCreate((user) => {
  // Initialize user profile
  const uid = user.uid;
  const email = user.email;
  return admin.firestore().collection('users').doc(uid).set({
    email: email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }).then(() => {
    console.log('User profile created:', uid);
  }).catch((error) => {
    console.error('Error creating user profile:', error);
  });
});
```

### onDelete

#### Introduction
The `onDelete` trigger is invoked when a user account is deleted from Firebase Authentication. This trigger can be used to clean up user data, cancel subscriptions, or notify other services.

#### Use Cases
1. **Clean Up User Data:** Remove user data from Firestore, Realtime Database, or other storage.
2. **Cancel Subscriptions:** Cancel any active subscriptions or services.
3. **Notify Other Services:** Inform external systems about the account deletion.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onUserDelete = functions.auth.user().onDelete((user) => {
  const uid = user.uid;
  return admin.firestore().collection('users').doc(uid).delete().then(() => {
    console.log('User profile deleted:', uid);
  }).catch((error) => {
    console.error('Error deleting user profile:', error);
  });
});
```

### beforeCreate

#### Introduction
The `beforeCreate` trigger is a blocking function that is invoked before a new user is created. It allows you to perform checks and modifications on the user's data before the account is created.

#### Use Cases
1. **Custom Validation:** Enforce specific validation rules before creating a user account.
2. **Modify User Data:** Adjust user data before it is written to Firebase Authentication.
3. **Block User Creation:** Prevent user creation based on custom criteria.

#### Example Implementation
```javascript
const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
admin.initializeApp();

exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {
  if (!user.email.endsWith('@example.com')) {
    throw new functions.auth.HttpsError('invalid-argument', 'Email domain not allowed.');
  }
  return { ...user, customClaims: { role: 'user' } };
});
```

### beforeSignIn

#### Introduction
The `beforeSignIn` trigger is a blocking function that is invoked before a user signs in. It allows you to perform checks and modifications on the user's data before the sign-in process is completed.

#### Use Cases
1. **Additional Security Checks:** Enforce security policies before allowing sign-in.
2. **Modify User Claims:** Adjust user claims or tokens before sign-in.
3. **Block Sign-In:** Prevent sign-in for users who do not meet certain criteria.

#### Example Implementation
```javascript
const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
admin.initializeApp();

exports.beforeSignIn = functions.auth.user().beforeSignIn((user, context) => {
  if (user.emailVerified === false) {
    throw new functions.auth.HttpsError('unauthenticated', 'Email not verified.');
  }
  return { ...user, lastLogin: new Date().toISOString() };
});
```

## Summary
Authentication triggers in Firebase are powerful tools for managing and securing the user authentication process. By using these triggers, you can enforce custom validation rules, modify user data, and implement additional security checks to ensure that only valid and authorized users can create accounts and sign in to your application.
