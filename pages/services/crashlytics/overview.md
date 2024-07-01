# Crashlytics

## Overview
Firebase Crashlytics is a lightweight, real-time crash reporter that helps you track, prioritize, and fix stability issues that erode app quality. It provides actionable insights into app crashes and errors.

## Use Cases
- **Track Crashes:** Identify and track app crashes in real-time.
- **Prioritize Issues:** Understand the impact of crashes and prioritize fixes based on user impact.
- **Debugging:** Get detailed crash reports and logs to help debug and fix issues quickly.

## Setup
1. **Add Firebase to Your App:**
   Follow the Firebase documentation to add Firebase to your Android, iOS, or web app.

2. **Add the Crashlytics SDK:**
   Add the Firebase Crashlytics SDK to your app.

   {{group:code}}

   ```gradle [Android]
   dependencies {
       // Add the Crashlytics SDK
       implementation 'com.google.firebase:firebase-crashlytics:18.2.6'
   }
   ```

   ```ruby [iOS]
   pod 'Firebase/Crashlytics'
   ```

   {{endgroup}}

3. **Initialize Crashlytics:**
   Initialize Crashlytics in your app.

   {{group:code}}

   ```java [Android]
   import com.google.firebase.crashlytics.FirebaseCrashlytics;

   public class MyApplication extends Application {
       @Override
       public void onCreate() {
           super.onCreate();
           // Initialize Crashlytics
           FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true);
       }
   }
   ```

   ```swift [iOS]
   import Firebase

   @UIApplicationMain
   class AppDelegate: UIResponder, UIApplicationDelegate {
       func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           // Use Firebase library to configure APIs
           FirebaseApp.configure()
           return true
       }
   }
   ```

   {{endgroup}}

## Example
To log a custom error message or catch and log non-fatal exceptions, use the following code:

{{group:code}}

```java [Android]
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Log a custom message
        FirebaseCrashlytics.getInstance().log("MainActivity started");

        // Catch and log a non-fatal exception
        try {
            int result = 10 / 0;
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
        }
    }
}
```

```swift [iOS]
import UIKit
import Firebase

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Log a custom message
        Crashlytics.crashlytics().log("ViewController started")
        
        // Catch and log a non-fatal exception
        do {
            let result = try dangerousOperation()
        } catch {
            Crashlytics.crashlytics().record(error: error)
        }
    }
    
    func dangerousOperation() throws {
        // Example operation that might throw an error
    }
}
```

{{endgroup}}

## Best Practices
- **Enable Crashlytics Collection:** Ensure Crashlytics collection is enabled in the production environment.
- **Log Key Events:** Log significant events and key data to help diagnose issues.
- **Monitor Performance:** Use performance monitoring tools alongside Crashlytics to get a comprehensive view of your app's health.

## Caveats
- **User Privacy:** Ensure that you are compliant with privacy laws and regulations when collecting crash data.
- **Initialization:** Ensure Crashlytics is initialized early in the app startup process to capture all crashes.

By following this guide, you can effectively integrate Firebase Crashlytics into your app to track and resolve stability issues.
