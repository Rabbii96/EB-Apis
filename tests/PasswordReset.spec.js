const { test, expect } = require('@playwright/test');

// Base API URL
const BASE_URL = 'http://20.2.12.209:8080/api/v1';

test.describe('Password Reset API Tests', () => {
  let operationId;
  let otp;
  let resetToken;

  test('POST /auth/password/verify - Verify password reset request', async ({ request }) => {
    const requestBody = {
      phone: "1234567890",       // Replace with the actual phone number
      userType: "CUSTOMER",      // Replace with the correct userType
    };

    const response = await request.post(`${BASE_URL}/auth/password/verify`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('operationId');
    expect(responseBody.data).toHaveProperty('otp');

    // Save operationId and OTP for the next test
    operationId = responseBody.data.operationId;
    otp = responseBody.data.otp;

    // Log the response for debugging
    console.log('Verify Response:', responseBody);
  });

  test('POST /auth/password/verify - Verify OTP for password reset', async ({ request }) => {
    const requestBody = {
      operationId: operationId, // Use the operationId from the previous test
      otp: otp,                 // Use the OTP from the previous test
    };

    const response = await request.post(`${BASE_URL}/auth/password/verify`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('resetToken');

    // Save the resetToken for the next test
    resetToken = responseBody.data.resetToken;

    // Log the response for debugging
    console.log('Password Reset Verify Response:', responseBody);
  });

  test('POST /auth/password/reset - Reset the password with reset token', async ({ request }) => {
    const requestBody = {
      resetToken: resetToken, // Use the resetToken from the previous test
      password: "NewPassword123!", // Set a new password
    };

    const response = await request.post(`${BASE_URL}/auth/password/reset`, {
      data: requestBody,
    });

    // Assert response status
    expect(response.status()).toBe(200);

    // Validate response body structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.meta).toHaveProperty('resultType');
    expect(responseBody.meta).toHaveProperty('message');

    // Log the response for debugging
    console.log('Password Reset Response:', responseBody);
  });
});
