/**
 * Main App Component - Minimal Baseline (Reset) with Timing Optimization
 * Goal: Provide a crash-free, dependency-light entry point so we can
 * reintroduce features incrementally and validate stability at each step.
 *
 * Enhanced with ReactNoCrashSoftException timing issue resolution:
 * - InitializationErrorBoundary for graceful timing issue handling
 * - ContextReadinessManager for proper initialization coordination
 * - Optimized CriticalModuleValidator with caching
 */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, InteractionManager, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import InitializationErrorBoundary from './src/components/InitializationErrorBoundary';
import {colors} from './src/theme/colors';
import {typography} from './src/theme/typography';
import ThemeProvider from './src/common/providers/ThemeProvider';
import {ENABLE_SCREENS_NATIVE, stageAtLeast} from './src/navigation/config';
import AuthMockProvider from './src/contexts/AuthMockProvider';
import {AuthProvider} from './src/contexts/AuthContext';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/common/utils/queryClient';
import {CriticalModuleValidator} from './src/utils/NativeModuleValidator';
import {getContextReadinessManager, logContextReadinessTiming} from './src/utils/contextReadiness';

const App: React.FC = () => {
    // Context readiness manager for timing coordination
    const contextManager = getContextReadinessManager();

    useEffect(() => {
        // Observability marker for Logcat-driven iterations
        console.log('[RECOVERY] App baseline mounted');

        // Mark app start time for timing diagnostics
        if (typeof global !== 'undefined' && !(global as any).__APP_START_TIME__) {
            (global as any).__APP_START_TIME__ = Date.now();
        }
    }, []);

    // Iter 07: enableScreens(true) guarded — also gated by ENABLE_SCREENS_NATIVE to avoid console errors when native module is absent
    try {
        if (ENABLE_SCREENS_NATIVE && stageAtLeast(7)) {
            // dynamic require to avoid bundling issues on web/tests
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const screens = require('react-native-screens');
            if (typeof screens?.enableScreens === 'function') {
                screens.enableScreens(true);
            }
        }
    } catch (e) {
        console.warn('[RECOVERY] enableScreens skipped:', (e as any)?.message || e);
    }

    const [appReady, setAppReady] = useState(false);
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setAppReady(true);
            console.log('[RECOVERY] App interaction readiness achieved');
        });
        return () => {
            // @ts-ignore - InteractionManager Task may not have cancel in some versions
            task?.cancel?.();
        };
    }, []);
    // Critical native module validation gating
    const [validation, setValidation] = useState<{
        isValid: boolean;
        isLoading: boolean;
        error?: string;
    }>({isValid: false, isLoading: true});
  useEffect(() => {
      let mounted = true;
      const validate = async () => {
          try {
              console.log('[RECOVERY] Starting critical module validation');
              const ok = await CriticalModuleValidator.performCriticalValidation();
              if (!mounted) return;

              if (!ok) {
                  const res = CriticalModuleValidator.validateGestureHandler();
                  setValidation({isValid: false, isLoading: false, error: res.error});
                  console.warn('[RECOVERY] Critical module validation failed:', res.error);
              } else {
                  setValidation({isValid: true, isLoading: false});
                  console.log('[RECOVERY] Critical module validation successful');

                  // Signal context readiness after successful validation and app readiness
                  if (appReady) {
                      InteractionManager.runAfterInteractions(() => {
                          requestAnimationFrame(() => {
                              contextManager.signalReady();
                              logContextReadinessTiming();
                          });
                      });
                  }
              }
          } catch (e: any) {
              if (!mounted) return;
              console.error('[RECOVERY] Critical module validation error:', e);
              setValidation({isValid: false, isLoading: false, error: e?.message ?? String(e)});
          }
      };
      validate();
      return () => {
          mounted = false;
      };
  }, [appReady, contextManager]);

  // Additional effect to signal readiness when both validation and app are ready
  useEffect(() => {
      if (validation.isValid && appReady && !contextManager.isContextReady()) {
          InteractionManager.runAfterInteractions(() => {
              requestAnimationFrame(() => {
                  contextManager.signalReady();
                  logContextReadinessTiming();
              });
          });
      }
  }, [validation.isValid, appReady, contextManager]);
    // Navigator tree will be composed lazily after validation to avoid early RNGH access
    if (validation.isLoading) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color={colors.brandPrimary}/>
                <Text style={{marginTop: 12, color: colors.textSecondary}}>
                    Validating native modules...
                </Text>
            </View>
        );
    }
    if (!validation.isValid) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16}}>
                <Text style={{fontSize: typography.sizes.md, color: colors.textPrimary, textAlign: 'center'}}>
                    Critical native modules failed validation.
                </Text>
                {validation.error ? (
                    <Text style={{marginTop: 8, color: colors.textSecondary, textAlign: 'center'}}>
                        {validation.error}
                    </Text>
                ) : null}
            </View>
        );
    }
    // Compose navigation and providers lazily after validation passes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AppNavigator = require('./src/navigation/AppNavigator').default;
    const NavigatorTree = (
        <AppNavigator appReady={appReady}/>
    );
    const WrappedByLocalBoundary = stageAtLeast(16) ? (
        <ErrorBoundary>{NavigatorTree}</ErrorBoundary>
    ) : (
        NavigatorTree
    );
    const WithRealAuth = (
        <AuthProvider>{WrappedByLocalBoundary}</AuthProvider>
    );
    const WithAuthMock = stageAtLeast(17) ? (
        <AuthMockProvider>{WithRealAuth}</AuthMockProvider>
    ) : (
        WithRealAuth
    );
    const handleTimingIssue = (error: Error, errorInfo: React.ErrorInfo) => {
        console.warn('[TIMING_COORDINATION] ReactNoCrashSoftException detected during app lifecycle');
        // Could add analytics or monitoring here if needed
    };

    return (
        <View style={{flex: 1}}>
            <InitializationErrorBoundary onTimingIssue={handleTimingIssue}>
                <QueryClientProvider client={queryClient}>
                    <SafeAreaProvider>
                        <ErrorBoundary>
                            <ThemeProvider>
                                {WithAuthMock}
                            </ThemeProvider>
                        </ErrorBoundary>
                    </SafeAreaProvider>
                </QueryClientProvider>
            </InitializationErrorBoundary>
        </View>
  );
};

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: colors.background},
    container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        marginBottom: 8,
        color: colors.textPrimary
    },
    subtitle: {fontSize: typography.sizes.md, color: colors.textSecondary, marginBottom: 16, textAlign: 'center'},
    body: {fontSize: typography.sizes.sm, color: colors.textTertiary, textAlign: 'center'},
});

export default App;
