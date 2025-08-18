/**
 * Minimal test index.js to isolate registration issues
 * @format
 */

console.log('[DEBUG_LOG] === MINIMAL INDEX.JS START ===');

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

console.log('[DEBUG_LOG] AppRegistry imported successfully');
console.log('[DEBUG_LOG] App name from app.json:', appName);

// Create the most minimal possible React component
const MinimalApp = () => {
    console.log('[DEBUG_LOG] MinimalApp component rendering');

    const React = require('react');
    const {View, Text} = require('react-native');

    console.log('[DEBUG_LOG] React and React Native components imported');

    return React.createElement(
        View,
        {
            style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
            },
        },
        React.createElement(
            Text,
            {
                style: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#000000',
                    textAlign: 'center',
                },
            },
            'Minimal App Works!'
        ),
        React.createElement(
            Text,
            {
                style: {
                    fontSize: 16,
                    color: '#666666',
                    textAlign: 'center',
                    marginTop: 20,
                },
            },
            'Registration Test Successful'
        )
    );
};

console.log('[DEBUG_LOG] MinimalApp component created');

// Register the component
try {
    AppRegistry.registerComponent(appName, () => MinimalApp);
    console.log('[DEBUG_LOG] ✅ SUCCESS: Component registered successfully!');
    console.log('[DEBUG_LOG] ✅ App name:', appName);
    console.log('[DEBUG_LOG] ✅ Component function:', typeof MinimalApp);
} catch (error) {
    console.error('[DEBUG_LOG] ❌ FAILED: Registration error:', error);
}

console.log('[DEBUG_LOG] === MINIMAL INDEX.JS END ===');
