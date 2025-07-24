/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock auth service
jest.mock('../src/features/auth/services/authService', () => ({
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
    login: jest.fn(() => Promise.resolve({user: null})),
    logout: jest.fn(() => Promise.resolve()),
    kakaoLogin: jest.fn(() => Promise.resolve({token: null})),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
