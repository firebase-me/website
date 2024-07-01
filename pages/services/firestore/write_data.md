# Firestore Writes

## Introduction
Writing data to Firestore involves creating, updating, and deleting documents. Firestore provides several methods to perform these operations efficiently and securely.

## Creating Data

### Adding a Document
You can add a document to a collection with a generated ID.

{{group:code}}

```javascript
// Initialize Firestore
const db = firebase.firestore();

// Add a new document with a generated ID
db.collection('users').add({
    firstName: 'John',
    lastName: 'Doe',
    age: 30
}).then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
}).catch((error) => {
    console.error('Error adding document: ', error);
});
```

{{endgroup}}

### Setting a Document
You can set a document with a specific ID.

{{group:code}}

```javascript
// Set a document with a specific ID
db.collection('users').doc('uniqueUserID').set({
    firstName: 'Jane',
    lastName: 'Smith',
    age: 25
}).then(() => {
    console.log('Document successfully written!');
}).catch((error) => {
    console.error('Error writing document: ', error);
});
```

{{endgroup}}

## Updating Data

### Updating a Document
You can update specific fields in a document.

{{group:code}}

```javascript
// Update a document
db.collection('users').doc('uniqueUserID').update({
    age: 26
}).then(() => {
    console.log('Document successfully updated!');
}).catch((error) => {
    console.error('Error updating document: ', error);
});
```

{{endgroup}}

### Merging Data
You can merge new data with existing data in a document.

{{group:code}}

```javascript
// Merge new data with existing data
db.collection('users').doc('uniqueUserID').set({
    middleName: 'Michael'
}, { merge: true }).then(() => {
    console.log('Document successfully merged!');
}).catch((error) => {
    console.error('Error merging document: ', error);
});
```

{{endgroup}}

## Deleting Data

### Deleting a Document
You can delete a specific document from a collection.

{{group:code}}

```javascript
// Delete a document
db.collection('users').doc('uniqueUserID').delete().then(() => {
    console.log('Document successfully deleted!');
}).catch((error) => {
    console.error('Error deleting document: ', error);
});
```

{{endgroup}}

### Bulk Deleting Documents
You can delete multiple documents using batch operations.

{{group:code}}

```javascript
// Bulk delete documents
const batch = db.batch();
const collectionRef = db.collection('users');

collectionRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    return batch.commit();
}).then(() => {
    console.log('Batch delete completed!');
}).catch((error) => {
    console.error('Error with batch delete: ', error);
});
```

{{endgroup}}

### Deleting Collections and Subcollections
Firestore does not support deleting collections directly. You need to delete each document within the collection.

{{group:code}}

```javascript
// Recursive function to delete a collection
function deleteCollection(collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

function deleteQueryBatch(query, resolve) {
    query.get().then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
            return 0;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
            return snapshot.size;
        });
    }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse to delete next batch
        process.nextTick(() => {
            deleteQueryBatch(query, resolve);
        });
    }).catch((error) => {
        console.error('Error deleting collection: ', error);
    });
}

// Call the function to delete a collection
deleteCollection('users', 10).then(() => {
    console.log('Collection successfully deleted!');
}).catch((error) => {
    console.error('Error deleting collection: ', error);
});
```

{{endgroup}}

## Conclusion
Firestore provides robust capabilities for writing data, including adding, setting, updating, and deleting documents. By using these methods effectively, you can manage your Firestore database efficiently and ensure data integrity.

