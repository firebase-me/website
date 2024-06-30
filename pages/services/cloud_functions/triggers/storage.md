# Cloud Storage Triggers

## Overview
Cloud Storage triggers allow you to execute Cloud Functions in response to changes in Cloud Storage objects. These triggers can be used to process files, generate thumbnails, enforce storage rules, and integrate with other services.

## Cloud Storage Triggers

### onArchive

#### Introduction
The `onArchive` trigger is invoked when an object in Cloud Storage is archived. This trigger can be used to perform actions when files are archived, such as logging or notifying users.

#### Use Cases
1. **Logging:** Keep a log of archived files.
2. **Notify Users:** Inform users or systems when a file is archived.
3. **Custom Processing:** Perform custom actions on archived files.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onFileArchive = functions.storage.object().onArchive((object) => {
  const filePath = object.name;
  console.log('File archived:', filePath);
  // Perform custom actions on the archived file
  return null;
});
```

### onDelete

#### Introduction
The `onDelete` trigger is invoked when an object in Cloud Storage is deleted. This trigger can be used to clean up related data, notify users, or enforce storage rules.

#### Use Cases
1. **Clean Up Related Data:** Remove or archive related data when a file is deleted.
2. **Notify Users:** Inform users or systems when a file is deleted.
3. **Enforce Storage Rules:** Apply business logic when files are deleted.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onFileDelete = functions.storage.object().onDelete((object) => {
  const filePath = object.name;
  console.log('File deleted:', filePath);
  // Perform custom actions on the deleted file
  return null;
});
```

### onFinalize

#### Introduction
The `onFinalize` trigger is invoked when an object in Cloud Storage is created or updated. This trigger can be used to process new or updated files, generate thumbnails, or analyze content.

#### Use Cases
1. **Process New Files:** Perform actions on new files, such as resizing images or transcoding videos.
2. **Generate Thumbnails:** Create thumbnails for image files.
3. **Analyze Content:** Analyze or scan the content of new files.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sharp = require('sharp'); // Example library for image processing
admin.initializeApp();

exports.onFileFinalize = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  if (object.contentType.startsWith('image/')) {
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const tempFilePath = `/tmp/${filePath}`;
    await file.download({destination: tempFilePath});
    await sharp(tempFilePath)
      .resize({width: 200})
      .toFile(tempFilePath + '_thumb');
    await bucket.upload(tempFilePath + '_thumb', {
      destination: filePath + '_thumb',
    });
    console.log('Thumbnail generated for:', filePath);
  }
  return null;
});
```

### onMetadataUpdate

#### Introduction
The `onMetadataUpdate` trigger is invoked when the metadata of an object in Cloud Storage is updated. This trigger can be used to track changes to file metadata or enforce metadata rules.

#### Use Cases
1. **Track Metadata Changes:** Log changes to file metadata.
2. **Enforce Metadata Rules:** Apply business logic based on metadata changes.
3. **Notify Users:** Inform users or systems about metadata updates.

#### Example Implementation
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onMetadataUpdate = functions.storage.object().onMetadataUpdate((object) => {
  const filePath = object.name;
  const metadata = object.metadata;
  console.log('Metadata updated for:', filePath, metadata);
  // Perform custom actions on the metadata update
  return null;
});
```

## Summary
Cloud Storage triggers provide powerful capabilities for automating workflows and processing files in your Firebase projects. By using these triggers, you can respond to changes in your Cloud Storage buckets with custom logic that meets your application’s needs.
