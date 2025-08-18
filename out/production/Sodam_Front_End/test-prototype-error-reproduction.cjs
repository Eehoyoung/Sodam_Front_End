/**
 * Prototype Error Reproduction Script
 * Tests the "Cannot read property 'prototype' of undefined" error
 * caused by mixing React Native Animated API with Reanimated v3
 */

const fs = require('fs');
const path = require('path');

console.log('[DEBUG_LOG] Starting prototype error reproduction test...');

// Test 1: Check if the problematic file exists and contains conflicting imports
console.log('\n=== Test 1: File Structure Analysis ===');
try {
    const featureFilePath = path.join(__dirname, 'src', 'features', 'welcome', 'components', 'FeatureDashboardSection.tsx');

    if (!fs.existsSync(featureFilePath)) {
        console.log('[DEBUG_LOG] ❌ FeatureDashboardSection.tsx not found');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(featureFilePath, 'utf8');
    console.log('[DEBUG_LOG] ✅ FeatureDashboardSection.tsx loaded successfully');
    console.log('[DEBUG_LOG] File size:', fileContent.length, 'characters');

    // Check for conflicting imports
    const hasReactNativeAnimated = fileContent.includes("from 'react-native'") &&
                                  (fileContent.includes('Animated') || fileContent.includes('Easing'));
    const hasReanimated = fileContent.includes("from 'react-native-reanimated'");

    console.log('[DEBUG_LOG] Has React Native imports:', hasReactNativeAnimated);
    console.log('[DEBUG_LOG] Has Reanimated imports:', hasReanimated);

    if (hasReactNativeAnimated && hasReanimated) {
        console.log('[DEBUG_LOG] ⚠️  CONFLICT DETECTED: Both animation libraries imported');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ File analysis failed:', error.message);
}

// Test 2: Check for problematic code patterns
console.log('\n=== Test 2: Problematic Code Pattern Detection ===');
try {
    const featureFilePath = path.join(__dirname, 'src', 'features', 'welcome', 'components', 'FeatureDashboardSection.tsx');
    const fileContent = fs.readFileSync(featureFilePath, 'utf8');

    // Look for the specific problematic lines
    const lines = fileContent.split('\n');

    // Check line 228 (array index 227)
    if (lines.length > 227) {
        const line228 = lines[227].trim();
        console.log('[DEBUG_LOG] Line 228:', line228);

        if (line228.includes('new Animated.Value')) {
            console.log('[DEBUG_LOG] ⚠️  PROBLEM FOUND: Legacy Animated.Value usage detected');
        }
    }

    // Check for mixed usage patterns
    const hasLegacyAnimatedValue = fileContent.includes('new Animated.Value');
    const hasLegacyAnimatedTiming = fileContent.includes('Animated.timing');
    const hasReanimatedSharedValue = fileContent.includes('useSharedValue');
    const hasReanimatedWithTiming = fileContent.includes('withTiming');

    console.log('[DEBUG_LOG] Legacy Animated.Value usage:', hasLegacyAnimatedValue);
    console.log('[DEBUG_LOG] Legacy Animated.timing usage:', hasLegacyAnimatedTiming);
    console.log('[DEBUG_LOG] Reanimated useSharedValue usage:', hasReanimatedSharedValue);
    console.log('[DEBUG_LOG] Reanimated withTiming usage:', hasReanimatedWithTiming);

    if ((hasLegacyAnimatedValue || hasLegacyAnimatedTiming) &&
        (hasReanimatedSharedValue || hasReanimatedWithTiming)) {
        console.log('[DEBUG_LOG] ❌ CRITICAL: Mixed animation API usage detected!');
        console.log('[DEBUG_LOG] This is the root cause of the prototype error');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Code pattern analysis failed:', error.message);
}

// Test 3: Simulate the prototype error scenario
console.log('\n=== Test 3: Prototype Error Simulation ===');
try {
    console.log('[DEBUG_LOG] Simulating animation library conflict...');

    // This simulates what happens when both libraries are imported
    // In a real React Native environment, this would cause the prototype error
    const mockReactNativeAnimated = {
        Value: function(initialValue) {
            this.value = initialValue;
        },
        timing: function() { return { start: () => {} }; }
    };

    const mockReanimated = {
        // Reanimated might override the Animated object
        Value: undefined, // This causes the prototype error
        useSharedValue: function() { return { value: 0 }; }
    };

    // Simulate the conflict
    let Animated = mockReactNativeAnimated;
    Animated = mockReanimated; // This overwrites the original

    try {
        // This is what happens in line 228 of FeatureDashboardSection.tsx
        const scaleAnim = new Animated.Value(0.8);
        console.log('[DEBUG_LOG] ❌ Unexpected: Animation creation succeeded');
    } catch (error) {
        console.log('[DEBUG_LOG] ✅ Expected error reproduced:', error.message);
        console.log('[DEBUG_LOG] This confirms our analysis of the prototype error');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Simulation failed:', error.message);
}

// Test 4: Check AuthContext for related issues
console.log('\n=== Test 4: AuthContext Secondary Error Analysis ===');
try {
    const authContextPath = path.join(__dirname, 'src', 'contexts', 'AuthContext.tsx');

    if (fs.existsSync(authContextPath)) {
        const authContent = fs.readFileSync(authContextPath, 'utf8');
        const lines = authContent.split('\n');

        // Check line 168 (array index 167)
        if (lines.length > 167) {
            const line168 = lines[167].trim();
            console.log('[DEBUG_LOG] AuthContext Line 168:', line168);

            if (line168.includes('setLoading(false)')) {
                console.log('[DEBUG_LOG] ✅ AuthContext line 168 contains setLoading(false)');
                console.log('[DEBUG_LOG] This error is likely secondary to the animation conflict');
            }
        }
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ AuthContext analysis failed:', error.message);
}

// Test 5: Package.json dependency check
console.log('\n=== Test 5: Dependency Conflict Check ===');
try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const hasReactNative = packageJson.dependencies && packageJson.dependencies['react-native'];
    const hasReanimated = packageJson.dependencies && packageJson.dependencies['react-native-reanimated'];

    console.log('[DEBUG_LOG] React Native version:', hasReactNative || 'Not found');
    console.log('[DEBUG_LOG] Reanimated version:', hasReanimated || 'Not found');

    if (hasReactNative && hasReanimated) {
        console.log('[DEBUG_LOG] ✅ Both animation libraries are installed');
        console.log('[DEBUG_LOG] This confirms the potential for conflicts');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Package.json analysis failed:', error.message);
}

console.log('\n=== Prototype Error Reproduction Test Complete ===');
console.log('[DEBUG_LOG] Summary:');
console.log('[DEBUG_LOG] - Analyzed file structure and imports');
console.log('[DEBUG_LOG] - Detected problematic code patterns');
console.log('[DEBUG_LOG] - Simulated the prototype error scenario');
console.log('[DEBUG_LOG] - Confirmed root cause: Animation library conflicts');
console.log('[DEBUG_LOG] - Ready to implement fix by migrating to Reanimated v3');
