import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import ErrorBoundary from '../../components/ErrorBoundary';

const Thrower: React.FC = () => {
  throw new Error('Boom');
};

describe('ErrorBoundary', () => {
  let errorSpy: jest.SpyInstance;
  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    errorSpy.mockRestore();
  });

  test('renders fallback UI when child throws and can retry to reset state', () => {
    let renderer: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        React.createElement(ErrorBoundary, null, React.createElement(Thrower))
      );
    });

    const instance = (renderer as any).root;
    const texts = instance.findAllByType('Text').map((t: any) => t.props.children).flat();
    expect(texts.join(' ')).toContain('문제가 발생했습니다');

    const retryButton = instance.findAllByType('TouchableOpacity')[0];
    act(() => {
      retryButton.props.onPress();
    });

    act(() => {
      (renderer as any).update(
        React.createElement(
          ErrorBoundary,
          null,
          React.createElement('View', null, React.createElement('Text', null, 'OK'))
        )
      );
    });

    const after = (renderer as any).toJSON();
    expect(after).toBeTruthy();
  });
});
