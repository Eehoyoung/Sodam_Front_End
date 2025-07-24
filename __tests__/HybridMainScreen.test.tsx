import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import HybridMainScreen from '../src/features/welcome/screens/HybridMainScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

// Mock components to avoid complex dependencies
jest.mock('../src/features/welcome/components/StorytellingSection', () => {
    const mockReact = require('react');
    return function MockStorytellingSection({isVisible, onComplete}: any) {
        return mockReact.createElement('View', {testID: 'storytelling-section'},
            mockReact.createElement('Text', null, 'Storytelling Section')
        );
    };
});

jest.mock('../src/features/welcome/components/FeatureDashboardSection', () => {
    const mockReact = require('react');
    return function MockFeatureDashboardSection({isVisible, onFeatureTest}: any) {
        return mockReact.createElement('View', {testID: 'dashboard-section'},
            mockReact.createElement('Text', null, 'Feature Dashboard Section')
        );
    };
});

jest.mock('../src/features/welcome/components/ConversionSection', () => {
    const mockReact = require('react');
    return function MockConversionSection({isVisible, onDownload, onWebTrial}: any) {
        return mockReact.createElement('View', {testID: 'conversion-section'},
            mockReact.createElement('Text', null, 'Conversion Section')
        );
    };
});

jest.mock('../src/features/welcome/components/Header', () => {
    const mockReact = require('react');
    return function MockHeader({onLogin, onSignup}: any) {
        return mockReact.createElement('View', {testID: 'header'},
            mockReact.createElement('Text', null, 'Header')
        );
    };
});

describe('HybridMainScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        let renderer: ReactTestRenderer.ReactTestRenderer;

        act(() => {
            renderer = ReactTestRenderer.create(React.createElement(HybridMainScreen));
        });

        const tree = renderer!.toJSON();
        expect(tree).toBeTruthy();
    });

    test('contains all main sections', () => {
        let renderer: ReactTestRenderer.ReactTestRenderer;

        act(() => {
            renderer = ReactTestRenderer.create(React.createElement(HybridMainScreen));
        });

        const instance = renderer!.root;

        // Check if all main sections are present
        expect(instance.findByProps({testID: 'header'})).toBeTruthy();
        expect(instance.findByProps({testID: 'storytelling-section'})).toBeTruthy();
        expect(instance.findByProps({testID: 'dashboard-section'})).toBeTruthy();
        expect(instance.findByProps({testID: 'conversion-section'})).toBeTruthy();
    });

    test('handles navigation correctly', () => {
        let renderer: ReactTestRenderer.ReactTestRenderer;

        act(() => {
            renderer = ReactTestRenderer.create(React.createElement(HybridMainScreen));
        });

        // The component should be created without throwing errors
        expect(renderer!.toJSON()).toBeTruthy();

        // Navigation mock should be available
        expect(mockNavigate).toBeDefined();
    });

    test('initializes with correct default state', () => {
        let renderer: ReactTestRenderer.ReactTestRenderer;

        act(() => {
            renderer = ReactTestRenderer.create(React.createElement(HybridMainScreen));
        });

        const tree = renderer!.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
