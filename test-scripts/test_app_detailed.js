console.log('[DEBUG_LOG] Detailed App component analysis...');

try {
    console.log('[DEBUG_LOG] Testing different import methods...');

    // Method 1: require with .default
    console.log('[DEBUG_LOG] Method 1: require("./App").default');
    const App1 = require('./App').default;
    console.log('[DEBUG_LOG] Result:', typeof App1, App1 ? 'exists' : 'undefined/null');

    // Method 2: require without .default
    console.log('[DEBUG_LOG] Method 2: require("./App")');
    const App2 = require('./App');
    console.log('[DEBUG_LOG] Result type:', typeof App2);
    console.log('[DEBUG_LOG] Result keys:', Object.keys(App2 || {}));
    console.log('[DEBUG_LOG] Has default property:', 'default' in (App2 || {}));

    // Method 3: Try to access the module directly
    console.log('[DEBUG_LOG] Method 3: Full module analysis');
    const AppModule = require('./App');
    console.log('[DEBUG_LOG] Module type:', typeof AppModule);
    console.log('[DEBUG_LOG] Module keys:', Object.keys(AppModule || {}));

    if (AppModule) {
        for (const key of Object.keys(AppModule)) {
            console.log(`[DEBUG_LOG] AppModule.${key}:`, typeof AppModule[key]);
        }
    }

    // Method 4: Try TypeScript extension
    console.log('[DEBUG_LOG] Method 4: require("./App.tsx")');
    try {
        const App4 = require('./App.tsx');
        console.log('[DEBUG_LOG] .tsx import type:', typeof App4);
        console.log('[DEBUG_LOG] .tsx import keys:', Object.keys(App4 || {}));
    } catch (tsxError) {
        console.log('[DEBUG_LOG] .tsx import failed:', tsxError.message);
    }

} catch (error) {
    console.log('[DEBUG_LOG] ❌ Analysis failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] Detailed analysis completed');
