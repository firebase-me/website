# Logging Non-Fatal Exceptions

## Overview
Firebase Crashlytics allows you to log non-fatal exceptions to track errors that don't necessarily crash your app but may affect the user experience. This helps you to understand and address issues that can degrade your app's quality.

## Use Cases
- **Track Recoverable Errors:** Log errors that your app can recover from but may indicate underlying issues.
- **Debugging:** Provide additional context for errors that occur without causing a crash.
- **User Experience Monitoring:** Track issues that may affect the user experience, such as network errors or API failures.

## Setup
Ensure that Firebase Crashlytics is properly set up in your project. Refer to the setup documentation if needed.

## Logging Non-Fatal Exceptions

### Android

To log non-fatal exceptions in Android, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```java [MainActivity.java]
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            // Simulate a non-fatal exception
            int result = 10 / 0;
        } catch (Exception e) {
            // Log non-fatal exception
            FirebaseCrashlytics.getInstance().recordException(e);
        }

        // Another example of logging a custom non-fatal exception
        try {
            performOperation();
        } catch (CustomException e) {
            FirebaseCrashlytics.getInstance().recordException(e);
        }
    }

    private void performOperation() throws CustomException {
        // Simulate a custom exception
        throw new CustomException("Operation failed");
    }

    private static class CustomException extends Exception {
        CustomException(String message) {
            super(message);
        }
    }
}
```

{{endgroup}}

### iOS

To log non-fatal exceptions in iOS, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```swift [ViewController.swift]
import UIKit
import Firebase

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Simulate a non-fatal exception
        do {
            try performOperation()
        } catch {
            // Log non-fatal exception
            Crashlytics.crashlytics().record(error: error)
        }
    }
    
    func performOperation() throws {
        // Simulate an error
        throw NSError(domain: "com.example.app", code: 1, userInfo: [NSLocalizedDescriptionKey: "Operation failed"])
    }
}
```

{{endgroup}}

### Web

To log non-fatal exceptions in Web, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```javascript [app.js]
try {
    // Simulate a non-fatal exception
    throw new Error('Operation failed');
} catch (e) {
    // Log non-fatal exception
    crashlytics.recordError(e);
}

// Another example of logging a custom non-fatal exception
try {
    performOperation();
} catch (e) {
    crashlytics.recordError(e);
}

function performOperation() {
    // Simulate a custom error
    throw new Error('Custom operation failed');
}
```

{{endgroup}}

## Best Practices

### Log Meaningful Exceptions
Ensure that you log exceptions that provide useful context about the error. Avoid logging trivial or expected exceptions.

### Add Custom Metadata
Use custom keys to add additional information about the non-fatal exception, such as the user's state or the app's configuration at the time of the error.

### Avoid Sensitive Information
Do not log sensitive user information such as passwords, credit card numbers, or any personal data.

### Monitor Non-Fatal Trends
Regularly review non-fatal exceptions to identify trends and address underlying issues that may degrade the user experience.

## Conclusion
By logging non-fatal exceptions, you can gain more insights into issues that affect your app without causing crashes. Follow the best practices to ensure that the logged information is useful and relevant.

By following this guide, you can effectively log non-fatal exceptions in Firebase Crashlytics to help track and resolve issues.
