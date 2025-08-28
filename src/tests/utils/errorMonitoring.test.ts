/* Tests for errorMonitoring system */

describe('errorMonitoring', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('reports errors and aggregates occurrence counts; records performance metrics', () => {
    jest.isolateModules(() => {
      // Ensure __DEV__ true for enabling monitor
      (global as any).__DEV__ = true;

      const { errorMonitor, reportNetworkError, reportAsyncError } = require('../../utils/errorMonitoring');

      // Initial reports
      let reports = errorMonitor.getErrorReports();
      const initialCount = reports.length;

      // Report a network error twice
      reportNetworkError('Network glitch');
      reportNetworkError('Network glitch');

      // Report an async error once
      reportAsyncError('Unhandled promise rejection');

      reports = errorMonitor.getErrorReports();
      expect(reports.length).toBeGreaterThanOrEqual(initialCount + 2);

      const networkReport = reports.find(r => r.message.includes('Network glitch'));
      expect(networkReport).toBeTruthy();
      expect(networkReport?.occurrenceCount).toBeGreaterThanOrEqual(2);
      expect(networkReport?.resolved).toBe(false);

      // Record a performance metric and check retrieval
      errorMonitor.recordPerformanceMetric('metricX', 123);
      const metrics = errorMonitor.getPerformanceMetrics();
      expect(metrics.metricX).toBeDefined();
      expect(metrics.metricX.length).toBeGreaterThan(0);
      expect(metrics.metricX[metrics.metricX.length - 1]).toBe(123);
    });
  });
});
