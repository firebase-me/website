const performanceEndpoint = 'https://firebaseremoteconfig.googleapis.com/v1/projects';

// Function to get performance metrics
async function getPerformanceMetrics(idToken, projectId) {
  const response = await fetch(`${performanceEndpoint}/${projectId}/performanceMetrics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  return result;
}

// Function to get performance metrics by app
async function getPerformanceMetricsByApp(idToken, projectId, appId) {
  const response = await fetch(`${performanceEndpoint}/${projectId}/apps/${appId}/performanceMetrics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  return result;
}

// Function to get performance metrics by session
async function getPerformanceMetricsBySession(idToken, projectId, sessionId) {
  const response = await fetch(`${performanceEndpoint}/${projectId}/sessions/${sessionId}/performanceMetrics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  return result;
}

export {
  getPerformanceMetrics,
  getPerformanceMetricsByApp,
  getPerformanceMetricsBySession
};
