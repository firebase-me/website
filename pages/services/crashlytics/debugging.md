# Debugging with Crashlytics

## Overview
Firebase Crashlytics provides powerful tools for debugging your app by giving you detailed crash reports, logs, and stack traces. This helps you quickly identify and resolve issues that cause crashes.

## Use Cases
- **Identify Crash Causes:** Understand what caused the crash by examining the stack trace and logs.
- **Monitor Crash Trends:** Track crash trends to identify common issues.
- **Improve App Stability:** Resolve crashes quickly to improve the overall stability of your app.

## Setup
Ensure that Firebase Crashlytics is properly set up in your project. Refer to the setup documentation if needed.

## Using Crash Reports

### Viewing Crash Reports

Crash reports are available in the Firebase Console under the Crashlytics section. Each crash report includes the following information:
- **Crash Summary:** An overview of the crash, including the number of affected users and sessions.
- **Stack Trace:** The code path that led to the crash.
- **Logs:** Custom logs and messages recorded before the crash.
- **User Information:** User identifiers and custom keys associated with the crash.

### Analyzing Stack Traces

Stack traces provide a detailed path of the code execution leading to the crash. Use the stack trace to identify the exact line of code that caused the crash.

{{group:code}}

```java [Example Stack Trace (Android)]
Fatal Exception: java.lang.NullPointerException
    at com.example.myapp.MainActivity.onCreate(MainActivity.java:50)
    at android.app.Activity.performCreate(Activity.java:7327)
    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2929)
    ...
```

```swift [Example Stack Trace (iOS)]
Fatal Exception: NSInvalidArgumentException
    0  CoreFoundation          0x1b4fe3797 __exceptionPreprocess
    1  libobjc.A.dylib         0x1b3e3ac17 objc_exception_throw
    2  UIKitCore               0x1e83e725b -[UIViewController loadViewIfRequired]
    3  UIKitCore               0x1e83e7621 -[UIViewController view]
    ...
```

```javascript [Example Stack Trace (Web)]
TypeError: Cannot read property 'foo' of undefined
    at myFunction (app.js:10)
    at HTMLButtonElement.onclick (index.html:15)
    ...
```

{{endgroup}}

## Logging Additional Information

### Adding Custom Logs

Add custom logs to provide more context about the app's state before a crash.

{{group:code}}

```java [MainActivity.java]
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Log custom events
        FirebaseCrashlytics.getInstance().log("MainActivity started");
    }
}
```

```swift [ViewController.swift]
import UIKit
import Firebase

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Log custom events
        Crashlytics.crashlytics().log("ViewController started")
    }
}
```

```javascript [app.js]
// Log custom events
crashlytics.log('App started');
```

{{endgroup}}

### Recording Non-Fatal Exceptions

Record non-fatal exceptions to capture recoverable errors that do not crash the app but may still impact the user experience.

{{group:code}}

```java [MainActivity.java]
try {
    // Simulate a non-fatal exception
    int result = 10 / 0;
} catch (Exception e) {
    // Log non-fatal exception
    FirebaseCrashlytics.getInstance().recordException(e);
}
```

```swift [ViewController.swift]
do {
    try performOperation()
} catch {
    // Log non-fatal exception
    Crashlytics.crashlytics().record(error: error)
}
```

```javascript [app.js]
try {
    // Simulate a non-fatal exception
    throw new Error('Operation failed');
} catch (e) {
    // Log non-fatal exception
    crashlytics.recordError(e);
}
```

{{endgroup}}

## Best Practices

### Review Reports Regularly
Regularly review crash reports in the Firebase Console to identify and address issues promptly.

### Use Custom Logs Wisely
Log significant events that provide useful context for crashes. Avoid excessive logging to prevent clutter.

### Monitor Crash Trends
Track crash trends to identify common issues and prioritize fixes based on user impact.

### Avoid Sensitive Information
Do not log sensitive user information such as passwords, credit card numbers, or any personal data.

## Conclusion
By using Firebase Crashlytics for debugging, you can quickly identify and resolve issues that cause crashes in your app. Follow the best practices to ensure that the information logged is useful and relevant.

By following this guide, you can effectively use Firebase Crashlytics to debug and improve the stability of your app.
