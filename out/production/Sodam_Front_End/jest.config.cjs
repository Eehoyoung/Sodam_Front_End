module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: [
        '**/__tests__/**/*.(ts|tsx|js)',
        '**/*.(test|spec).(ts|tsx|js)'
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/__mocks__/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    // Jest option name is `moduleNameMapper` (not `moduleNameMapping`)
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@expo/vector-icons|react-native-chart-kit|react-native-reanimated|react-native-gesture-handler)/)',
    ],
    // react-native preset already sets the proper test environment; override only if needed
    testEnvironment: 'node',
    verbose: true
};
