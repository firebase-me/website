# Crashlytics Setup

## Overview
This document provides detailed steps to set up Firebase Crashlytics for different platforms, including Android, iOS, and Web. It also covers common setup issues and how to troubleshoot them.

## Android Setup

### Step 1: Add Firebase to Your Android Project
Follow the [Firebase documentation](https://firebase.google.com/docs/android/setup) to add Firebase to your Android project.

### Step 2: Add the Crashlytics SDK
Add the Firebase Crashlytics SDK to your app.

{{group:code}}

```gradle [build.gradle (Project)]
buildscript {
    dependencies {
        // Add the Crashlytics Gradle plugin
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.7.1'
    }
}
```

```gradle [build.gradle (App)]
plugins {
    // Apply the Crashlytics plugin
    id 'com.google.firebase.crashlytics'
}

dependencies {
    // Add the Crashlytics SDK
    implementation 'com.google.firebase:firebase-crashlytics:18.2.6'
}
```

{{endgroup}}

### Step 3: Initialize Crashlytics
Initialize Crashlytics in your app.

{{group:code}}

```java [MyApplication.java]
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

{{endgroup}}

## iOS Setup

### Step 1: Add Firebase to Your iOS Project
Follow the [Firebase documentation](https://firebase.google.com/docs/ios/setup) to add Firebase to your iOS project.

### Step 2: Add the Crashlytics SDK
Add the Firebase Crashlytics SDK to your app.

{{group:code}}

```ruby [Podfile]
pod 'Firebase/Crashlytics'
```

{{endgroup}}

### Step 3: Initialize Crashlytics
Initialize Crashlytics in your app.

{{group:code}}

```swift [AppDelegate.swift]
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

## Web Setup

### Step 1: Add Firebase to Your Web Project
Follow the [Firebase documentation](https://firebase.google.com/docs/web/setup) to add Firebase to your web project.

### Step 2: Add the Crashlytics SDK
Add the Firebase Crashlytics SDK to your app.

{{group:code}}

```html [index.html]
<!-- Add the Firebase products that you want to use -->
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-crashlytics.js"></script>
```

```javascript [app.js]
// Initialize Firebase
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Initialize Crashlytics
var crashlytics = firebase.crashlytics();
crashlytics.log('Crashlytics initialized.');
```

{{endgroup}}

## Troubleshooting Common Setup Issues

### Issue 1: Crashlytics Data Not Appearing in Console
- Ensure that Crashlytics is correctly initialized.
- Check for any network issues that might prevent data from being sent.

### Issue 2: Build Failures
- Ensure that all dependencies are correctly added in the `build.gradle`, `Podfile`, or `index.html`.
- Sync the project with Gradle files or run `pod install` again.

### Issue 3: Missing Permissions
- Ensure that your app has the necessary permissions to send crash reports. For Android, ensure `INTERNET` permission is added in the `AndroidManifest.xml`.

## Conclusion
Setting up Firebase Crashlytics involves integrating the SDK and initializing it in your app. Following the steps above will help you get started with Crashlytics and troubleshoot common setup issues.

By following this guide, you can effectively integrate Firebase Crashlytics into your app to track and resolve stability issues.
