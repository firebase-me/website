const analyticsEndpoint = 'https://analyticsdata.googleapis.com/v1beta';

// Function to get metadata for dimensions and metrics
async function getMetadata(idToken, propertyId) {
  const response = await fetch(`${analyticsEndpoint}/properties/${propertyId}/metadata`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  const result = await response.json();
  return result;
}

// Function to run a report
async function runReport(idToken, propertyId, reportRequest) {
  const response = await fetch(`${analyticsEndpoint}/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportRequest)
  });
  const result = await response.json();
  return result;
}

// Function to batch run reports
async function batchRunReports(idToken, propertyId, reportRequests) {
  const response = await fetch(`${analyticsEndpoint}/properties/${propertyId}:batchRunReports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests: reportRequests })
  });
  const result = await response.json();
  return result;
}

// Function to get realtime data
async function runRealtimeReport(idToken, propertyId, realtimeReportRequest) {
  const response = await fetch(`${analyticsEndpoint}/properties/${propertyId}:runRealtimeReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(realtimeReportRequest)
  });
  const result = await response.json();
  return result;
}

export {
  getMetadata,
  runReport,
  batchRunReports,
  runRealtimeReport
};
