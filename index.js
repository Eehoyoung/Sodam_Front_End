/**
 * Entry point for Sodam App
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';

// 개발 환경에서만 불필요한 경고 숨기기
if (__DEV__) {
    LogBox.ignoreLogs([
        'ENOENT: no such file or directory',
        'DevTools',
        'Launching DevTools',
        'debugger-frontend',
        'ko.json',
        'Require cycle:',
        'Remote debugger',
        'Setting a timer',

    ]);
}

console.log('[DEBUG_LOG] === INDEX.JS START ===');
console.log('[DEBUG_LOG] App name:', appName);

// AppComponent 임포트 (점진적 로딩을 위한 에러 핸들링 포함)
let AppComponent;
try {
    AppComponent = require('./App.tsx').default;
    console.log('[DEBUG_LOG] ✅ AppComponent loaded successfully');
} catch (error) {
    console.error('[DEBUG_LOG] ❌ Failed to load AppComponent:', error);

    // 폴백 컴포넌트
    const React = require('react');
    const {View, Text, StyleSheet} = require('react-native');

    AppComponent = () => React.createElement(
        View,
        {style: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}},
        React.createElement(Text,
            {style: {fontSize: 18, textAlign: 'center', color: 'red', marginBottom: 10}},
            '앱 로딩 중 오류가 발생했습니다'
        ),
        React.createElement(Text,
            {style: {fontSize: 14, textAlign: 'center', color: '#666'}},
            '개발자에게 문의하세요'
        )
    );
}

// 컴포넌트 등록
try {
    AppRegistry.registerComponent(appName, () => AppComponent);
    console.log('[DEBUG_LOG] ✅ SUCCESS: Component registered successfully!');
    console.log('[DEBUG_LOG] ✅ App name:', appName);
} catch (error) {
    console.error('[DEBUG_LOG] ❌ FAILED: Registration error:', error);
}

console.log('[DEBUG_LOG] === INDEX.JS END ===');
