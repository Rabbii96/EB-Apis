
const { test, expect, request } = require('@playwright/test');

test('GET /permissions - Log response body', async () => {
  // Initialize the API context
  const apiContext = await request.newContext();
  
  // Send GET request
  const response = await apiContext.get('http://20.2.12.209:8080/api/v1/permissions');
  
  // Log the status code
  console.log(`Response Status: ${response.status()}`);
  
  // Log the response body
  const responseBody = await response.json();
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));

  // Validate status code 200
  expect(response.status()).toBe(200);

   // Validate response structure (e.g., meta, data fields)
   expect(responseBody).toHaveProperty('data');
   expect(responseBody).toHaveProperty('meta');
   expect(Array.isArray(responseBody.data)).toBeTruthy();
   expect(responseBody.meta).toHaveProperty('resultType');
   expect(responseBody.meta).toHaveProperty('message');

 
 // Validate the resultType field in meta is 'SUCCESS'
expect(responseBody.meta.resultType).toBe('SUCCESS');

 expect(responseBody.meta.message).toBe('The operation was successful');

});






















//   test('GET /permissions - Fetch permissions', async () => {
//     const response = await apiContext.get('/permissions');
//     expect(response.ok()).toBeTruthy();
//     const permissions = await response.json();
//     console.log(permissions);
//     // Add your assertions here
//   });

//   test.afterAll(async () => {
//     await apiContext.dispose();
//   });
// });

// test.describe('Role Management API Tests', () => {
//   let apiContext;

//   test.beforeAll(async ({ playwright }) => {
//     apiContext = await request.newContext({
//       baseURL: BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer <your_token>', // Replace with actual token if required
//       },
//     });
//   });

//   test('GET /roles - Fetch roles', async () => {
//     const response = await apiContext.get('/roles');
//     expect(response.ok()).toBeTruthy();
//     const roles = await response.json();
//     console.log(roles);
//     // Add your assertions here
//   });

//   test('POST /roles - Create a role', async () => {
//     const payload = {
//       name: 'Test Role', // Example payload
//       permissions: ['READ', 'WRITE'], // Replace with actual data
//     };

//     const response = await apiContext.post('/roles', {
//       data: payload,
//     });
//     expect(response.ok()).toBeTruthy();
//     const newRole = await response.json();
//     console.log(newRole);
//     // Add your assertions here
//   });

//   test('PUT /roles/{roleId} - Update a role', async () => {
//     const roleId = '12345'; // Replace with actual role ID
//     const payload = {
//       name: 'Updated Role Name',
//       permissions: ['READ', 'EXECUTE'], // Replace with actual data
//     };

//     const response = await apiContext.put(`/roles/${roleId}`, {
//       data: payload,
//     });
//     expect(response.ok()).toBeTruthy();
//     const updatedRole = await response.json();
//     console.log(updatedRole);
//     // Add your assertions here
//   });

//   test.afterAll(async () => {
//     await apiContext.dispose();
//   });
// });
