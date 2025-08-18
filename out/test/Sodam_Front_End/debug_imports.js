console.log('[DEBUG_LOG] === IMPORT DEBUG TEST ===');

// Test AppNavigator imports
console.log('[DEBUG_LOG] Testing AppNavigator imports...');

try {
    console.log('[DEBUG_LOG] Testing AuthNavigator import...');
    const AuthNavigator = require('./src/navigation/AuthNavigator').default;
    console.log('[DEBUG_LOG] AuthNavigator:', typeof AuthNavigator, AuthNavigator ? '✅' : '❌');

    console.log('[DEBUG_LOG] Testing HomeNavigator import...');
    const HomeNavigator = require('./src/navigation/HomeNavigator').default;
    console.log('[DEBUG_LOG] HomeNavigator:', typeof HomeNavigator, HomeNavigator ? '✅' : '❌');

    console.log('[DEBUG_LOG] Testing HybridMainScreen import...');
    const HybridMainScreen = require('./src/features/welcome/screens/HybridMainScreen').default;
    console.log('[DEBUG_LOG] HybridMainScreen:', typeof HybridMainScreen, HybridMainScreen ? '✅' : '❌');

} catch (error) {
    console.log('[DEBUG_LOG] ❌ AppNavigator import test failed:', error.message);
}

// Test HomeNavigator imports
console.log('[DEBUG_LOG] Testing HomeNavigator screen imports...');

try {
    console.log('[DEBUG_LOG] Testing HomeScreen import...');
    const HomeScreen = require('./src/features/home/screens/HomeScreen').default;
    console.log('[DEBUG_LOG] HomeScreen:', typeof HomeScreen, HomeScreen ? '✅' : '❌');

    console.log('[DEBUG_LOG] Testing Header import...');
    const Header = require('./src/common/components/layout/Header').default;
    console.log('[DEBUG_LOG] Header:', typeof Header, Header ? '✅' : '❌');

} catch (error) {
    console.log('[DEBUG_LOG] ❌ HomeNavigator screen import test failed:', error.message);
    console.log('[DEBUG_LOG] Error stack:', error.stack);
}

console.log('[DEBUG_LOG] === IMPORT DEBUG TEST COMPLETED ===');
