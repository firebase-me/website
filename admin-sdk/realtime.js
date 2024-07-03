const databaseEndpoint = `https://${YOUR_PROJECT_ID}.firebaseio.com`;

// Function to write data to a specified path
async function setData(idToken, path, data) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?auth=${idToken}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

// Function to update data at a specified path
async function updateData(idToken, path, data) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?auth=${idToken}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

// Function to read data from a specified path
async function getData(idToken, path) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?auth=${idToken}`, {
    method: 'GET'
  });
  const result = await response.json();
  return result;
}

// Function to delete data at a specified path
async function deleteData(idToken, path) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?auth=${idToken}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  return result;
}

// Function to perform a shallow query
async function shallowQuery(idToken, path) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?shallow=true&auth=${idToken}`, {
    method: 'GET'
  });
  const result = await response.json();
  return result;
}

// Function to list all items at a specified path
async function listData(idToken, path) {
  const response = await fetch(`${databaseEndpoint}/${path}.json?auth=${idToken}`, {
    method: 'GET'
  });
  const result = await response.json();
  return result;
}

// Function to listen for data changes at a specified path (note: this uses long polling and is not real-time)
async function listenForChanges(idToken, path, callback) {
  const poll = async () => {
    try {
      const data = await getData(idToken, path);
      callback(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setTimeout(poll, 5000); // Poll every 5 seconds
  };
  poll();
}

export {
  setData,
  updateData,
  getData,
  deleteData,
  shallowQuery,
  listData,
  listenForChanges
};
