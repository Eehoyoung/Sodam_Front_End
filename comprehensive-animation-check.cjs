/**
 * Comprehensive Animation Check Script
 * Verifies that all React Native animation issues have been resolved
 * Checks for mixed useNativeDriver patterns across the entire project
 */

console.log('[DEBUG_LOG] Starting comprehensive animation check...');

const fs = require('fs');
const path = require('path');

// Test results tracking
let totalFiles = 0;
let safeFiles = 0;
let issuesFound = [];

// Function to recursively search for TypeScript/JavaScript files
function findSourceFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules, android build outputs, and other non-source directories
            if (!item.includes('node_modules') &&
                !item.includes('.git') &&
                !item.includes('android') &&
                !item.includes('ios') &&
                !item.includes('__tests__') &&
                !item.includes('docs')) {
                findSourceFiles(fullPath, files);
            }
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Function to analyze a file for animation issues
function analyzeFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Skip files that don't contain animations
        if (!content.includes('useNativeDriver') && !content.includes('Animated.')) {
            return {safe: true, issues: []};
        }

        totalFiles++;
        const issues = [];

        // Check for mixed driver patterns in parallel animations
        let inParallelBlock = false;
        let parallelStartLine = 0;
        let hasNativeDriver = false;
        let hasJSDriver = false;
        let parallelAnimations = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detect start of parallel animation block
            if (line.includes('Animated.parallel([')) {
                inParallelBlock = true;
                parallelStartLine = i + 1;
                hasNativeDriver = false;
                hasJSDriver = false;
                parallelAnimations = [];
            }

            if (inParallelBlock) {
                // Track animations in the parallel block
                if (line.includes('Animated.timing(') || line.includes('Animated.spring(')) {
                    parallelAnimations.push(line);
                }

                // Check driver types
                if (line.includes('useNativeDriver: true')) {
                    hasNativeDriver = true;
                }
                if (line.includes('useNativeDriver: false')) {
                    hasJSDriver = true;
                }

                // Detect end of parallel animation block
                if (line.includes(']).start()')) {
                    inParallelBlock = false;

                    // Check for mixed drivers
                    if (hasNativeDriver && hasJSDriver) {
                        issues.push({
                            type: 'MIXED_DRIVER_PARALLEL',
                            line: parallelStartLine,
                            description: 'Mixed useNativeDriver in parallel animation',
                            animations: parallelAnimations
                        });
                    }
                }
            }
        }

        // Check for potential animation value reuse issues
        const animatedValues = [];
        const animatedValueUsage = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Find Animated.Value declarations
            if (line.includes('new Animated.Value(')) {
                const match = line.match(/(\w+)\s*=.*new Animated\.Value\(/);
                if (match) {
                    animatedValues.push(match[1]);
                    animatedValueUsage[match[1]] = [];
                }
            }

            // Track usage of animated values
            animatedValues.forEach(valueName => {
                if (line.includes(valueName) && line.includes('useNativeDriver')) {
                    const isNative = line.includes('useNativeDriver: true');
                    animatedValueUsage[valueName].push({
                        line: i + 1,
                        native: isNative,
                        content: line.trim()
                    });
                }
            });
        }

        // Check for animated value reuse with different drivers
        Object.keys(animatedValueUsage).forEach(valueName => {
            const usages = animatedValueUsage[valueName];
            if (usages.length > 1) {
                const nativeUsages = usages.filter(u => u.native);
                const jsUsages = usages.filter(u => !u.native);

                if (nativeUsages.length > 0 && jsUsages.length > 0) {
                    issues.push({
                        type: 'ANIMATED_VALUE_REUSE',
                        description: `Animated value '${valueName}' used with both native and JS drivers`,
                        usages: usages
                    });
                }
            }
        });

        if (issues.length === 0) {
            safeFiles++;
        }

        return {safe: issues.length === 0, issues};

    } catch (error) {
        return {safe: false, issues: [{type: 'FILE_READ_ERROR', description: error.message}]};
    }
}

// Main analysis
console.log('\n=== Comprehensive Animation Analysis ===');

try {
    const projectRoot = __dirname;
    const sourceFiles = findSourceFiles(path.join(projectRoot, 'src'));

    console.log(`[DEBUG_LOG] Found ${sourceFiles.length} source files to analyze`);

    // Analyze each file
    sourceFiles.forEach(filePath => {
        const relativePath = path.relative(projectRoot, filePath);
        const result = analyzeFile(filePath);

        if (!result.safe) {
            issuesFound.push({
                file: relativePath,
                issues: result.issues
            });
            console.log(`[DEBUG_LOG] ⚠️  Issues found in ${relativePath}:`);
            result.issues.forEach(issue => {
                console.log(`[DEBUG_LOG]   - ${issue.type}: ${issue.description}`);
                if (issue.line) {
                    console.log(`[DEBUG_LOG]     Line ${issue.line}`);
                }
            });
        } else if (result.issues !== undefined) {
            console.log(`[DEBUG_LOG] ✅ ${relativePath}: Safe`);
        }
    });

    // Summary
    console.log('\n=== Analysis Summary ===');
    console.log(`[DEBUG_LOG] Total files with animations: ${totalFiles}`);
    console.log(`[DEBUG_LOG] Safe files: ${safeFiles}`);
    console.log(`[DEBUG_LOG] Files with issues: ${issuesFound.length}`);

    if (issuesFound.length === 0) {
        console.log('[DEBUG_LOG] 🎉 NO ANIMATION ISSUES FOUND!');
        console.log('[DEBUG_LOG] All animation code is properly separated and safe.');
    } else {
        console.log('[DEBUG_LOG] ❌ Animation issues still exist:');
        issuesFound.forEach(fileIssue => {
            console.log(`[DEBUG_LOG] - ${fileIssue.file}: ${fileIssue.issues.length} issue(s)`);
        });
    }

    // Specific checks for known components
    console.log('\n=== Known Component Status ===');
    const knownComponents = [
        'src/features/welcome/components/FeatureDashboardSection.tsx',
        'src/features/welcome/components/demos/QRCodeDemo.tsx',
        'src/features/welcome/components/demos/SalaryCalculatorDemo.tsx',
        'src/features/welcome/components/demos/StoreManagementDemo.tsx',
        'src/features/welcome/components/ConversionSection.tsx',
        'src/features/welcome/components/StorytellingSection.tsx',
        'src/common/components/feedback/Toast.tsx',
        'src/common/components/feedback/Modal.tsx'
    ];

    knownComponents.forEach(component => {
        const fullPath = path.join(projectRoot, component);
        if (fs.existsSync(fullPath)) {
            const hasIssues = issuesFound.some(issue => issue.file === component);
            console.log(`[DEBUG_LOG] ${component}: ${hasIssues ? '❌ Has Issues' : '✅ Safe'}`);
        } else {
            console.log(`[DEBUG_LOG] ${component}: ⚠️  File not found`);
        }
    });

} catch (error) {
    console.error('[DEBUG_LOG] ❌ Analysis failed:', error.message);
}

console.log('\n=== Comprehensive Animation Check Complete ===');
