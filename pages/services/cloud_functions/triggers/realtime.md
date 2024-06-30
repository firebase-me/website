# Realtime Database Triggers

## Overview
Realtime Database triggers allow you to execute Cloud Functions in response to changes in the Firebase Realtime Database. These triggers can be used to automate workflows, enforce business rules, and integrate with other services.

## Realtime Database Triggers

### onCreate

#### Introduction
The `onCreate` trigger is invoked when new data is created in the Realtime Database. This trigger can be used to initialize related data, send notifications, or enforce business rules.

#### Use Cases
1. **Initialize Related Data:** Set up related data in other nodes when new data is created.
2. **Send Notifications:** Notify users or external systems when new data is added.
3. **Enforce Business Rules:** Apply business logic when new data is added.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDataCreate = functions.database.ref('/path/{id}').onCreate((snap, context) => {
  const newValue = snap.val();
  const id = context.params.id;
  // Perform some action with the new data
  console.log('New data created:', id, newValue);
  return admin.database().ref('/anotherPath/' + id).set({
    relatedData: newValue.someField,
  }).then(() => {
    console.log('Related data initialized for:', id);
  }).catch((error) => {
    console.error('Error initializing related data:', error);
  });
});
```

### onUpdate

#### Introduction
The `onUpdate` trigger is invoked when existing data is updated in the Realtime Database. This trigger can be used to validate changes, update related data, or notify users.

#### Use Cases
1. **Validate Changes:** Ensure that updates meet business rules or data integrity requirements.
2. **Update Related Data:** Synchronize changes to related nodes.
3. **Notify Users:** Inform users or systems about updates.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDataUpdate = functions.database.ref('/path/{id}').onUpdate((change, context) => {
  const newValue = change.after.val();
  const previousValue = change.before.val();
  const id = context.params.id;
  // Perform some action with the updated data
  console.log('Data updated:', id, newValue);
  return admin.database().ref('/anotherPath/' + id).update({
    relatedData: newValue.someField,
  }).then(() => {
    console.log('Related data updated for:', id);
  }).catch((error) => {
    console.error('Error updating related data:', error);
  });
});
```

### onDelete

#### Introduction
The `onDelete` trigger is invoked when data is deleted from the Realtime Database. This trigger can be used to clean up related data, notify users, or enforce business rules.

#### Use Cases
1. **Clean Up Related Data:** Remove or archive related data in other nodes.
2. **Notify Users:** Inform users or systems about the deletion.
3. **Enforce Business Rules:** Apply business logic when data is removed.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDataDelete = functions.database.ref('/path/{id}').onDelete((snap, context) => {
  const deletedValue = snap.val();
  const id = context.params.id;
  // Perform some action with the deleted data
  console.log('Data deleted:', id, deletedValue);
  return admin.database().ref('/anotherPath/' + id).remove().then(() => {
    console.log('Related data deleted for:', id);
  }).catch((error) => {
    console.error('Error deleting related data:', error);
  });
});
```

### onWrite

#### Introduction
The `onWrite` trigger is invoked when data is created, updated, or deleted in the Realtime Database. This trigger can be used to handle any changes to data in a node.

#### Use Cases
1. **Handle Any Change:** Perform actions based on any change (create, update, delete) to data.
2. **Synchronize Data:** Keep related data in sync with the source data.
3. **Trigger Notifications:** Notify users or systems about any change.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDataWrite = functions.database.ref('/path/{id}').onWrite((change, context) => {
  const id = context.params.id;
  if (!change.before.exists()) {
    // New data Created
    const newValue = change.after.val();
    console.log('New data created:', id, newValue);
    return admin.database().ref('/anotherPath/' + id).set({
      relatedData: newValue.someField,
    }).then(() => {
      console.log('Related data initialized for:', id);
    }).catch((error) => {
      console.error('Error initializing related data:', error);
    });
  } else if (!change.after.exists()) {
    // Data Deleted
    const deletedValue = change.before.val();
    console.log('Data deleted:', id, deletedValue);
    return admin.database().ref('/anotherPath/' + id).remove().then(() => {
      console.log('Related data deleted for:', id);
    }).catch((error) => {
      console.error('Error deleting related data:', error);
    });
  } else {
    // Data Updated
    const newValue = change.after.val();
    const previousValue = change.before.val();
    console.log('Data updated:', id, newValue);
    return admin.database().ref('/anotherPath/' + id).update({
      relatedData: newValue.someField,
    }).then(() => {
      console.log('Related data updated for:', id);
    }).catch((error) => {
      console.error('Error updating related data:', error);
    });
  }
});
```

## Summary
Realtime Database triggers provide powerful capabilities for automating workflows and maintaining data integrity in your Firebase projects. By using these triggers, you can respond to changes in your Realtime Database with custom logic that meets your application’s needs.
