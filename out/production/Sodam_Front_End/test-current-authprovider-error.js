/**
 * Test script to reproduce the current "Cannot read property 'authProvider' of undefined" error
 * This will help us understand if the error still exists and where it's coming from
 */

console.log('[DEBUG_LOG] Testing current AuthProvider error state...');

// Test 1: Check if AuthContext can be imported without errors
console.log('\n=== Test 1: AuthContext Import Test ===');
try {
    const {AuthProvider, useAuth} = require('./src/contexts/AuthContext');
    console.log('[DEBUG_LOG] ✅ AuthContext imported successfully');
    console.log('[DEBUG_LOG] AuthProvider type:', typeof AuthProvider);
    console.log('[DEBUG_LOG] useAuth type:', typeof useAuth);
} catch (error) {
    console.error('[DEBUG_LOG] ❌ AuthContext import failed:', error.message);
    console.error('[DEBUG_LOG] Stack trace:', error.stack);
}

// Test 2: Test useAuth hook outside of provider context
console.log('\n=== Test 2: useAuth Hook Outside Provider ===');
try {
    // Mock React to simulate missing provider context
    const React = require('react');
    const originalUseContext = React.useContext;

    // Simulate undefined context (missing provider)
    React.useContext = () => undefined;

    const {useAuth} = require('./src/contexts/AuthContext');
    const authResult = useAuth();

    console.log('[DEBUG_LOG] useAuth result when context is undefined:');
    console.log('[DEBUG_LOG] - isAuthenticated:', authResult.isAuthenticated);
    console.log('[DEBUG_LOG] - user:', authResult.user);
    console.log('[DEBUG_LOG] - loading:', authResult.loading);
    console.log('[DEBUG_LOG] - isFirstLaunch:', authResult.isFirstLaunch);

    // Test the specific property that was causing the error
    console.log('[DEBUG_LOG] Testing authProvider property access...');
    const authProvider = authResult.authProvider;
    console.log('[DEBUG_LOG] - authProvider:', authProvider);

    // Test other undefined property access
    const nonExistentProp = authResult.nonExistentProp;
    console.log('[DEBUG_LOG] - nonExistentProp:', nonExistentProp);

    // Restore original useContext
    React.useContext = originalUseContext;

    console.log('[DEBUG_LOG] ✅ Test 2 completed without errors');

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 2 failed with error:', error.message);
    console.error('[DEBUG_LOG] Stack trace:', error.stack);

    // Check if this is the specific error we're looking for
    if (error.message.includes("Cannot read property 'authProvider' of undefined")) {
        console.error('[DEBUG_LOG] 🎯 FOUND THE ERROR: This is the authProvider error!');
    }
}

// Test 3: Test App.tsx import and structure
console.log('\n=== Test 3: App.tsx Structure Test ===');
try {
    const fs = require('fs');
    const path = require('path');

    const appPath = path.join(__dirname, 'App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf8');

    // Check if AuthProvider is properly imported and used
    const hasAuthProviderImport = appContent.includes('import { AuthProvider }');
    const hasAuthProviderUsage = appContent.includes('<AuthProvider>');

    console.log('[DEBUG_LOG] App.tsx analysis:');
    console.log('[DEBUG_LOG] - Has AuthProvider import:', hasAuthProviderImport);
    console.log('[DEBUG_LOG] - Has AuthProvider usage:', hasAuthProviderUsage);

    // Check line 36 (mentioned in error)
    const lines = appContent.split('\n');
    if (lines.length >= 36) {
        console.log('[DEBUG_LOG] - Line 36 content:', lines[35].trim());
    }

    console.log('[DEBUG_LOG] ✅ Test 3 completed');

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 3 failed:', error.message);
}

// Test 4: Check for any components that might access authProvider
console.log('\n=== Test 4: Component Analysis ===');
try {
    const fs = require('fs');
    const path = require('path');

    // Function to recursively search for authProvider usage
    function searchForAuthProvider(dir) {
        const files = fs.readdirSync(dir);
        const results = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
                results.push(...searchForAuthProvider(filePath));
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('authProvider') && !filePath.includes('test')) {
                        results.push({
                            file: filePath,
                            lines: content.split('\n').map((line, index) =>
                                line.includes('authProvider') ? {line: index + 1, content: line.trim()} : null
                            ).filter(Boolean)
                        });
                    }
                } catch (readError) {
                    // Skip files that can't be read
                }
            }
        }

        return results;
    }

    const srcPath = path.join(__dirname, 'src');
    const authProviderUsages = searchForAuthProvider(srcPath);

    console.log('[DEBUG_LOG] Found authProvider usages in src:');
    if (authProviderUsages.length === 0) {
        console.log('[DEBUG_LOG] - No authProvider property access found in src directory');
    } else {
        authProviderUsages.forEach(usage => {
            console.log('[DEBUG_LOG] - File:', usage.file);
            usage.lines.forEach(line => {
                console.log('[DEBUG_LOG]   Line', line.line + ':', line.content);
            });
        });
    }

    console.log('[DEBUG_LOG] ✅ Test 4 completed');

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 4 failed:', error.message);
}

console.log('\n=== Current AuthProvider Error Test Complete ===');
console.log('[DEBUG_LOG] Summary:');
console.log('[DEBUG_LOG] - Tested AuthContext import and structure');
console.log('[DEBUG_LOG] - Tested useAuth hook behavior with undefined context');
console.log('[DEBUG_LOG] - Analyzed App.tsx structure');
console.log('[DEBUG_LOG] - Searched for authProvider property usage in components');
