// Blocking Function BeforeSignIn event: 
const event = {
    locale: 'language_code',
    ipAddress: '********',
    userAgent: 'FirebaseAuth.iOS/10.27.0 com.danielinvision.contractor/1.0.0 MacOSX/14.5.0,gzip(gfe),gzip(gfe)',
    eventId: 'ZuO9nXR4PUvJ4bIAQHwtUA',
    eventType: 'providers/cloud.auth/eventTypes/user.beforeSignIn:password',
    authType: 'USER',
    resource: {
        service: 'identitytoolkit.googleapis.com',
        name: 'projects/project_id'
    },
    timestamp: 'timestamp',
    additionalUserInfo: {
        providerId: 'password',
        profile: undefined,
        username: undefined,
        isNewUser: false,
        recaptchaScore: undefined
    },
    credential: null,
    params: {},
    data: {
        uid: 'user_uid',
        email: 'example@domain.com',
        emailVerified: true,
        displayName: undefined,
        photoURL: undefined,
        phoneNumber: undefined,
        disabled: false,
        metadata: {
            creationTime: 'timestamp',
            lastSignInTime: 'timestamp'
        },
        providerData: [[Object]],
        passwordHash: undefined,
        passwordSalt: undefined,
        customClaims: undefined,
        tenantId: undefined,
        tokensValidAfterTime: null,
        multiFactor: null
        // truncated, potentially missing 
    }
}
