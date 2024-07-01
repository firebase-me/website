# Logging Custom Events and Messages

## Overview
Firebase Crashlytics allows you to log custom events and messages that provide more context for your crashes. This helps you understand the state of your app before a crash occurred.

## Use Cases
- **Track User Actions:** Log user actions that might lead to crashes.
- **Debugging:** Provide additional context for non-fatal errors.
- **Performance Monitoring:** Track performance-related events to correlate with crashes.

## Setup
Ensure that Firebase Crashlytics is properly set up in your project. Refer to the setup documentation if needed.

## Logging Custom Events

### Android

To log custom events and messages in Android, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```java [MainActivity.java]
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Log a custom message
        FirebaseCrashlytics.getInstance().log("MainActivity started");

        // Log user actions
        findViewById(R.id.button).setOnClickListener(v -> {
            FirebaseCrashlytics.getInstance().log("User clicked on the button");
        });

        // Log key-value pairs
        FirebaseCrashlytics.getInstance().setCustomKey("user_id", "12345");
        FirebaseCrashlytics.getInstance().setCustomKey("screen", "MainActivity");
    }
}
```

{{endgroup}}

### iOS

To log custom events and messages in iOS, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```swift [ViewController.swift]
import UIKit
import Firebase

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Log a custom message
        Crashlytics.crashlytics().log("ViewController started")
        
        // Log user actions
        let button = UIButton()
        button.addTarget(self, action: #selector(buttonClicked), for: .touchUpInside)
    }
    
    @objc func buttonClicked() {
        Crashlytics.crashlytics().log("User clicked on the button")
        
        // Log key-value pairs
        Crashlytics.crashlytics().setCustomValue("12345", forKey: "user_id")
        Crashlytics.crashlytics().setCustomValue("ViewController", forKey: "screen")
    }
}
```

{{endgroup}}

### Web

To log custom events and messages in Web, use the following methods provided by the Firebase Crashlytics SDK:

{{group:code}}

```javascript [app.js]
// Log a custom message
crashlytics.log('App started');

// Log user actions
document.getElementById('button').addEventListener('click', function() {
    crashlytics.log('User clicked on the button');
});

// Log key-value pairs
crashlytics.setCustomKey('user_id', '12345');
crashlytics.setCustomKey('screen', 'MainScreen');
```

{{endgroup}}

## Best Practices

### Log Key Events
Log significant events in your app that might help you understand the context before a crash.

### Use Key-Value Pairs
Use custom keys to log additional information about the app state, user, or environment.

### Avoid Sensitive Information
Do not log sensitive user information such as passwords, credit card numbers, or any personal data.

### Limit the Number of Logs
While logging is useful, excessive logging can clutter your crash reports. Log only essential information.

## Conclusion
By logging custom events and messages, you can gain more insights into the context and causes of crashes in your app. Follow the best practices to ensure that the logged information is useful and relevant.

By following this guide, you can effectively log custom events and messages in Firebase Crashlytics to help track and resolve issues.
