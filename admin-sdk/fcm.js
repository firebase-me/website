const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects';

// Function to send a message
async function sendMessage(idToken, projectId, message) {
  const response = await fetch(`${fcmEndpoint}/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  const result = await response.json();
  return result;
}

// Function to subscribe to a topic
async function subscribeToTopic(idToken, projectId, topic, registrationTokens) {
  const response = await fetch(`${fcmEndpoint}/${projectId}/iid:batchAdd`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: `/topics/${topic}`,
      registration_tokens: registrationTokens
    })
  });
  const result = await response.json();
  return result;
}

// Function to unsubscribe from a topic
async function unsubscribeFromTopic(idToken, projectId, topic, registrationTokens) {
  const response = await fetch(`${fcmEndpoint}/${projectId}/iid:batchRemove`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: `/topics/${topic}`,
      registration_tokens: registrationTokens
    })
  });
  const result = await response.json();
  return result;
}

// Function to get message delivery data
async function getMessageDeliveryData(idToken, projectId, messageId) {
  const response = await fetch(`${fcmEndpoint}/${projectId}/messages:reportDelivery`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageId })
  });
  const result = await response.json();
  return result;
}

export {
  sendMessage,
  subscribeToTopic,
  unsubscribeFromTopic,
  getMessageDeliveryData
};
