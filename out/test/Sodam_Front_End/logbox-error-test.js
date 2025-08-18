/**
 * LogBox Error Test Script
 * LogBox 무한 루프 문제 해결 확인을 위한 테스트 스크립트
 */

// React Native 환경 시뮬레이션
global.__DEV__ = true;

// Mock LogBox
const mockLogBox = {
    ignoreLogs: jest.fn(),
    ignoreAllLogs: jest.fn(),
};

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

let consoleErrorCalls = [];
let consoleWarnCalls = [];

console.error = (...args) => {
    consoleErrorCalls.push(args);
    originalConsoleError(...args);
};

console.warn = (...args) => {
    consoleWarnCalls.push(args);
    originalConsoleWarn(...args);
};

// SafeLogger 테스트
const {safeLogger} = require('../src/utils/safeLogger');

describe('LogBox Error Prevention Tests', () => {
    beforeEach(() => {
        consoleErrorCalls = [];
        consoleWarnCalls = [];
        safeLogger.reset();
    });

    afterAll(() => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
        console.log = originalConsoleLog;
    });

    test('SafeLogger should detect LogBox-related errors', () => {
        // LogBox 관련 에러 시뮬레이션
        safeLogger.error('An error was thrown when attempting to render log messages via LogBox');

        // console.error가 직접 호출되지 않고 console.warn으로 처리되어야 함
        expect(consoleErrorCalls.length).toBe(0);
        expect(consoleWarnCalls.length).toBe(1);
        expect(consoleWarnCalls[0][0]).toContain('[SafeLogger] LogBox 에러 감지');
    });

    test('SafeLogger should handle DevTools errors', () => {
        // DevTools 관련 에러 시뮬레이션
        safeLogger.error('Simulated error coming from DevTools');

        // console.error가 직접 호출되지 않고 console.warn으로 처리되어야 함
        expect(consoleErrorCalls.length).toBe(0);
        expect(consoleWarnCalls.length).toBe(1);
        expect(consoleWarnCalls[0][0]).toContain('[SafeLogger] LogBox 에러 감지');
    });

    test('SafeLogger should allow normal errors', () => {
        // 일반 에러 시뮬레이션
        safeLogger.error('Normal application error');

        // 일반 에러는 console.error로 정상 처리되어야 함
        expect(consoleErrorCalls.length).toBe(1);
        expect(consoleErrorCalls[0][0]).toBe('Normal application error');
    });

    test('SafeLogger should prevent infinite loops', () => {
        // 연속된 LogBox 에러 시뮬레이션
        for (let i = 0; i < 5; i++) {
            safeLogger.error('LogBox rendering error');
        }

        // 처음 3개는 warn으로 처리되고, 나머지는 무시되어야 함
        expect(consoleWarnCalls.length).toBe(4); // 3개 에러 + 1개 무한루프 감지 메시지
        expect(consoleWarnCalls[3][0]).toContain('[SafeLogger] LogBox 무한 루프 감지');
    });

    test('ErrorBoundary logging should be safe', () => {
        const mockError = new Error('LogBox test error');
        const mockErrorInfo = {componentStack: 'test stack'};

        // ErrorBoundary 로깅 테스트
        safeLogger.errorBoundaryLog(mockError, mockErrorInfo);

        // LogBox 관련 에러는 warn으로 처리되어야 함
        expect(consoleWarnCalls.length).toBe(1);
        expect(consoleWarnCalls[0][0]).toContain('[ErrorBoundary] LogBox 관련 에러 감지');
    });

    test('SafeLogger status should be trackable', () => {
        // 초기 상태 확인
        let status = safeLogger.getStatus();
        expect(status.logBoxErrorCount).toBe(0);
        expect(status.enableLogBox).toBe(true);

        // LogBox 에러 발생 후 상태 확인
        safeLogger.error('LogBox error');
        status = safeLogger.getStatus();
        expect(status.logBoxErrorCount).toBe(1);

        // 리셋 후 상태 확인
        safeLogger.reset();
        status = safeLogger.getStatus();
        expect(status.logBoxErrorCount).toBe(0);
        expect(status.enableLogBox).toBe(true);
    });
});

console.log('LogBox Error Prevention Test Script Created');
console.log('Run with: npm test test-scripts/logbox-error-test.js');
