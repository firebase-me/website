# User Identification

## Overview
Firebase Crashlytics allows you to identify individual users in your crash reports. This helps you to understand the context of crashes and provides a way to link issues to specific users, which can be crucial for debugging and support.

## Use Cases
- **Debugging:** Identify the specific user affected by a crash to gather more context.
- **Support:** Assist users more effectively by linking crash reports to user support tickets.
- **User Experience Monitoring:** Track issues that may affect specific users or user segments.

## Setup
Ensure that Firebase Crashlytics is properly set up in your project. Refer to the setup documentation if needed.

## Setting User Identifiers

### Android

To set user identifiers in Android, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```java [MainActivity.java]
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set user identifier
        FirebaseCrashlytics.getInstance().setUserId("12345");

        // Set user attributes
        FirebaseCrashlytics.getInstance().setCustomKey("user_email", "user@example.com");
        FirebaseCrashlytics.getInstance().setCustomKey("user_role", "admin");
    }
}
```

{{endgroup}}

### iOS

To set user identifiers in iOS, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```swift [ViewController.swift]
import UIKit
import Firebase

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set user identifier
        Crashlytics.crashlytics().setUserID("12345")
        
        // Set user attributes
        Crashlytics.crashlytics().setCustomValue("user@example.com", forKey: "user_email")
        Crashlytics.crashlytics().setCustomValue("admin", forKey: "user_role")
    }
}
```

{{endgroup}}

### Web

To set user identifiers in Web, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```javascript [app.js]
// Set user identifier
crashlytics.setUserId('12345');

// Set user attributes
crashlytics.setCustomKey('user_email', 'user@example.com');
crashlytics.setCustomKey('user_role', 'admin');
```

{{endgroup}}

## Best Practices

### Use Unique Identifiers
Use unique identifiers for each user to accurately track and identify them in crash reports.

### Add Custom Metadata
Add additional user attributes such as email, role, or other relevant information to provide more context for the crash reports.

### Avoid Sensitive Information
Do not log sensitive user information such as passwords, credit card numbers, or any personal data.

### Update Identifiers on Login
Update the user identifier and attributes whenever the user logs in or when their profile changes.

## Conclusion
By setting user identifiers, you can link crash reports to specific users, which helps in debugging and providing support. Follow the best practices to ensure that the user identification information is useful and relevant.

By following this guide, you can effectively set user identifiers in Firebase Crashlytics to help track and resolve issues.
