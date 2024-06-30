# Before Create Blocking Function

## Introduction
The Before Create Blocking Function in Firebase allows you to intercept and modify the user creation process before it is completed. This function is useful for enforcing custom validation rules, modifying user data before creation, and blocking user creation based on custom criteria.

## Use Cases
1. **Custom Validation:** Enforce specific validation rules for user data during the creation process.
2. **Modify User Data:** Adjust user data before it is written to Firebase Authentication.
3. **Block User Creation:** Prevent user creation based on criteria such as email domain restrictions or other custom rules.

## Example Implementation
Here is an example of a Before Create Blocking Function that checks if the user's email domain is allowed and blocks creation if it is not:

```javascript
const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
admin.initializeApp();

exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {
  // Perform validation or modifications
  if (!user.email.endsWith('@example.com')) {
    throw new functions.auth.HttpsError(
      'invalid-argument', 'Email domain not allowed.'
    );
  }
  // Return modified user data if needed
  return { ...user, customClaims: { role: 'user' } };
});
```

## Event Structure
The Before Create event structure provides detailed information about the user creation attempt. Here is an example of the event structure and the data it contains, represented as a TypeScript interface:

```typescript
/// Blocking Function BeforeCreate event:
interface BeforeCreateEvent {
  locale: string;
  ipAddress: string;
  userAgent: string;
  eventId: string;
  eventType: string;
  authType: string;
  resource: {
    service: string;
    name: string;
  };
  timestamp: string;
  additionalUserInfo: {
    providerId: string;
    profile: any | null;
    username: string | null;
    isNewUser: boolean;
    recaptchaScore: number | null;
  };
  credential: any | null;
  params: Record<string, any>;
  data: {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    disabled: boolean;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
    providerData: any[];
    passwordHash: string | null;
    passwordSalt: string | null;
    customClaims: Record<string, any> | null;
    tenantId: string | null;
    tokensValidAfterTime: string | null;
    multiFactor: any | null;
  };
}
```

## Caveats
- **Null Properties:** Certain properties may be `null` if not available or applicable, such as `profile`, `username`, `recaptchaScore`, `displayName`, `photoURL`, `phoneNumber`, `passwordHash`, `passwordSalt`, `customClaims`, `tenantId`, `tokensValidAfterTime`, and `multiFactor`.
- **Provider Data:** This is an array containing provider-specific information, represented as `[Object]` for brevity but can contain multiple entries depending on the user's linked providers.

This detailed guide should help you understand how to implement and use the Before Create Blocking Function in your Firebase project. For more details on specific use cases and implementation examples, refer to the respective detailed guide.
