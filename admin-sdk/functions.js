const functionsEndpoint = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net'; // Replace with your Cloud Functions URL

// Function to call a HTTPS callable function
async function callHttpsFunction(idToken, functionName, data) {
  const response = await fetch(`${functionsEndpoint}/${functionName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

// Function to get function metadata
async function getFunctionMetadata(idToken, functionName) {
  const response = await fetch(`${functionsEndpoint}/functions/${functionName}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to list all functions
async function listFunctions(idToken) {
  const response = await fetch(`${functionsEndpoint}/functions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to update function's environment variables
async function updateFunctionEnvironmentVariables(idToken, functionName, envVars) {
  const response = await fetch(`${functionsEndpoint}/functions/${functionName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ environmentVariables: envVars })
  });
  const result = await response.json();
  return result;
}

// Function to delete a function
async function deleteFunction(idToken, functionName) {
  const response = await fetch(`${functionsEndpoint}/functions/${functionName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

export {
  callHttpsFunction,
  getFunctionMetadata,
  listFunctions,
  updateFunctionEnvironmentVariables,
  deleteFunction
};
