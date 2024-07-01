# Writing Data to Firebase Realtime Database

## Introduction
Writing data to the Firebase Realtime Database involves creating, updating, and deleting data. This document covers how to write to a list, create new nodes, and create segregated channels.

## Writing to a List

{{group:code}}
```java
// Android
DatabaseReference database = FirebaseDatabase.getInstance().getReference();
DatabaseReference newUserRef = database.child("users").push();
newUserRef.setValue(new User("John", "Doe", 30)).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(@NonNull Task<Void> task) {
        if (task.isSuccessful()) {
            System.out.println("User added successfully");
        } else {
            System.out.println("Error adding user");
        }
    }
});
```

```swift
// iOS
let ref = Database.database().reference()
let newUserRef = ref.child("users").childByAutoId()
newUserRef.setValue(["firstName": "John", "lastName": "Doe", "age": 30]) { (error, ref) in
    if let error = error {
        print("Error adding user: \(error.localizedDescription)")
    } else {
        print("User added successfully")
    }
}
```

```javascript
// Web
var dbRef = firebase.database().ref();
var newUserRef = dbRef.child("users").push();
newUserRef.set({
    firstName: "John",
    lastName: "Doe",
    age: 30
}).then(() => {
    console.log("User added successfully");
}).catch((error) => {
    console.error("Error adding user: ", error);
});
```
{{endgroup}}

## Creating New Nodes

{{group:code}}
```java
// Android
DatabaseReference database = FirebaseDatabase.getInstance().getReference();
database.child("users").child("user1").setValue(new User("John", "Doe", 30)).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(@NonNull Task<Void> task) {
        if (task.isSuccessful()) {
            System.out.println("User added successfully");
        } else {
            System.out.println("Error adding user");
        }
    }
});
```

```swift
// iOS
let ref = Database.database().reference()
ref.child("users/user1").setValue(["firstName": "John", "lastName": "Doe", "age": 30]) { (error, ref) in
    if let error = error {
        print("Error adding user: \(error.localizedDescription)")
    } else {
        print("User added successfully")
    }
}
```

```javascript
// Web
var dbRef = firebase.database().ref();
dbRef.child("users/user1").set({
    firstName: "John",
    lastName: "Doe",
    age: 30
}).then(() => {
    console.log("User added successfully");
}).catch((error) => {
    console.error("Error adding user: ", error);
});
```
{{endgroup}}

## Creating Segregated Channels

{{group:code}}
```java
// Android
DatabaseReference database = FirebaseDatabase.getInstance().getReference();
database.child("channels").child("channel1").child("messages").push().setValue(new Message("Hello World")).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(@NonNull Task<Void> task) {
        if (task.isSuccessful()) {
            System.out.println("Message added successfully");
        } else {
            System.out.println("Error adding message");
        }
    }
});
```

```swift
// iOS
let ref = Database.database().reference()
let messageRef = ref.child("channels/channel1/messages").childByAutoId()
messageRef.setValue(["text": "Hello World"]) { (error, ref) in
    if let error = error {
        print("Error adding message: \(error.localizedDescription)")
    } else {
        print("Message added successfully")
    }
}
```

```javascript
// Web
var dbRef = firebase.database().ref();
var messageRef = dbRef.child("channels/channel1/messages").push();
messageRef.set({
    text: "Hello World"
}).then(() => {
    console.log("Message added successfully");
}).catch((error) => {
    console.error("Error adding message: ", error);
});
```
{{endgroup}}

## Conclusion
Writing data to the Firebase Realtime Database involves creating, updating, and deleting data. By using these methods effectively, you can manage your Realtime Database efficiently and ensure data integrity.

