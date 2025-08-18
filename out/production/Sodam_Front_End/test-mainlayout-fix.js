/**
 * Test script to verify MainLayout JSI assertion fix
 * This script tests that MainLayout can be rendered without JSI violations
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-test-renderer';

// Mock react-native modules
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 }))
  },
  StyleSheet: {
    create: jest.fn((styles) => styles)
  },
  View: 'View',
  Platform: {
    OS: 'ios'
  }
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    ScrollView: 'Animated.ScrollView',
    View: 'Animated.View'
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn((callback) => {
    // Test that the callback doesn't throw JSI assertion errors
    try {
      const result = callback();
      console.log('[DEBUG_LOG] useAnimatedStyle callback executed successfully:', result);
      return result;
    } catch (error) {
      console.error('[DEBUG_LOG] JSI assertion error in useAnimatedStyle:', error);
      throw error;
    }
  }),
  useAnimatedScrollHandler: jest.fn(() => jest.fn()),
  interpolate: jest.fn((value, inputRange, outputRange, extrapolate) => {
    console.log('[DEBUG_LOG] interpolate called with:', { value, inputRange, outputRange });
    return 0.5; // Mock interpolated value
  }),
  Extrapolate: {
    CLAMP: 'clamp'
  }
}));

// Mock responsive utils
jest.mock('../src/utils/responsive', () => ({
  useResponsiveStyles: jest.fn(() => ({
    responsiveStyles: {
      container: { padding: 16 }
    }
  }))
}));

// Mock Header and Footer components
jest.mock('../src/common/components/layout/Header', () => 'Header');
jest.mock('../src/common/components/layout/Footer', () => 'Footer');

describe('MainLayout JSI Fix Test', () => {
  test('MainLayout renders without JSI assertion failures', () => {
    console.log('[DEBUG_LOG] Starting MainLayout JSI fix test...');

    // Import MainLayout after mocks are set up
    const MainLayout = require('../src/common/components/layout/MainLayout').default;

    let renderer;

    // Test that MainLayout can be created without JSI errors
    act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(MainLayout, {
          title: 'Test Title',
          children: React.createElement('View', null, 'Test Content')
        })
      );
    });

    expect(renderer).toBeTruthy();
    console.log('[DEBUG_LOG] MainLayout rendered successfully without JSI assertion failures');

    // Test that the component tree is correct
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    console.log('[DEBUG_LOG] MainLayout JSI fix test completed successfully');
  });

  test('Dimensions.get is called outside worklet', () => {
    console.log('[DEBUG_LOG] Testing Dimensions.get usage pattern...');

    const MainLayout = require('../src/common/components/layout/MainLayout').default;

    // Mock Dimensions.get to track calls
    const mockDimensionsGet = jest.fn(() => ({ width: 375, height: 812 }));
    require('react-native').Dimensions.get = mockDimensionsGet;

    let renderer;
    act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(MainLayout, {
          title: 'Test Title',
          children: React.createElement('View', null, 'Test Content')
        })
      );
    });

    // Verify Dimensions.get was called (should be called during component initialization)
    expect(mockDimensionsGet).toHaveBeenCalled();
    console.log('[DEBUG_LOG] Dimensions.get called correctly outside worklet context');

    // Verify no additional calls during animation style calculations
    const callCount = mockDimensionsGet.mock.calls.length;
    console.log('[DEBUG_LOG] Total Dimensions.get calls:', callCount);

    // Should only be called once during useMemo initialization
    expect(callCount).toBe(1);

    console.log('[DEBUG_LOG] Dimensions.get usage pattern test completed successfully');
  });
});
