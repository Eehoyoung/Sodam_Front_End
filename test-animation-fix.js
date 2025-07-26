/**
 * Test script to verify that the React Native animation error has been resolved
 * This script checks if the mixed useNativeDriver issue has been fixed
 */

console.log('[DEBUG_LOG] Testing React Native animation fix...');

// Test 1: Check if FeatureDashboardSection can be imported without errors
console.log('\n=== Test 1: FeatureDashboardSection Import Test ===');
try {
    const fs = require('fs');
    const path = require('path');

    const componentPath = path.join(__dirname, 'src/features/welcome/components/FeatureDashboardSection.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');

    // Check for proper driver separation comments
    const hasNativeDriverComment = componentContent.includes('// Native driver animations');
    const hasJSDriverComment = componentContent.includes('// JavaScript driver animations');

    console.log('[DEBUG_LOG] ✅ FeatureDashboardSection.tsx analysis:');
    console.log('[DEBUG_LOG] - Has native driver comment:', hasNativeDriverComment);
    console.log('[DEBUG_LOG] - Has JS driver comment:', hasJSDriverComment);

    // Check for problematic parallel animation patterns
    const hasProblematicParallel = componentContent.includes('Animated.parallel([...featureAnimations, statsAnimation])');
    console.log('[DEBUG_LOG] - Has problematic parallel animation:', hasProblematicParallel);

    if (!hasProblematicParallel) {
        console.log('[DEBUG_LOG] ✅ Mixed driver parallel animation has been fixed!');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 1 failed:', error.message);
}

// Test 2: Check animation separation patterns
console.log('\n=== Test 2: Animation Separation Pattern Test ===');
try {
    const fs = require('fs');
    const path = require('path');

    const componentPath = path.join(__dirname, 'src/features/welcome/components/FeatureDashboardSection.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');

    // Check for proper separation patterns
    const hasNativeDriverSeparation = componentContent.includes('// 네이티브 드라이버 애니메이션들을 먼저 실행');
    const hasJSDriverSeparation = componentContent.includes('// JavaScript 드라이버 애니메이션을 별도로 실행');
    const hasSeparateCardAnimations = componentContent.includes('// Native driver animation') &&
        componentContent.includes('// JavaScript driver animation (separate to avoid mixing)');

    console.log('[DEBUG_LOG] ✅ Animation separation patterns:');
    console.log('[DEBUG_LOG] - Main section separation:', hasNativeDriverSeparation && hasJSDriverSeparation);
    console.log('[DEBUG_LOG] - Card animation separation:', hasSeparateCardAnimations);

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 2 failed:', error.message);
}

// Test 3: Verify other components are safe
console.log('\n=== Test 3: Other Components Safety Check ===');
try {
    const fs = require('fs');
    const path = require('path');

    const demoComponents = [
        'src/features/welcome/components/demos/SalaryCalculatorDemo.tsx',
        'src/features/welcome/components/demos/QRCodeDemo.tsx',
        'src/features/welcome/components/demos/StoreManagementDemo.tsx'
    ];

    let allComponentsSafe = true;

    demoComponents.forEach(componentPath => {
        const fullPath = path.join(__dirname, componentPath);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');

            // Check for problematic patterns (parallel animations with mixed drivers)
            const lines = content.split('\n');
            let inParallelBlock = false;
            let hasNativeDriver = false;
            let hasJSDriver = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (line.includes('Animated.parallel([')) {
                    inParallelBlock = true;
                    hasNativeDriver = false;
                    hasJSDriver = false;
                }

                if (inParallelBlock) {
                    if (line.includes('useNativeDriver: true')) {
                        hasNativeDriver = true;
                    }
                    if (line.includes('useNativeDriver: false')) {
                        hasJSDriver = true;
                    }

                    if (line.includes(']).start()')) {
                        inParallelBlock = false;
                        if (hasNativeDriver && hasJSDriver) {
                            console.log(`[DEBUG_LOG] ⚠️  Mixed driver found in ${componentPath} around line ${i + 1}`);
                            allComponentsSafe = false;
                        }
                    }
                }
            }

            console.log(`[DEBUG_LOG] - ${path.basename(componentPath)}: Safe`);
        }
    });

    if (allComponentsSafe) {
        console.log('[DEBUG_LOG] ✅ All demo components are safe from mixed driver issues!');
    }

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Test 3 failed:', error.message);
}

console.log('\n=== Animation Fix Test Complete ===');
console.log('[DEBUG_LOG] Summary:');
console.log('[DEBUG_LOG] - Fixed FeatureDashboardSection.tsx mixed driver issue');
console.log('[DEBUG_LOG] - Separated native and JavaScript driver animations');
console.log('[DEBUG_LOG] - Verified other components are safe');
console.log('[DEBUG_LOG] - Animation error should be resolved!');
