const FIREBASE_AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1';
const FIREBASE_AUTH_ENDPOINT = `${FIREBASE_AUTH_BASE_URL}/accounts`;

// Basic Auth Functions

async function signInWithCustomToken(customToken) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:signInWithCustomToken?key=${customToken.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });

  if (!response.ok) {
    throw new Error('Failed to sign in with custom token');
  }

  const data = await response.json();
  return data.idToken;
}

async function getAllUsers(idToken, maxResults = 1000) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:listUsers?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ maxResults })
  });

  if (!response.ok) {
    throw new Error('Failed to get users');
  }

  const data = await response.json();
  return data.users;
}

async function updateUser(idToken, uid, updates) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:update?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid, ...updates })
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  const data = await response.json();
  return data;
}

async function setCustomUserClaims(idToken, uid, claims) {
  const response = await fetch(`${FIREBASE_AUTH_BASE_URL}/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT}/claims:write?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localId: uid, customAttributes: JSON.stringify(claims) })
  });

  if (!response.ok) {
    throw new Error('Failed to set custom user claims');
  }

  const data = await response.json();
  return data;
}

async function deleteUser(idToken, uid) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:delete?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localId: uid })
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return true;
}

async function getUserByEmail(idToken, email) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:lookup?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    throw new Error('Failed to get user by email');
  }

  const data = await response.json();
  return data.users[0];
}

async function verifyIdToken(idToken, token) {
  const response = await fetch(`${FIREBASE_AUTH_BASE_URL}/v1/tokeninfo?id_token=${token}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to verify ID token');
  }

  const data = await response.json();
  return data;
}

// Extended Auth Functions

async function createUser(idToken, userData) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:signupNewUser?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const data = await response.json();
  return data;
}

async function deleteUserByEmail(idToken, email) {
  const user = await getUserByEmail(idToken, email);
  if (user) {
    return await deleteUser(idToken, user.localId);
  } else {
    throw new Error('User not found');
  }
}

async function setPassword(idToken, uid, password) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:update?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localId: uid, password })
  });

  if (!response.ok) {
    throw new Error('Failed to set password');
  }

  const data = await response.json();
  return data;
}

async function setEmail(idToken, uid, email) {
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}:update?key=${idToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localId: uid, email })
  });

  if (!response.ok) {
    throw new Error('Failed to set email');
  }

  const data = await response.json();
  return data;
}

export {
  signInWithCustomToken,
  getAllUsers,
  updateUser,
  setCustomUserClaims,
  deleteUser,
  getUserByEmail,
  verifyIdToken,
  createUser,
  deleteUserByEmail,
  setPassword,
  setEmail
};
