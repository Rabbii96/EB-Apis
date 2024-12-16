// const { test, expect } = require('@playwright/test');

// // Base API URL
// const BASE_URL = 'http://20.2.12.209:8080/api/v1';

// test.describe('Authentication API Tests', () => {
//   let operationId;

//   test('POST /auth/register - Register a new user', async ({ request }) => {
//     const requestBody = {
//       name: "John Doe",
//       phone: "1234567890",
//       email: "johndoe@example.com",
//       referralCode: "REF123",
//       password: "Password123!"
//     };

//     // Make the POST request to the /auth/register endpoint
//     const response = await request.post(`${BASE_URL}/auth/register`, {
//       data: requestBody,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Assert response status is 200 (OK)
//     expect(response.status()).toBe(200);

//     // Validate response body structure
//     const responseBody = await response.json();
//     expect(responseBody).toHaveProperty('data');
//     expect(responseBody.data).toHaveProperty('operationId');
//     expect(responseBody.data).toHaveProperty('otp');

//     // Save operationId for the next test if needed
//     operationId = responseBody.data.operationId;

//     // Validate the meta structure
//     expect(responseBody).toHaveProperty('meta');
//     expect(responseBody.meta).toHaveProperty('resultType');
//     expect(responseBody.meta).toHaveProperty('message');
//     expect(responseBody.meta.resultType).toBe('SUCCESS');

//     // Validate pagination is correct (even if it's empty)
//     expect(responseBody).toHaveProperty('pagination');
//     expect(responseBody.pagination).toHaveProperty('currentPage');
//     expect(responseBody.pagination.currentPage).toBe(0);

//     // Log the response for debugging
//     console.log('Register Response:', responseBody);
//   });
// });


const { test, expect } = require('@playwright/test');

// Base API URL
const BASE_URL = 'http://20.2.12.209:8080/api/v1';

test.describe('Authentication API Tests', () => {
  let operationId;
  let accessToken;
  let refreshToken;

  test('POST /auth/register - Register a new user', async ({ request }) => {
    const requestBody = {
      name: "John Doe",
      phone: "1234567890",
      email: "johndoe@example.com",
      referralCode: "REF123",
      password: "Password123!"
    };

    const response = await request.post(`${BASE_URL}/auth/register`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('operationId');
    expect(responseBody.data).toHaveProperty('otp');

    // Save operationId for the next test
    operationId = responseBody.data.operationId;

    // Log the response for debugging
    console.log('Register Response:', responseBody);
  });

  test('POST /auth/register/verify - Verify user registration with OTP', async ({ request }) => {
    const requestBody = {
      operationId: operationId, // Use the operationId from the previous test
      otp: "123456",           // Replace with a valid OTP if required
    };

    const response = await request.post(`${BASE_URL}/auth/register/verify`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('accessToken');
    expect(responseBody.data).toHaveProperty('refreshToken');

    // Save tokens for later use
    accessToken = responseBody.data.accessToken;
    refreshToken = responseBody.data.refreshToken;

    // Log the response for debugging
    console.log('Verify Response:', responseBody);
  });

  test('POST /auth/refresh - Refresh access token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/refresh`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`, // Pass the refresh token
      },
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('accessToken');
    expect(responseBody.data).toHaveProperty('refreshToken');

    // Log the response for debugging
    console.log('Refresh Response:', responseBody);

    // Update tokens
    accessToken = responseBody.data.accessToken;
    refreshToken = responseBody.data.refreshToken;
  });

  test('POST /auth/login - Login with credentials', async ({ request }) => {
    const requestBody = {
      loginId: "johndoe@example.com",
      password: "Password123!",
      userType: "CUSTOMER",
    };

    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('accessToken');
    expect(responseBody.data).toHaveProperty('refreshToken');

    // Log the response for debugging
    console.log('Login Response:', responseBody);
  });
});
