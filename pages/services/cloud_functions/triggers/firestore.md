# Firestore Triggers

## Overview
Firestore triggers allow you to execute Cloud Functions in response to changes in Firestore documents. These triggers can be used to automate workflows, enforce business rules, and integrate with other services.

## Firestore Triggers

### onCreate

#### Introduction
The `onCreate` trigger is invoked when a new document is created in Firestore. This trigger can be used to initialize related data, send notifications, or enforce business rules.

#### Use Cases
1. **Initialize Related Data:** Set up related data in other collections when a new document is created.
2. **Send Notifications:** Notify users or external systems when a new document is created.
3. **Enforce Business Rules:** Apply business logic when new data is added.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDocumentCreate = functions.firestore.document('collection/{docId}').onCreate((snap, context) => {
  const newValue = snap.data();
  const docId = context.params.docId;
  // Perform some action with the new data
  console.log('New document created:', docId, newValue);
  return admin.firestore().collection('anotherCollection').add({
    relatedId: docId,
    relatedData: newValue.someField,
  }).then(() => {
    console.log('Related data initialized for:', docId);
  }).catch((error) => {
    console.error('Error initializing related data:', error);
  });
});
```

### onUpdate

#### Introduction
The `onUpdate` trigger is invoked when an existing document is updated in Firestore. This trigger can be used to validate changes, update related data, or notify users.

#### Use Cases
1. **Validate Changes:** Ensure that updates meet business rules or data integrity requirements.
2. **Update Related Data:** Synchronize changes to related documents or collections.
3. **Notify Users:** Inform users or systems about updates.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDocumentUpdate = functions.firestore.document('collection/{docId}').onUpdate((change, context) => {
  const newValue = change.after.data();
  const previousValue = change.before.data();
  const docId = context.params.docId;
  // Perform some action with the updated data
  console.log('Document updated:', docId, newValue);
  return admin.firestore().collection('anotherCollection').doc(docId).update({
    relatedData: newValue.someField,
  }).then(() => {
    console.log('Related data updated for:', docId);
  }).catch((error) => {
    console.error('Error updating related data:', error);
  });
});
```

### onDelete

#### Introduction
The `onDelete` trigger is invoked when a document is deleted from Firestore. This trigger can be used to clean up related data, notify users, or enforce business rules.

#### Use Cases
1. **Clean Up Related Data:** Remove or archive related data in other collections.
2. **Notify Users:** Inform users or systems about the deletion.
3. **Enforce Business Rules:** Apply business logic when data is removed.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDocumentDelete = functions.firestore.document('collection/{docId}').onDelete((snap, context) => {
  const deletedValue = snap.data();
  const docId = context.params.docId;
  // Perform some action with the deleted data
  console.log('Document deleted:', docId, deletedValue);
  return admin.firestore().collection('anotherCollection').doc(docId).delete().then(() => {
    console.log('Related data deleted for:', docId);
  }).catch((error) => {
    console.error('Error deleting related data:', error);
  });
});
```

### onWrite

#### Introduction
The `onWrite` trigger is invoked when a document is created, updated, or deleted in Firestore. This trigger can be used to handle any changes to documents in a collection.

#### Use Cases
1. **Handle Any Change:** Perform actions based on any change (create, update, delete) to documents.
2. **Synchronize Data:** Keep related data in sync with the source document.
3. **Trigger Notifications:** Notify users or systems about any change.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onDocumentWrite = functions.firestore.document('collection/{docId}').onWrite((change, context) => {
  const docId = context.params.docId;
  if (!change.before.exists) {
    // New document Created
    const newValue = change.after.data();
    console.log('New document created:', docId, newValue);
    return admin.firestore().collection('anotherCollection').add({
      relatedId: docId,
      relatedData: newValue.someField,
    }).then(() => {
      console.log('Related data initialized for:', docId);
    }).catch((error) => {
      console.error('Error initializing related data:', error);
    });
  } else if (!change.after.exists) {
    // Document Deleted
    const deletedValue = change.before.data();
    console.log('Document deleted:', docId, deletedValue);
    return admin.firestore().collection('anotherCollection').doc(docId).delete().then(() => {
      console.log('Related data deleted for:', docId);
    }).catch((error) => {
      console.error('Error deleting related data:', error);
    });
  } else {
    // Document Updated
    const newValue = change.after.data();
    const previousValue = change.before.data();
    console.log('Document updated:', docId, newValue);
    return admin.firestore().collection('anotherCollection').doc(docId).update({
      relatedData: newValue.someField,
    }).then(() => {
      console.log('Related data updated for:', docId);
    }).catch((error) => {
      console.error('Error updating related data:', error);
    });
  }
});
```

## Summary
Firestore triggers provide powerful capabilities for automating workflows and maintaining data integrity in your Firebase projects. By using these triggers, you can respond to changes in your Firestore database with custom logic that meets your application’s needs.
