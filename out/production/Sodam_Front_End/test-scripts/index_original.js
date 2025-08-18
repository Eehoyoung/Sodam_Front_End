/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

// Robust app registration with error handling
const registerApp = () => {
    try {
        console.log('[DEBUG_LOG] Starting app registration for:', appName);

        // Import App component with error handling
        const App = require('./App').default;

        if (!App) {
            throw new Error('App component is null or undefined');
        }

        if (typeof App !== 'function') {
            throw new Error('App component is not a valid React component function');
        }

        // Register the component
        AppRegistry.registerComponent(appName, () => App);
        console.log('[DEBUG_LOG] Successfully registered app component:', appName);

    } catch (error) {
        console.error('[DEBUG_LOG] Failed to register app component:', error);

        // Fallback: Register a simple error component
        const ErrorComponent = () => {
            const React = require('react');
            const {View, Text, StyleSheet} = require('react-native');

            return React.createElement(View, {style: styles.container},
                React.createElement(Text, {style: styles.errorText},
                    'App Registration Error'),
                React.createElement(Text, {style: styles.errorMessage},
                    error.message || 'Unknown error occurred')
            );
        };

        const styles = {
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
                padding: 20,
            },
            errorText: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#d32f2f',
                marginBottom: 10,
            },
            errorMessage: {
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
            },
        };

        AppRegistry.registerComponent(appName, () => ErrorComponent);
        console.log('[DEBUG_LOG] Registered fallback error component');
    }
};

// Execute registration
registerApp();
