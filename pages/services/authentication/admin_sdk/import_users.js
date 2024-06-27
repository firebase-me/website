const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const axios = require('axios');

var serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const apiKey = "AIzaSyDZ3F5wLpXLRv4Xb0g8L6dKeHle_N92Uy4"; // Replace with your Firebase project web API key
const hashAlgorithm = "HMAC_SHA256"; // Change to "BCRYPT", "HMAC_MD5", "HMAC_SHA1", "HMAC_SHA256", or "HMAC_SHA512"
const key = crypto.randomBytes(32).toString('base64'); // Key for HMAC_SHA algorithms
const batchSize = 10; // Number of users to batch for imports
const passwordBase = "testpassword";
const users = [];

async function generatePasswordHash(password, algorithm) {
  switch (algorithm) {
    case "BCRYPT":
      return await bcrypt.hash(password, 10);
    case "HMAC_MD5":
      return crypto.createHmac('md5', Buffer.from(key, 'base64')).update(password).digest('base64');
    case "HMAC_SHA1":
      return crypto.createHmac('sha1', Buffer.from(key, 'base64')).update(password).digest('base64');
    case "HMAC_SHA256":
      return crypto.createHmac('sha256', Buffer.from(key, 'base64')).update(password).digest('base64');
    case "HMAC_SHA512":
      return crypto.createHmac('sha512', Buffer.from(key, 'base64')).update(password).digest('base64');
    default:
      throw new Error("Unsupported hash algorithm");
  }
}

function generateUsers() {
  for (let i = 0; i < 100; i++) {
    const email = `testuser${i}@example.com`;
    const password = `${passwordBase}${i}`;
    users.push({
      email: email,
      plainPassword: password
    });
  }
}

async function importUsers() {
  const hashOptions = {
    BCRYPT: {
      algorithm: 'BCRYPT',
      rounds: 10,
    },
    HMAC_MD5: {
      algorithm: 'HMAC_MD5',
      key: Buffer.from(key, 'base64'),
    },
    HMAC_SHA1: {
      algorithm: 'HMAC_SHA1',
      key: Buffer.from(key, 'base64'),
    },
    HMAC_SHA256: {
      algorithm: 'HMAC_SHA256',
      key: Buffer.from(key, 'base64'),
    },
    HMAC_SHA512: {
      algorithm: 'HMAC_SHA512',
      key: Buffer.from(key, 'base64'),
    }
  };

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const userRecords = await Promise.all(batch.map(async (user) => {
      const passwordHash = await generatePasswordHash(user.plainPassword, hashAlgorithm);
      return {
        uid: user.email,
        email: user.email,
        emailVerified: true,
        passwordHash: Buffer.from(passwordHash, 'base64'),
      };
    }));

    try {
      const result = await admin.auth().importUsers(userRecords, { hash: hashOptions[hashAlgorithm] });
      if (result.errors.length > 0) {
        console.error('Errors importing users:', result.errors);
      } else {
        console.log(`Successfully imported users: ${batch.map(user => user.email).join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing users:', error);
    }
  }
}

async function verifyUsers() {
  for (const user of users) {
    try {
      const importedUser = await admin.auth().getUserByEmail(user.email);
      console.log(`Verified imported user: ${importedUser.email}`);
    } catch (error) {
      console.error(`Failed to verify user ${user.email}:`, error);
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function signInUser(email, password) {
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      email,
      password,
      returnSecureToken: true
    });
    console.log(`Successfully logged in user: ${email}`);
    console.log('ID Token:', response.data.idToken);
  } catch (error) {
    console.error(`Failed to log in user ${email}:`, error.response ? error.response.data : error.message);
  }
}

async function loginUsers() {
  for (const user of users) {
    try {
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signInUser(user.email, user.plainPassword);
    } catch (error) {
      console.error(`Failed to log in user ${user.email}:`, error);
    }
  }
}

async function start() {
  generateUsers();
  await importUsers();
  await verifyUsers();
  shuffleArray(users);
  await loginUsers();
}

start();
