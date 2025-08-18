/**
 * Test script to verify the current state of useJSISafeDimensions hook
 * and check for any actual ReferenceError issues
 */

const fs = require('fs');
const path = require('path');

console.log('[DEBUG_LOG] === DIMENSIONS ERROR VERIFICATION TEST ===');
console.log('[DEBUG_LOG] Testing current useJSISafeDimensions implementation...');

// Test 1: Check if the hook file exists and can be read
const hookPath = path.join(__dirname, 'src', 'hooks', 'useJSISafeDimensions.ts');
console.log('[DEBUG_LOG] Hook file path:', hookPath);

try {
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  console.log('[DEBUG_LOG] ✅ Hook file exists and readable');

  // Test 2: Check for the "fixed" pattern (rawDimensions usage)
  hasRawDimensions = hookContent.includes('const rawDimensions = useMemo');
  hasProperDependencies = hookContent.includes('[rawDimensions.width, rawDimensions.height]');

  console.log('[DEBUG_LOG] Has rawDimensions pattern:', hasRawDimensions);
  console.log('[DEBUG_LOG] Has proper dependencies:', hasProperDependencies);

  if (hasRawDimensions && hasProperDependencies) {
    console.log('[DEBUG_LOG] ✅ The documented fix IS actually implemented in the code');
  } else {
    console.log('[DEBUG_LOG] ❌ The documented fix is NOT implemented in the code');
  }

  // Test 3: Check for any problematic patterns
  const hasCircularDependency = hookContent.includes('dimensions.screenWidth') ||
                                hookContent.includes('dimensions.screenHeight');

  console.log('[DEBUG_LOG] Has potential circular dependency:', hasCircularDependency);

} catch (error) {
  console.log('[DEBUG_LOG] ❌ Error reading hook file:', error.message);
}

// Test 4: Check recent logcat files for actual ReferenceError
console.log('[DEBUG_LOG] Checking recent logcat files for ReferenceError...');

const logcatFiles = [
  'Medium-Phone-Android-16_2025-07-29_020333.logcat',
  'Medium-Phone-Android-16_2025-07-28_025651.logcat',
  'Medium-Phone-Android-16_2025-07-28_021325.logcat'
];

let foundReferenceError = false;
let foundJSIAssertion = false;
let hasRawDimensions = false;
let hasProperDependencies = false;

logcatFiles.forEach(filename => {
  const logPath = path.join(__dirname, filename);
  if (fs.existsSync(logPath)) {
    try {
      const logContent = fs.readFileSync(logPath, 'utf8');

      if (logContent.includes('ReferenceError')) {
        console.log('[DEBUG_LOG] ❌ Found ReferenceError in:', filename);
        foundReferenceError = true;
      }

      if (logContent.includes('assertion "isHostFunction(runtime)" failed')) {
        console.log('[DEBUG_LOG] ❌ Found JSI assertion failure in:', filename);
        foundJSIAssertion = true;
      }

    } catch (error) {
      console.log('[DEBUG_LOG] Could not read logcat file:', filename);
    }
  }
});

console.log('[DEBUG_LOG] === VERIFICATION RESULTS ===');
console.log('[DEBUG_LOG] ReferenceError found in recent logs:', foundReferenceError);
console.log('[DEBUG_LOG] JSI assertion failure found in recent logs:', foundJSIAssertion);

// Test 5: Check components that use the hook
console.log('[DEBUG_LOG] Checking components that use useJSISafeDimensions...');

const componentsToCheck = [
  'src/features/welcome/components/demos/StoreManagementDemo.tsx',
  'src/features/welcome/components/demos/SalaryCalculatorDemo.tsx',
  'src/features/welcome/components/demos/QRCodeDemo.tsx'
];

componentsToCheck.forEach(componentPath => {
  const fullPath = path.join(__dirname, componentPath);
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const usesHook = content.includes('useJSISafeDimensions');
      const hasProperImport = content.includes("from '../../../../hooks/useJSISafeDimensions'");

      console.log(`[DEBUG_LOG] ${componentPath}:`);
      console.log(`[DEBUG_LOG]   - Uses hook: ${usesHook}`);
      console.log(`[DEBUG_LOG]   - Has proper import: ${hasProperImport}`);

    } catch (error) {
      console.log(`[DEBUG_LOG] Could not read component: ${componentPath}`);
    }
  } else {
    console.log(`[DEBUG_LOG] Component not found: ${componentPath}`);
  }
});

console.log('[DEBUG_LOG] === CONCLUSION ===');

if (!foundReferenceError && hasRawDimensions && hasProperDependencies) {
  console.log('[DEBUG_LOG] 🎯 FINDING: The dimensions ReferenceError appears to be ACTUALLY RESOLVED');
  console.log('[DEBUG_LOG] 🎯 The fix documented in the report WAS implemented correctly');
  console.log('[DEBUG_LOG] 🎯 No ReferenceError found in recent logs');
} else if (foundJSIAssertion) {
  console.log('[DEBUG_LOG] 🎯 FINDING: The real issue is JSI assertion failure, NOT ReferenceError');
  console.log('[DEBUG_LOG] 🎯 The resolution report may have been documenting the wrong issue');
}

console.log('[DEBUG_LOG] === TEST COMPLETE ===');
