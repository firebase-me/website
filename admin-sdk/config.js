const remoteConfigEndpoint = 'https://firebaseremoteconfig.googleapis.com/v1/projects';

// Function to get the latest Remote Config template
async function getRemoteConfigTemplate(idToken, projectId) {
  const response = await fetch(`${remoteConfigEndpoint}/${projectId}/remoteConfig`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to publish a new Remote Config template
async function publishRemoteConfigTemplate(idToken, projectId, template, version) {
  const url = `${remoteConfigEndpoint}/${projectId}/remoteConfig?validateOnly=false`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      'If-Match': version // Use the latest version
    },
    body: JSON.stringify(template)
  });
  const result = await response.json();
  return result;
}

// Function to rollback to a previous Remote Config template version
async function rollbackRemoteConfigTemplate(idToken, projectId, versionNumber) {
  const response = await fetch(`${remoteConfigEndpoint}/${projectId}/remoteConfig:rollback?versionNumber=${versionNumber}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to list Remote Config template versions
async function listRemoteConfigVersions(idToken, projectId, pageSize = 10, pageToken = '') {
  const response = await fetch(`${remoteConfigEndpoint}/${projectId}/remoteConfig:listVersions?pageSize=${pageSize}&pageToken=${pageToken}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

export {
  getRemoteConfigTemplate,
  publishRemoteConfigTemplate,
  rollbackRemoteConfigTemplate,
  listRemoteConfigVersions
};
