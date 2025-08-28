import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { UIManager } from 'react-native';
import SafeAreaProviderGuard from '../SafeAreaProviderGuard';

const Child = () => React.createElement('Child');

describe('SafeAreaProviderGuard', () => {
  const originalGetConfig = (UIManager as any).getViewManagerConfig;

  afterEach(() => {
    (UIManager as any).getViewManagerConfig = originalGetConfig;
    jest.restoreAllMocks();
  });

  test('falls back to View when RNCSafeAreaProvider is missing', () => {
    (UIManager as any).getViewManagerConfig = jest.fn(() => null);
    const warnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});

    const renderer = ReactTestRenderer.create(
      <SafeAreaProviderGuard>
        <Child />
      </SafeAreaProviderGuard>
    );

    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
    expect(warnSpy).toHaveBeenCalled();
  });

  test('uses SafeAreaProvider when ViewManager is available', () => {
    (UIManager as any).getViewManagerConfig = jest.fn(() => ({ name: 'RNCSafeAreaProvider' }));
    const warnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});

    const renderer = ReactTestRenderer.create(
      <SafeAreaProviderGuard>
        <Child />
      </SafeAreaProviderGuard>
    );

    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
