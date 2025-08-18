console.log('[DEBUG_LOG] === WHITE SCREEN ISSUE TEST ===');

// Test 1: Check if all required modules can be imported
console.log('[DEBUG_LOG] Test 1: Checking module imports...');

try {
    console.log('[DEBUG_LOG] Testing AppComponent import...');
    const AppComponent = require('./AppComponent').default;
    console.log('[DEBUG_LOG] ✅ AppComponent imported successfully');

    console.log('[DEBUG_LOG] Testing HybridMainScreen import...');
    const HybridMainScreen = require('./src/features/welcome/screens/HybridMainScreen').default;
    console.log('[DEBUG_LOG] ✅ HybridMainScreen imported successfully');

    console.log('[DEBUG_LOG] Testing AuthContext import...');
    const {AuthProvider} = require('./src/contexts/AuthContext');
    console.log('[DEBUG_LOG] ✅ AuthContext imported successfully');

    console.log('[DEBUG_LOG] Testing AppNavigator import...');
    const AppNavigator = require('./src/navigation/AppNavigator').default;
    console.log('[DEBUG_LOG] ✅ AppNavigator imported successfully');

} catch (error) {
    console.log('[DEBUG_LOG] ❌ Module import failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

// Test 2: Check component dependencies
console.log('[DEBUG_LOG] Test 2: Checking HybridMainScreen dependencies...');

try {
    const StorytellingSection = require('./src/features/welcome/components/StorytellingSection').default;
    console.log('[DEBUG_LOG] ✅ StorytellingSection imported successfully');

    const FeatureDashboardSection = require('./src/features/welcome/components/FeatureDashboardSection').default;
    console.log('[DEBUG_LOG] ✅ FeatureDashboardSection imported successfully');

    const ConversionSection = require('./src/features/welcome/components/ConversionSection').default;
    console.log('[DEBUG_LOG] ✅ ConversionSection imported successfully');

    const Header = require('./src/features/welcome/components/Header').default;
    console.log('[DEBUG_LOG] ✅ Header imported successfully');

} catch (error) {
    console.log('[DEBUG_LOG] ❌ Component dependency import failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] === WHITE SCREEN ISSUE TEST COMPLETED ===');
