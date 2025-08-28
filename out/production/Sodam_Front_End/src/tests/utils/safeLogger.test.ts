/*
 * Tests for safeLogger utility
 */

describe('safeLogger', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('logs regular errors via console.error and filters LogBox-related errors to warn', () => {
    jest.isolateModules(() => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const mod = require('../../utils/safeLogger');
      const logger = mod.safeLogger as typeof mod.safeLogger;

      // Regular error should go to error
      logger.error('Regular failure occurred');
      expect(errorSpy).toHaveBeenCalled();

      // LogBox error should be downgraded to warn with prefix
      warnSpy.mockClear();
      logger.error('Simulated error coming from DevTools / LogBoxStateSubscription');
      expect(warnSpy).toHaveBeenCalled();
      expect(
        warnSpy.mock.calls.some(c => String(c[0]).includes('[SafeLogger] LogBox 에러 감지:'))
      ).toBe(true);

      // AsyncStorage info path
      logSpy.mockClear();
      logger.asyncStorageInfo('AsyncStorage getItem returned null for userToken (first launch)');
      expect(logSpy).toHaveBeenCalled();
      expect(
        logSpy.mock.calls.some(c => String(c[0]).includes('[SafeLogger] AsyncStorage INFO:'))
      ).toBe(true);

      errorSpy.mockRestore();
      warnSpy.mockRestore();
      logSpy.mockRestore();
    });
  });
});
