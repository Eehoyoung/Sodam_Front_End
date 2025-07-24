/**
 * Sodam Front End App
 * 소상공인과 아르바이트생을 위한 출퇴근 및 급여 관리 애플리케이션
 *
 * @format
 */

import React, {useEffect} from 'react';
import {LogBox, Platform, StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// AuthProvider import 방식 변경
import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {colors} from './src/theme/theme';
import ErrorBoundary from './src/components/ErrorBoundary';

// LogBox 설정 (기존과 동일)
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'VirtualizedLists should never be nested',
    'Simulated error coming from DevTools',
    'An error was thrown when attempting to render log messages via LogBox',
    'ENOENT: no such file or directory',
    'DevTools',
    'Launching DevTools',
    'debugger-frontend',
    'ko.json',
  ]);
}

/**
 * Sodam 메인 애플리케이션 컴포넌트
 */
function App(): React.ReactElement {  // JSX.Element → React.ReactElement로 변경
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log('[DEBUG_LOG] Sodam App initialized');
    console.log('[DEBUG_LOG] Platform:', Platform.OS);
    console.log('[DEBUG_LOG] Dark mode:', isDarkMode);
  }, [isDarkMode]);

  return (
      <SafeAreaProvider>
        <ErrorBoundary>
          {/* AuthProvider는 항상 유지 - 타임아웃 시에도 컨텍스트 제공 */}
          <AuthProvider>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={colors.primary}
                translucent={false}
                hidden={false}
            />
            <AppNavigator/>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
  );
}

export default App;
