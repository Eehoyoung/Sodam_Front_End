import React, {useEffect} from 'react';
import {Alert, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {ENABLE_STACK_NAV, STACK_RECOVERY_STAGE, stageAtLeast} from './config';
import {useAuthMock} from '../contexts/AuthMockProvider';

// Conditional imports to avoid loading @react-navigation/stack when disabled
let NavigationContainer: any = null;
let createStackNavigator: any = null;
let GestureHandlerRootView: any = null;
let Stack: any = null;
let USE_STACK_FALLBACK: boolean = false;

// Optional linking config for Iter 13
let linking: any = undefined;

if (ENABLE_STACK_NAV) {
    // Load navigation libs only when enabled
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    NavigationContainer = require('@react-navigation/native').NavigationContainer;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    createStackNavigator = require('@react-navigation/stack').createStackNavigator;
    // Try to require RNGH; if not available, fallback to View wrapper to avoid runtime crash
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        GestureHandlerRootView = require('react-native-gesture-handler').GestureHandlerRootView;
    } catch (e) {
        console.warn('[RECOVERY][STACK] RNGestureHandler not available, using View fallback. Error:', (e as any)?.message || e);
        GestureHandlerRootView = ({children, style}: any) => React.createElement(View, {style}, children);
        USE_STACK_FALLBACK = true; // Use JS fallback navigator when RNGH native is missing
    }
    try {
        Stack = createStackNavigator();
    } catch (e) {
        console.warn('[RECOVERY][STACK] createStackNavigator failed, using fallback. Error:', (e as any)?.message || e);
        USE_STACK_FALLBACK = true;
    }

    if (stageAtLeast(13)) {
        linking = {
            prefixes: ['sodam://'],
            config: {
                screens: {
                    Welcome: 'welcome',
                    Second: 'second',
                    Home: 'home',
                },
            },
        };
    }
}

// Types for route params (Iter 15)
type RootStackParamList = {
    Welcome: undefined;
    Second: { title?: string } | undefined;
    Home: undefined;
    Modal: undefined;
};

const WelcomeScreen: React.FC<any> = ({navigation}: any) => {
    const goSecond = () => navigation?.navigate?.('Second', {title: '두번째 화면'});
    const openModal = () => navigation?.navigate?.('Modal');

    const requestLocation = async () => {
        if (!stageAtLeast(19)) return;
        try {
            // dynamic import; only when user taps
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const {request, PERMISSIONS, RESULTS} = require('react-native-permissions');
            const res = await request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log('[RECOVERY][PERM] location request result:', res);
            Alert.alert('권한 요청', `결과: ${res}`);
        } catch (e) {
            console.warn('[RECOVERY][PERM] request failed:', (e as any)?.message || e);
        }
    };

    const enableNFC = async () => {
        if (!stageAtLeast(20)) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const NfcManager = require('react-native-nfc-manager').default;
            await NfcManager.start();
            Alert.alert('NFC', 'NFC가 활성화되었습니다 (옵트인).');
        } catch (e) {
            console.warn('[RECOVERY][NFC] start failed:', (e as any)?.message || e);
            Alert.alert('NFC', 'NFC 활성화에 실패했습니다. 앱 권한 및 기기 설정을 확인하세요.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <View style={styles.container} accessibilityRole="header" accessibilityLabel="Sodam Minimal Navigator">
                <Text style={styles.title}>Sodam</Text>
                <Text style={styles.subtitle}>
                    {ENABLE_STACK_NAV ? 'StackView Enabled (Stage ' + STACK_RECOVERY_STAGE + ')' : 'StackView Disabled'}
                </Text>
                <Text style={styles.body}>
                    {ENABLE_STACK_NAV
                        ? '스택 네비게이터가 단계적으로 활성화되었습니다.'
                        : '스택 네비게이터가 일시적으로 비활성화되었습니다. 런타임 테스트 후 단계적으로 복원합니다.'}
                </Text>
                {ENABLE_STACK_NAV && (
                    <View style={{marginTop: 16}}>
                        {stageAtLeast(9) && (
                            <Pressable accessibilityRole="button" style={styles.button} onPress={goSecond}>
                                <Text style={styles.buttonText}>두 번째 화면으로</Text>
                            </Pressable>
                        )}
                        {stageAtLeast(12) && (
                            <Pressable accessibilityRole="button" style={styles.button} onPress={openModal}>
                                <Text style={styles.buttonText}>모달 열기</Text>
                            </Pressable>
                        )}
                        {stageAtLeast(19) && (
                            <Pressable accessibilityRole="button" style={styles.button} onPress={requestLocation}>
                                <Text style={styles.buttonText}>위치 권한 요청</Text>
                            </Pressable>
                        )}
                        {stageAtLeast(20) && (
                            <Pressable accessibilityRole="button" style={styles.button} onPress={enableNFC}>
                                <Text style={styles.buttonText}>NFC 활성화 (옵트인)</Text>
                            </Pressable>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const SecondScreen: React.FC<any> = ({route, navigation}: any) => {
    const title = route?.params?.title ?? 'Second';
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Pressable accessibilityRole="button" style={styles.button} onPress={() => navigation?.goBack?.()}>
                    <Text style={styles.buttonText}>뒤로가기</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const ModalScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <View style={styles.container}>
                <Text style={styles.title}>모달 화면</Text>
                <Text style={styles.body}>presentation: 'modal' 테스트</Text>
            </View>
        </SafeAreaView>
    );
};

const MinimalNavigator: React.FC = () => {
    // Auth mock state (Iter 17)
    const auth = stageAtLeast(17) ? useAuthMock() : ({isAuthenticated: false} as any);

    useEffect(() => {
        console.log(`[RECOVERY][STACK] ENABLE_STACK_NAV=${ENABLE_STACK_NAV} STAGE=${STACK_RECOVERY_STAGE}`);
    }, []);

    if (!ENABLE_STACK_NAV) {
        // Hard-disable stack: render a simple screen without any navigator
        return <WelcomeScreen/>;
    }

    // Fallback JS navigator when native deps are missing
    if (USE_STACK_FALLBACK) {
        const FallbackNavigator: React.FC = () => {
            const [route, setRoute] = React.useState<'Welcome' | 'Second' | 'Modal' | 'Home'>(
                (stageAtLeast(17) && auth?.isAuthenticated ? 'Home' : 'Welcome') as any,
            );
            const nav = {
                navigate: (name: 'Welcome' | 'Second' | 'Modal' | 'Home', params?: any) => setRoute(name),
                goBack: () => setRoute('Welcome'),
            } as any;
            return (
                <GestureHandlerRootView style={{flex: 1}}>
                    {route === 'Welcome' && <WelcomeScreen navigation={nav}/>}
                    {route === 'Second' && <SecondScreen navigation={nav} route={{params: {title: '두번째 화면'}}}/>}
                    {route === 'Modal' && <ModalScreen/>}
                    {route === 'Home' && stageAtLeast(18) && (
                        // Lazy load Home when needed
                        React.createElement(require('../features/home/screens/HomeScreen').default)
                    )}
                </GestureHandlerRootView>
            );
        };
        console.warn('[RECOVERY][STACK] Using JS FallbackNavigator due to missing native deps');
        return <FallbackNavigator/>;
    }

    // Navigator options depending on stage
    const screenOptions: any = {
        headerShown: stageAtLeast(10),
    };
    if (Platform.OS === 'android' && stageAtLeast(8)) {
        screenOptions.animationEnabled = true;
    }
    if (stageAtLeast(14)) {
        screenOptions.detachInactiveScreens = true; // keep default true; explicit for visibility
    }

    const initialRouteName = stageAtLeast(17) && auth?.isAuthenticated ? 'Home' : 'Welcome';

    // Render stack when enabled with GestureHandlerRootView wrapper (Stage 2)
    try {
        return (
            <GestureHandlerRootView style={{flex: 1}}>
                <NavigationContainer {...(linking ? {linking} : {})}>
                    <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialRouteName}>
                        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                        {stageAtLeast(9) && <Stack.Screen name="Second" component={SecondScreen}/>}
                        {stageAtLeast(18) && <Stack.Screen name="Home"
                                                           getComponent={() => require('../features/home/screens/HomeScreen').default}/>}
                        {stageAtLeast(12) && (
                            <Stack.Screen name="Modal" component={ModalScreen} options={{presentation: 'modal'}}/>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        );
    } catch (e) {
        console.warn('[RECOVERY][STACK] Failed to render Stack Navigator, falling back to Welcome. Error:', (e as any)?.message || e);
        return <WelcomeScreen/>;
    }
};

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
    container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {fontSize: 28, fontWeight: '700', marginBottom: 8},
    subtitle: {fontSize: 16, color: '#666', marginBottom: 16, textAlign: 'center'},
    body: {fontSize: 14, color: '#444', textAlign: 'center'},
    button: {paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#4F46E5', borderRadius: 8, marginTop: 8},
    buttonText: {color: '#FFFFFF', fontWeight: '700'},
});

export default MinimalNavigator;
