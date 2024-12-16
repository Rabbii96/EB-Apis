const { test, expect, request } = require('@playwright/test');

const { faker } = require('@faker-js/faker');

test('POST /roles - Create a new role with random data', async () => {
  const apiContext = await request.newContext();
  
  // Generate random data for the request body using faker
  const randomName = faker.word.noun() + '_' + Math.random().toString(36).substring(2, 15);  // Unique name
  const randomDescription = faker.lorem.sentence();  // Random sentence for description
  const randomPermissionKey = faker.word.noun();  // Random permission key
  
  // Define the request body with random data
  const requestBody = {
    name: randomName,
    description: randomDescription,
    permissionKeys: [randomPermissionKey]
  };
  
  // Send POST request
  const response = await apiContext.post('http://20.2.12.209:8080/api/v1/roles', {
    data: requestBody,
    timeout: 60000, 
  });
  
  // Log the response status and body
  console.log(`Response Status: ${response.status()}`);
  const responseBody = await response.json();
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
  // Validate response status code is 200 (or 201 for successful resource creation)
  expect(response.status()).toBe(201);  // or 201 depending on the API response for creation
  
  // Access the 'data' property and validate the response structure
  const responseData = responseBody.data;  // Access 'data' from the response
  expect(responseData).toHaveProperty('name', randomName);  // Check 'name' within 'data'
  expect(responseData).toHaveProperty('description', randomDescription);  // Check 'description'
  expect(responseData).toHaveProperty('permissions');
  expect(responseData.permissions).toHaveLength(0);  // Empty permissions array in the response
});

test('GET /roles - Log response body', async () => {
  // Initialize the API context
  const apiContext = await request.newContext();
  
  // Send GET request
  const response = await apiContext.get('http://20.2.12.209:8080/api/v1/roles');
  
  // Log the status code
  console.log(`Response Status: ${response.status()}`);
  
  // Log the response body
  const responseBody = await response.json();
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));

  // Validate status code 200
  expect(response.status()).toBe(200);
});


test('GET /roles - Fetch role list and PUT /roles/{id} - Update role', async () => {
  const apiContext = await request.newContext();

  // Step 1: Manually set the role ID
  const roleId = 7; // Replace this with the desired role ID
  console.log('Role ID to update:', roleId);

  // Step 2: Prepare the PUT request body
  const updatedName = faker.lorem.word();
  const updatedDescription = faker.lorem.sentence();
  const updatedPermissionKey = "ahgbfhgbgb";

  const updateRequestBody = {
    name: updatedName,
    description: updatedDescription,
    permissionKeys: [updatedPermissionKey],
  };

  // Step 3: Send the PUT request to update the role
  const putResponse = await apiContext.put(`http://20.2.12.209:8080/api/v1/roles/${roleId}`, {
    data: updateRequestBody,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Add if required
    },
    timeout: 60000,
  });

  // Validate the PUT response status
  expect(putResponse.status()).toBe(200);

  // Log PUT response body for debugging
  console.log('PUT Response Body:', await putResponse.json());

  // Step 4: Delay for potential update processing on the server
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Step 5: Get the updated role
  const getUpdatedRoleResponse = await apiContext.get(`http://20.2.12.209:8080/api/v1/roles/${roleId}`, {
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Add if required
    }
  });

  // Verify the HTTP status code
  expect(getUpdatedRoleResponse.status()).toBe(200);

  // Validate the updated role properties in the response
  const updatedRole = await getUpdatedRoleResponse.json();
  expect(updatedRole.data).toHaveProperty('name', updatedName);
  expect(updatedRole.data).toHaveProperty('description', updatedDescription);
  expect(updatedRole.data.permissions).toContain(updatedPermissionKey);
});

  
  