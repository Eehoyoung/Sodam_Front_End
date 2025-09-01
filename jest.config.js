module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/out/',
        '<rootDir>/android/',
        '<rootDir>/ios/',
        '<rootDir>/node_modules/',
    ],
    // 개발 단계 커버리지 (선별적)
    collectCoverageFrom: [
        'src/components/ErrorBoundary.tsx',
        'src/utils/safeLogger.ts',
        'src/utils/errorMonitoring.ts',
        'src/navigation/config.ts',
        'App.tsx',
        // 추가: 핵심 유틸리티들
        'src/utils/formatters.ts',
        'src/hooks/useNFC.ts',
        'src/services/attendanceService.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 70, // 개발 단계에서는 낮춤
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
        '^\\./src/contexts/AuthContext$': '<rootDir>/src/tests/mocks/AuthContext.mock.ts'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@expo/vector-icons|react-native-chart-kit|react-native-reanimated|react-native-nfc-manager)/)'
    ],
    testEnvironment: 'node',
    verbose: false, // 개발 중에는 간소화
    // 성능 최적화
    maxWorkers: '50%',
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',
    // 개발 편의성 (watchPlugins는 패키지 설치 후 활성화)
    // watchPlugins: [
    //     'jest-watch-typeahead/filename',
    //     'jest-watch-typeahead/testname',
    // ],
};
