import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator, {AuthStackParamList} from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import {useAuth} from '../contexts/AuthContext';

export type RootStackParamList = {
    Auth: { screen?: keyof AuthStackParamList; params?: any };
    Main: undefined;
    LaborInfoDetail: { laborInfoId: number };
    TaxInfoDetail: { taxInfoId: number };
    TipsDetail: { tipId: number };
    PolicyDetail: { policyId: number };
    QnA: undefined;
    Home: undefined;
};


const Stack = createStackNavigator<RootStackParamList>();

/**
 * 앱의 최상위 네비게이터
 * 인증 관련 화면과 메인 앱 화면을 분리하여 관리
 * AuthContext를 사용하여 인증 상태에 따라 적절한 화면을 표시
 */
const AppNavigator: React.FC = () => {
    // AuthContext에서 인증 상태와 로딩 상태 가져오기
    const {isAuthenticated, loading} = useAuth();

    // 로딩 중에는 아무것도 렌더링하지 않거나 스플래시 화면을 표시할 수 있음
    if (loading) {
        return null; // 또는 <SplashScreen />
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName={isAuthenticated ? "Main" : "Auth"}
            >
                {/* 인증 관련 화면 (로그인, 회원가입 등) */}
                <Stack.Screen name="Auth" component={AuthNavigator}/>

                {/* 메인 앱 화면 (홈, 정보 상세, 마이페이지 등) */}
                <Stack.Screen name="Main" component={HomeNavigator}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
