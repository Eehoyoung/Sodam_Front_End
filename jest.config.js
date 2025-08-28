module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/out/'
    ],
    collectCoverageFrom: [
        'src/components/ErrorBoundary.tsx',
        'src/utils/safeLogger.ts',
        'src/utils/errorMonitoring.ts',
        'src/navigation/config.ts',
        'App.tsx'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^\\./src/contexts/AuthContext$': '<rootDir>/src/tests/mocks/AuthContext.mock.ts'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@expo/vector-icons|react-native-chart-kit|react-native-reanimated|react-native-gesture-handler)/)'
    ],
    testEnvironment: 'node',
    verbose: true
};
