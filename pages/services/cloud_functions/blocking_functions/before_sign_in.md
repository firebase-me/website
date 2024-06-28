
### Before Sign-In Blocking Function

#### Introduction
The Before Sign-In Blocking Function in Firebase is a powerful tool that allows you to intercept and modify the sign-in process before it is completed. This function is particularly useful for enforcing additional security checks, modifying user claims or tokens, and blocking sign-ins based on custom criteria.

#### Use Cases
1. **Additional Security Checks:** Enforce security policies such as verifying email domains or user statuses before allowing sign-in.
2. **Modify User Claims:** Adjust user claims or tokens to manage access control dynamically.
3. **Block Sign-In:** Prevent sign-in for users who do not meet certain criteria, such as those from restricted domains or those with unverified email addresses.

#### Example Implementation
Here is an example of a Before Sign-In Blocking Function that checks if the user's email is verified and blocks sign-in if it is not:

```javascript
const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
admin.initializeApp();

exports.beforeSignIn = functions.auth.user().beforeSignIn((user, context) => {
  // Perform security checks or modifications
  if (user.emailVerified === false) {
    throw new functions.auth.HttpsError(
      'unauthenticated', 'Email not verified.'
    );
  }
  // Return modified user data if needed
  return { ...user, lastLogin: new Date().toISOString() };
});
```

#### Event Structure
The Before Sign-In event structure provides detailed information about the sign-in attempt. Here is an example of the event structure and the data it contains, represented as a TypeScript interface:

```typescript
/// Blocking Function BeforeSignIn event:
interface BeforeSignInEvent {
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

#### Caveats
- **Null Properties:** Certain properties may be `null` if not available or applicable, such as `profile`, `username`, `recaptchaScore`, `displayName`, `photoURL`, `phoneNumber`, `passwordHash`, `passwordSalt`, `customClaims`, `tenantId`, `tokensValidAfterTime`, and `multiFactor`.
- **Provider Data:** This is an array containing provider-specific information, represented as `[Object]` for brevity but can contain multiple entries depending on the user's linked providers.

This detailed guide should help you understand how to implement and use the Before Sign-In Blocking Function in your Firebase project. For more details on specific use cases and implementation examples, refer to the respective detailed guide.
