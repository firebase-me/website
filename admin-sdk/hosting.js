const hostingEndpoint = `https://firebasehosting.googleapis.com/v1beta1`;

// Function to list sites
async function listSites(idToken, projectId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to get a site
async function getSite(idToken, projectId, siteId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to create a new site
async function createSite(idToken, projectId, siteId, siteConfig) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites?siteId=${siteId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(siteConfig)
  });
  const result = await response.json();
  return result;
}

// Function to update a site
async function updateSite(idToken, projectId, siteId, siteConfig) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(siteConfig)
  });
  const result = await response.json();
  return result;
}

// Function to delete a site
async function deleteSite(idToken, projectId, siteId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to create a new release
async function createRelease(idToken, projectId, siteId, versionName, releaseConfig) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/releases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ versionName, ...releaseConfig })
  });
  const result = await response.json();
  return result;
}

// Function to get a release
async function getRelease(idToken, projectId, siteId, releaseId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/releases/${releaseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to list releases
async function listReleases(idToken, projectId, siteId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/releases`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to get the current release
async function getCurrentRelease(idToken, projectId, siteId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/releases/-`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to list versions
async function listVersions(idToken, projectId, siteId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/versions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to get a version
async function getVersion(idToken, projectId, siteId, versionId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/versions/${versionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to delete a version
async function deleteVersion(idToken, projectId, siteId, versionId) {
  const response = await fetch(`${hostingEndpoint}/projects/${projectId}/sites/${siteId}/versions/${versionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

export {
  listSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  createRelease,
  getRelease,
  listReleases,
  getCurrentRelease,
  listVersions,
  getVersion,
  deleteVersion
};
