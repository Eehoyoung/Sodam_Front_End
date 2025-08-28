import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

// Mock heavy AuthProvider to avoid network/timer side-effects in tests
jest.mock('../../../src/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({ user: null, isAuthenticated: false, login: jest.fn(), logout: jest.fn() }),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as any).mockRestore?.();
  (console.log as any).mockRestore?.();
  (console.warn as any).mockRestore?.();
});


describe('App smoke test', () => {
  test('renders without crashing with providers', () => {
    (global as any).__DEV__ = true;

    const App = require('../../../App').default;

    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(React.createElement(App));
    });
    const tree = (renderer as any).toJSON();
    expect(tree).toBeTruthy();
    act(() => {
      (renderer as any).unmount();
    });
  });
});
