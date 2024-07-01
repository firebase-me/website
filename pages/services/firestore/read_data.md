# Firestore Reads

## Introduction
Reading data from Firestore involves querying collections and documents. Firestore provides powerful querying capabilities, including real-time listeners, collection groups, and complex queries.

## Querying Collections

### Basic Queries
You can query a collection to retrieve documents that match specific criteria.

{{group:code}}

```javascript
// Initialize Firestore
const db = firebase.firestore();

// Basic query to get all documents in a collection
db.collection('users').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

### Filtering Data
You can filter documents based on specific field values.

{{group:code}}

```javascript
// Query to get users with age greater than 25
db.collection('users').where('age', '>', 25).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

### Sorting Data
You can sort the results of a query based on specific fields.

{{group:code}}

```javascript
// Query to get users sorted by age in descending order
db.collection('users').orderBy('age', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

### Pagination
Firestore supports pagination to retrieve large datasets in manageable chunks.

{{group:code}}

```javascript
// Query to get the first 10 users
db.collection('users').limit(10).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

## Real-Time Updates
You can set up real-time listeners to receive updates to data as it changes.

{{group:code}}

```javascript
// Real-time listener for a collection
db.collection('users').onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

## Collection Group Queries
Firestore allows you to perform collection group queries to retrieve documents from all collections with the same name.

{{group:code}}

```javascript
// Collection group query to get all posts from all subcollections named 'posts'
db.collectionGroup('posts').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

{{endgroup}}

## Deep Dive into Queries

### Combining Queries
You can combine multiple query clauses to create complex queries.

{{group:code}}

```javascript
// Query to get users with age greater than 25, sorted by name
db.collection('users')
  .where('age', '>', 25)
  .orderBy('name')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });
```

{{endgroup}}

### Limitations
- **Indexing:** Firestore requires indexes for certain queries. Ensure your queries are properly indexed.
- **Query Limits:** Firestore has limits on query complexity and the number of results returned.

## Conclusion
Firestore provides powerful querying capabilities for reading data. By using filters, sorting, pagination, real-time listeners, and collection group queries, you can efficiently retrieve and manage your data.

