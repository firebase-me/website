
# Comprehensive Markdown Guide

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## Emphasis

**Bold Text**

*Italic Text*

***Bold and Italic Text***

~~Strikethrough~~

## Lists

### Unordered List
- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Subitem 3.1
   2. Subitem 3.2

### Task List
- [x] Completed task
- [ ] Incomplete task

## Links

[Inline Link](https://firebase.google.com)

[Reference Link][1]

[1]: https://firebase.google.com

## Images

![Alt Text](https://firebase.me/assets/images/icon.png)

![Reference Image][2]

[2]: /assets/images/logo.png

## Blockquotes

> This is a blockquote.
>
> Multiple lines are supported.

## Code

### Inline Code
`inline code`

### Code Block
```javascript
function sayHello() {
  console.log("Hello, World!");
}
```

### Fenced Code Block with Syntax Highlighting
```python
def say_hello():
    print("Hello, World!")
```

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |

## Horizontal Rule

---

## Inline HTML

<div style="color: red;">This is a red text using inline HTML.</div>

## Escaping Characters

*This text is not italic*
\*This text is not italic\*

## Footnotes

Here is a simple footnote[^1].

[^1]: This is the footnote.

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2

## Mathematical Expressions

Inline: \(E = mc^2\)

Block:
\$\$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
\$\$

## Emoji

:tada: :+1: :smile:

## Abbreviations

Markdown converts text to HTML.

*[HTML]: HyperText Markup Language

## Custom Containers

::: note
This is a note.
:::

::: warning
This is a warning.
:::

## Collapsible Sections

<details>
  <summary>Click to expand</summary>
  
  This is a collapsible section.
</details>

## Videos

![Video](https://battle-hardened-cache.b-cdn.net/media/battle-studio.mp4)

## Custom IDs for Headers

### Header with Custom ID {#custom-id}

You can link to [this header](#custom-id).

## Anchor Links

[Link to top](#comprehensive-markdown-guide)


## Custom Markdown++

to make sure certain aspects are available to us without breaking existing markdown, we provide grouped behaviours

### BreadCrumb
{\{crumb:Name of Crumb}}
{{crumb:Name of Crumb}}

### grouped code blocks
{{group:code}}
```js
const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getDatabase } = require('firebase-admin/database');
const { getStorage } = require('firebase-admin/storage');
const { getMessaging } = require('firebase-admin/messaging');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = getFirestore();
const rtdb = getDatabase();
const storage = getStorage();
const messaging = getMessaging();

exports.complexFunction = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, actionType, payload } = req.body;

    // Input validation
    if (!userId || !actionType || !payload) {
      res.status(400).send('Missing required fields');
      return;
    }

    // Firestore operation
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).send('User not found');
      return;
    }
    const userData = userDoc.data();

    // Realtime Database operation
    const userRTDBRef = rtdb.ref(`users/${userId}`);
    const userRTDBData = (await userRTDBRef.get()).val();

    // Cloud Storage operation
    const filePath = `user_data/${userId}/profile_picture.jpg`;
    const file = storage.bucket().file(filePath);
    const [exists] = await file.exists();
    let downloadURL = null;
    if (exists) {
      downloadURL = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025'
      });
    }

    // Handle different action types
    switch (actionType) {
      case 'UPDATE_PROFILE':
        await handleProfileUpdate(userId, payload);
        break;
      case 'SEND_NOTIFICATION':
        await sendNotification(userData, payload);
        break;
      case 'PROCESS_ORDER':
        await processOrder(userId, payload);
        break;
      default:
        res.status(400).send('Invalid action type');
        return;
    }

    // Send response
    res.status(200).send({
      message: 'Action processed successfully',
      userData,
      userRTDBData,
      downloadURL
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});

async function handleProfileUpdate(userId, payload) {
  try {
    await db.collection('users').doc(userId).update(payload);
    console.log('Profile updated successfully for user:', userId);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new functions.https.HttpsError('internal', 'Error updating profile');
  }
}

async function sendNotification(userData, payload) {
  try {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body
      },
      token: userData.fcmToken
    };
    await messaging.send(message);
    console.log('Notification sent successfully to user:', userData.userId);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', 'Error sending notification');
  }
}

async function processOrder(userId, payload) {
  try {
    const orderId = uuidv4();
    await db.collection('orders').doc(orderId).set({
      userId,
      ...payload,
      status: 'Processing',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Order processed successfully for user:', userId);

    // Send confirmation email
    await sendConfirmationEmail(userId, orderId);
  } catch (error) {
    console.error('Error processing order:', error);
    throw new functions.https.HttpsError('internal', 'Error processing order');
  }
}

async function sendConfirmationEmail(userId, orderId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userData.email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId} has been received and is being processed.`
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to user:', userId);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending confirmation email');
  }
}
```
```python
import os
import firebase_admin
from firebase_admin import firestore, db, storage, messaging
from flask import Flask, request, jsonify
import uuid
import smtplib
from email.mime.text import MIMEText
from google.cloud import tasks_v2

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(options={
    'storageBucket': os.getenv('GCP_STORAGE_BUCKET')
})

# Firestore, Realtime Database, Storage, and FCM initialization
firestore_client = firestore.client()
rtdb_ref = db.reference()
storage_bucket = storage.bucket()
app = Flask(__name__)

@app.route('/complex-function', methods=['POST'])
def complex_function():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        action_type = data.get('actionType')
        payload = data.get('payload')

        # Input validation
        if not user_id or not action_type or not payload:
            return jsonify({'error': 'Missing required fields'}), 400

        # Firestore operation
        user_doc = firestore_client.collection('users').document(user_id).get()
        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404
        user_data = user_doc.to_dict()

        # Realtime Database operation
        user_rtdb_data = rtdb_ref.child(f'users/{user_id}').get()

        # Cloud Storage operation
        file_path = f'user_data/{user_id}/profile_picture.jpg'
        blob = storage_bucket.blob(file_path)
        download_url = None
        if blob.exists():
            download_url = blob.generate_signed_url(expiration=3600)

        # Handle different action types
        if action_type == 'UPDATE_PROFILE':
            handle_profile_update(user_id, payload)
        elif action_type == 'SEND_NOTIFICATION':
            send_notification(user_data, payload)
        elif action_type == 'PROCESS_ORDER':
            process_order(user_id, payload)
        else:
            return jsonify({'error': 'Invalid action type'}), 400

        # Send response
        return jsonify({
            'message': 'Action processed successfully',
            'userData': user_data,
            'userRTDBData': user_rtdb_data,
            'downloadURL': download_url
        }), 200
    except Exception as e:
        print(f'Error processing request: {e}')
        return jsonify({'error': 'Internal server error'}), 500

def handle_profile_update(user_id, payload):
    try:
        firestore_client.collection('users').document(user_id).update(payload)
        print(f'Profile updated successfully for user: {user_id}')
    except Exception as e:
        print(f'Error updating profile: {e}')
        raise

def send_notification(user_data, payload):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=payload.get('title'),
                body=payload.get('body')
            ),
            token=user_data.get('fcmToken')
        )
        messaging.send(message)
        print(f'Notification sent successfully to user: {user_data.get("userId")}')
    except Exception as e:
        print(f'Error sending notification: {e}')
        raise

def process_order(user_id, payload):
    try:
        order_id = str(uuid.uuid4())
        firestore_client.collection('orders').document(order_id).set({
            'userId': user_id,
            'status': 'Processing',
            'createdAt': firestore.SERVER_TIMESTAMP,
            **payload
        })
        print(f'Order processed successfully for user: {user_id}')

        # Send confirmation email
        send_confirmation_email(user_id, order_id)
    except Exception as e:
        print(f'Error processing order: {e}')
        raise

def send_confirmation_email(user_id, order_id):
    try:
        user_doc = firestore_client.collection('users').document(user_id).get()
        user_data = user_doc.to_dict()

        msg = MIMEText(f'Your order with ID {order_id} has been received and is being processed.')
        msg['Subject'] = 'Order Confirmation'
        msg['From'] = os.getenv('GMAIL_USER')
        msg['To'] = user_data.get('email')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(os.getenv('GMAIL_USER'), os.getenv('GMAIL_PASS'))
            server.send_message(msg)

        print(f'Confirmation email sent to user: {user_id}')
    except Exception as e:
        print(f'Error sending confirmation email: {e}')
        raise

if __name__ == '__main__':
    app.run(debug=True)

```
{{endgroup}}

### Stylings
{{group:center}}
Centers all content vertically
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
{{endgroup}}

{{group:carousel}}
Aligns all images horizontally
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
other content
### breaks carousel
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
{{endgroup}}