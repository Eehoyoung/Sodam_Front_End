// /**
//  * LogBox Error Prevention Tests
//  * LogBox 무한 루프 문제 해결 확인을 위한 테스트
//  */
//
// // React Native 환경 시뮬레이션
// global.__DEV__ = true;
//
// // Mock console methods
// const originalConsoleError = console.error;
// const originalConsoleWarn = console.warn;
// const originalConsoleLog = console.log;
//
// let consoleErrorCalls: any[] = [];
// let consoleWarnCalls: any[] = [];
//
// console.error = (...args: any[]) => {
//   consoleErrorCalls.push(args);
//   originalConsoleError(...args);
// };
//
// console.warn = (...args: any[]) => {
//   consoleWarnCalls.push(args);
//   originalConsoleWarn(...args);
// };
//
// // SafeLogger 테스트
// import { safeLogger } from '../src/utils/safeLogger';
//
// describe('LogBox Error Prevention', () => {
//   beforeEach(() => {
//     consoleErrorCalls = [];
//     consoleWarnCalls = [];
//     safeLogger.reset();
//   });
//
//   afterAll(() => {
//     console.error = originalConsoleError;
//     console.warn = originalConsoleWarn;
//     console.log = originalConsoleLog;
//   });
//
//   test('should detect LogBox-related errors', () => {
//     // LogBox 관련 에러 시뮬레이션
//     safeLogger.error('An error was thrown when attempting to render log messages via LogBox');
//
//     // console.error가 직접 호출되지 않고 console.warn으로 처리되어야 함
//     expect(consoleErrorCalls.length).toBe(0);
//     expect(consoleWarnCalls.length).toBe(1);
//     expect(consoleWarnCalls[0][0]).toContain('[SafeLogger] LogBox 에러 감지');
//   });
//
//   test('should handle DevTools errors', () => {
//     // DevTools 관련 에러 시뮬레이션
//     safeLogger.error('Simulated error coming from DevTools');
//
//     // console.error가 직접 호출되지 않고 console.warn으로 처리되어야 함
//     expect(consoleErrorCalls.length).toBe(0);
//     expect(consoleWarnCalls.length).toBe(1);
//     expect(consoleWarnCalls[0][0]).toContain('[SafeLogger] LogBox 에러 감지');
//   });
//
//   test('should allow normal errors', () => {
//     // 일반 에러 시뮬레이션
//     safeLogger.error('Normal application error');
//
//     // 일반 에러는 console.error로 정상 처리되어야 함
//     expect(consoleErrorCalls.length).toBe(1);
//     expect(consoleErrorCalls[0][0]).toBe('Normal application error');
//   });
//
//   test('should prevent infinite loops', () => {
//     // 연속된 LogBox 에러 시뮬레이션
//     for (let i = 0; i < 5; i++) {
//       safeLogger.error('LogBox rendering error');
//     }
//
//     // 처음 3개는 warn으로 처리되고, 임계값 초과 후 무한루프 감지 메시지가 나타남
//     expect(consoleWarnCalls.length).toBeGreaterThanOrEqual(3);
//     // 무한루프 감지 메시지가 포함되어야 함
//     const hasInfiniteLoopWarning = consoleWarnCalls.some(call =>
//       call[0].includes('[SafeLogger] LogBox 무한 루프 감지')
//     );
//     expect(hasInfiniteLoopWarning).toBe(true);
//   });
//
//   test('should handle ErrorBoundary logging safely', () => {
//     const mockError = new Error('LogBox test error');
//     const mockErrorInfo = { componentStack: 'test stack' };
//
//     // ErrorBoundary 로깅 테스트
//     safeLogger.errorBoundaryLog(mockError, mockErrorInfo);
//
//     // LogBox 관련 에러는 warn으로 처리되어야 함
//     expect(consoleWarnCalls.length).toBe(1);
//     expect(consoleWarnCalls[0][0]).toContain('[ErrorBoundary] LogBox 관련 에러 감지');
//   });
//
//   test('should track status correctly', () => {
//     // 초기 상태 확인
//     let status = safeLogger.getStatus();
//     expect(status.logBoxErrorCount).toBe(0);
//     expect(status.enableLogBox).toBe(true);
//
//     // LogBox 에러 발생 후 상태 확인
//     safeLogger.error('LogBox error');
//     status = safeLogger.getStatus();
//     expect(status.logBoxErrorCount).toBe(1);
//
//     // 리셋 후 상태 확인
//     safeLogger.reset();
//     status = safeLogger.getStatus();
//     expect(status.logBoxErrorCount).toBe(0);
//     expect(status.enableLogBox).toBe(true);
//   });
//
//   test('should handle normal ErrorBoundary errors', () => {
//     const mockError = new Error('Network connection failed');
//     const mockErrorInfo = { componentStack: 'normal stack' };
//
//     // 일반 ErrorBoundary 로깅 테스트
//     safeLogger.errorBoundaryLog(mockError, mockErrorInfo);
//
//     // 일반 에러는 console.error로 정상 처리되어야 함
//     expect(consoleErrorCalls.length).toBe(2); // error + errorInfo
//     expect(consoleErrorCalls[0][0]).toContain('[ErrorBoundary] 에러 발생');
//     expect(consoleErrorCalls[1][0]).toContain('[ErrorBoundary] 에러 정보');
//   });
// });
