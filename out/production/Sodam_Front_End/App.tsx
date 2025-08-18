/**
 * Main App Component - Minimal Baseline (Reset)
 * Goal: Provide a crash-free, dependency-light entry point so we can
 * reintroduce features incrementally and validate stability at each step.
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, InteractionManager, View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';
import ThemeProvider from './src/common/providers/ThemeProvider';
import MinimalNavigator from './src/navigation/MinimalNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { stageAtLeast, ENABLE_SCREENS_NATIVE, ENABLE_STACK_NAV } from './src/navigation/config';
import AuthMockProvider from './src/contexts/AuthMockProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/common/utils/queryClient';
import { CriticalModuleValidator } from './src/utils/NativeModuleValidator';

const App: React.FC = () => {
  useEffect(() => {
    // Observability marker for Logcat-driven iterations
    console.log('[RECOVERY] App baseline mounted');
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
  }>({ isValid: false, isLoading: true });

  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const ok = await CriticalModuleValidator.performCriticalValidation();
        if (!mounted) return;
        if (!ok) {
          const res = CriticalModuleValidator.validateGestureHandler();
          setValidation({ isValid: false, isLoading: false, error: res.error });
        } else {
          setValidation({ isValid: true, isLoading: false });
        }
      } catch (e: any) {
        if (!mounted) return;
        setValidation({ isValid: false, isLoading: false, error: e?.message ?? String(e) });
      }
    };
    validate();
    return () => { mounted = false; };
  }, []);

  const NavigatorTree = (
    ENABLE_STACK_NAV ? <AppNavigator appReady={appReady} /> : <MinimalNavigator />
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

  if (validation.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>
          Validating native modules...
        </Text>
      </View>
    );
  }

  if (!validation.isValid) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ fontSize: typography.sizes.md, color: colors.textPrimary, textAlign: 'center' }}>
          Critical native modules failed validation.
        </Text>
        {validation.error ? (
          <Text style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            {validation.error}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <ThemeProvider>
              {WithAuthMock}
            </ThemeProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, marginBottom: 8, color: colors.textPrimary },
  subtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, marginBottom: 16, textAlign: 'center' },
  body: { fontSize: typography.sizes.sm, color: colors.textTertiary, textAlign: 'center' },
});

export default App;
