import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

describe('App bootstrap', () => {
  test('renders without crashing and exports component', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    act(() => {
      renderer = ReactTestRenderer.create(React.createElement(App));
    });
    expect(renderer).toBeTruthy();
    const tree = renderer!.toJSON();
    expect(tree).toBeTruthy();
  });
});
