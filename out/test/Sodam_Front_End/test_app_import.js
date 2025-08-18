console.log('[DEBUG_LOG] Testing App component import...');

try {
    console.log('[DEBUG_LOG] Attempting to import App component...');
    const App = require('./App').default;

    console.log('[DEBUG_LOG] App import successful, type:', typeof App);
    console.log('[DEBUG_LOG] App component:', App ? 'exists' : 'null/undefined');

    if (App && typeof App === 'function') {
        console.log('[DEBUG_LOG] ✅ App component is valid React component');

        // Test if we can create an instance
        const React = require('react');
        console.log('[DEBUG_LOG] React imported successfully');

        try {
            const element = React.createElement(App);
            console.log('[DEBUG_LOG] ✅ App component can be instantiated');
        } catch (instantiationError) {
            console.log('[DEBUG_LOG] ❌ App component instantiation failed:', instantiationError.message);
        }
    } else {
        console.log('[DEBUG_LOG] ❌ App component is not a valid function');
    }

} catch (error) {
    console.log('[DEBUG_LOG] ❌ App import failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] App import test completed');
