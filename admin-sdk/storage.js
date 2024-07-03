const storageEndpoint = 'https://firebasestorage.googleapis.com/v0/b';

// Function to upload a file
async function uploadFile(idToken, bucketName, filePath, fileData) {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o?uploadType=media&name=${filePath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/octet-stream'
    },
    body: fileData
  });
  const result = await response.json();
  return result;
}

// Function to get a file's metadata
async function getFileMetadata(idToken, bucketName, filePath) {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to update a file's metadata
async function updateFileMetadata(idToken, bucketName, filePath, metadata) {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o/${encodeURIComponent(filePath)}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
  const result = await response.json();
  return result;
}

// Function to delete a file
async function deleteFile(idToken, bucketName, filePath) {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o/${encodeURIComponent(filePath)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to list all files in a bucket
async function listFiles(idToken, bucketName, prefix = '', delimiter = '') {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o?prefix=${encodeURIComponent(prefix)}&delimiter=${encodeURIComponent(delimiter)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to get a download URL for a file
async function getDownloadUrl(idToken, bucketName, filePath) {
  const response = await fetch(`${storageEndpoint}/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${idToken}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result.downloadTokens ? `${storageEndpoint}/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${result.downloadTokens}` : null;
}

export {
  uploadFile,
  getFileMetadata,
  updateFileMetadata,
  deleteFile,
  listFiles,
  getDownloadUrl
};
