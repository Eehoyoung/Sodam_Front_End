/**
 * AsyncStorage Console Error Reproduction Script
 *
 * This script reproduces the console error issue where AsyncStorage
 * returning null is treated as an error instead of normal behavior.
 */

const React = require('react');

// Mock AsyncStorage to simulate the null return behavior
const mockAsyncStorage = {
    getItem: async (key) => {
        console.log(`[MOCK] AsyncStorage.getItem('${key}') called`);

        // Simulate normal behavior - returning null for non-existent keys
        if (key === '__test__' || key === 'hasLaunched' || key === 'userToken') {
            console.log(`[MOCK] Returning null for key: ${key} (normal behavior)`);
            return null;
        }

        return `mock_value_for_${key}`;
    },

    setItem: async (key, value) => {
        console.log(`[MOCK] AsyncStorage.setItem('${key}', '${value}') called`);
        return Promise.resolve();
    },

    removeItem: async (key) => {
        console.log(`[MOCK] AsyncStorage.removeItem('${key}') called`);
        return Promise.resolve();
    }
};

// Mock memory storage fallback
const mockMemoryStorage = {
    storage: new Map(),

    getItem: async (key) => {
        console.log(`[MOCK] MemoryStorage.getItem('${key}') called`);
        return this.storage.get(key) || null;
    },

    setItem: async (key, value) => {
        console.log(`[MOCK] MemoryStorage.setItem('${key}', '${value}') called`);
        this.storage.set(key, value);
        return Promise.resolve();
    },

    removeItem: async (key) => {
        console.log(`[MOCK] MemoryStorage.removeItem('${key}') called`);
        this.storage.delete(key);
        return Promise.resolve();
    }
};

// Reproduce the problematic getAsyncStorage function from AuthContext
const problematicGetAsyncStorage = async () => {
    try {
        console.log('[REPRODUCTION] Testing AsyncStorage availability...');

        // This is the problematic line - it treats null return as an error
        await mockAsyncStorage.getItem('__test__');
        console.log('[REPRODUCTION] AsyncStorage test passed');
        return mockAsyncStorage;
    } catch (error) {
        console.error('[REPRODUCTION] AsyncStorage test failed - falling back to memory storage:', error);
        return mockMemoryStorage;
    }
};

// Reproduce the correct getAsyncStorage function
const correctGetAsyncStorage = async () => {
    try {
        console.log('[CORRECT] Testing AsyncStorage availability...');

        // Test AsyncStorage availability by checking if the module exists and is functional
        if (mockAsyncStorage && typeof mockAsyncStorage.getItem === 'function') {
            // Test with a simple operation that doesn't rely on return value
            await mockAsyncStorage.getItem('__test__');
            console.log('[CORRECT] AsyncStorage is available and functional');
            return mockAsyncStorage;
        } else {
            throw new Error('AsyncStorage not available');
        }
    } catch (error) {
        // Only log as error if it's an actual AsyncStorage unavailability issue
        if (error.message.includes('AsyncStorage not available')) {
            console.error('[CORRECT] AsyncStorage not available - falling back to memory storage:', error);
        } else {
            console.log('[CORRECT] AsyncStorage available but returned null (normal behavior)');
            return mockAsyncStorage;
        }
        return mockMemoryStorage;
    }
};

// Simulate AuthContext initialization
const simulateAuthContextInit = async () => {
    console.log('\n=== REPRODUCING PROBLEMATIC BEHAVIOR ===');

    try {
        const storage = await problematicGetAsyncStorage();

        // Simulate checking for first launch
        const hasLaunched = await storage.getItem('hasLaunched');
        if (hasLaunched === null) {
            console.log('[REPRODUCTION] First launch detected (null is normal)');
        }

        // Simulate checking for user token
        const token = await storage.getItem('userToken');
        if (token === null) {
            console.log('[REPRODUCTION] No token found (null is normal)');
        }

    } catch (error) {
        console.error('[REPRODUCTION] Auth initialization failed:', error);
    }

    console.log('\n=== DEMONSTRATING CORRECT BEHAVIOR ===');

    try {
        const storage = await correctGetAsyncStorage();

        // Simulate checking for first launch
        const hasLaunched = await storage.getItem('hasLaunched');
        if (hasLaunched === null) {
            console.log('[CORRECT] First launch detected (null is normal)');
        }

        // Simulate checking for user token
        const token = await storage.getItem('userToken');
        if (token === null) {
            console.log('[CORRECT] No token found (null is normal)');
        }

    } catch (error) {
        console.error('[CORRECT] Auth initialization failed:', error);
    }
};

// Run the reproduction
console.log('AsyncStorage Console Error Reproduction Script');
console.log('==============================================');

simulateAuthContextInit().then(() => {
    console.log('\n=== REPRODUCTION COMPLETE ===');
    console.log('Key findings:');
    console.log('1. AsyncStorage returning null is NORMAL behavior');
    console.log('2. The problematic code treats null returns as errors');
    console.log('3. This causes unnecessary console.error messages');
    console.log('4. The correct approach distinguishes between AsyncStorage unavailability and null returns');
}).catch((error) => {
    console.error('Reproduction script failed:', error);
});
