console.log('[DEBUG_LOG] Testing minimal index.js...');

try {
    console.log('[DEBUG_LOG] Attempting to load index.js...');

    // Mock AppRegistry for testing
    const mockAppRegistry = {
        registerComponent: (name, componentProvider) => {
            console.log('[DEBUG_LOG] ✅ AppRegistry.registerComponent called with:', name);
            console.log('[DEBUG_LOG] Component provider type:', typeof componentProvider);

            try {
                const component = componentProvider();
                console.log('[DEBUG_LOG] ✅ Component provider executed successfully');
                console.log('[DEBUG_LOG] Component type:', typeof component);
                return true;
            } catch (error) {
                console.log('[DEBUG_LOG] ❌ Component provider failed:', error.message);
                return false;
            }
        }
    };

    // Mock react-native module
    require.cache[require.resolve('react-native')] = {
        exports: {
            AppRegistry: mockAppRegistry
        }
    };

    // Load the index.js file
    require('./index.js');

    console.log('[DEBUG_LOG] ✅ index.js loaded successfully!');

} catch (error) {
    console.log('[DEBUG_LOG] ❌ index.js loading failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] Minimal index.js test completed');
