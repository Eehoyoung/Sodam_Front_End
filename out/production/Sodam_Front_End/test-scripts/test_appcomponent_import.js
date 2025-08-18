console.log('[DEBUG_LOG] Testing AppComponent import...');

try {
    console.log('[DEBUG_LOG] Attempting to import AppComponent...');
    const App = require('./AppComponent').default;

    console.log('[DEBUG_LOG] AppComponent import successful, type:', typeof App);
    console.log('[DEBUG_LOG] AppComponent:', App ? 'exists' : 'null/undefined');

    if (App && typeof App === 'function') {
        console.log('[DEBUG_LOG] ✅ AppComponent is valid React component');

        // Test if we can create an instance
        const React = require('react');
        console.log('[DEBUG_LOG] React imported successfully');

        try {
            const element = React.createElement(App);
            console.log('[DEBUG_LOG] ✅ AppComponent can be instantiated');
            console.log('[DEBUG_LOG] ✅ Registration should work now!');
        } catch (instantiationError) {
            console.log('[DEBUG_LOG] ❌ AppComponent instantiation failed:', instantiationError.message);
        }
    } else {
        console.log('[DEBUG_LOG] ❌ AppComponent is not a valid function');
    }

} catch (error) {
    console.log('[DEBUG_LOG] ❌ AppComponent import failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] AppComponent import test completed');
