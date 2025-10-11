import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../features/home/screens/HomeScreen';
import SubscribeScreen from '../features/subscription/screens/SubscribeScreen';
import QnAScreen from '../features/qna/screens/QnAScreen';
import LaborInfoDetailScreen from '../features/info/screens/LaborInfoDetailScreen';
import PolicyDetailScreen from '../features/info/screens/PolicyDetailScreen';
import TaxInfoDetailScreen from '../features/info/screens/TaxInfoDetailScreen';
import TipsDetailScreen from '../features/info/screens/TipsDetailScreen';
import EmployeeMyPageRNScreen from '../features/myPage/screens/EmployeeMyPageRNScreen';
import MasterMyPageScreen from '../features/myPage/screens/MasterMyPageScreen';
import ManagerMyPageScreen from '../features/myPage/screens/ManagerMyPageScreen';
import UserMyPageScreen from '../features/myPage/screens/PersonalUserScreen';
import Header from '../common/components/layout/Header';
import ProfileScreen from '../features/auth/screens/ProfileScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import StoreRegistrationScreen from '../features/store/StoreRegistraionScreen';
import AttendanceScreen from '../features/attendance/screens/AttendanceScreen';
import appHeaderOptions from './appHeaderOptions';

export type HomeStackParamList = {
    Home: undefined;
    Subscribe: undefined;
    QnA: undefined;
    LaborInfoDetail: { laborInfoId: number };
    PolicyDetail: { policyId: number };
    TaxInfoDetail: { taxInfoId: number };
    TipsDetail: { tipId: number };
    Attendance: undefined;
    EmployeeMyPageScreen: undefined;
    MasterMyPageScreen: undefined;
    ManagerMyPageScreen: undefined;
    UserMyPageScreen: undefined;
    Settings: undefined;
    Profile: undefined;
    StoreRegistration: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

/**
 * 메인 앱 화면들을 위한 네비게이터
 * 홈, 정보 상세, 마이페이지 등의 화면을 포함
 */
interface HomeNavigatorProps {
    initialScreen?: keyof HomeStackParamList;
}

const HomeNavigator: React.FC<HomeNavigatorProps> = ({ initialScreen }) => {
    return (
        <Stack.Navigator
            initialRouteName={initialScreen ?? 'Home'}
            screenOptions={{
                ...appHeaderOptions,
                presentation: 'card',
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: true,
                    header: () => <Header/>, // props 전달하지 않고 단순히 Header 컴포넌트만 렌더링
                }}
            />

            <Stack.Screen name="Subscribe" component={SubscribeScreen} options={{ title: '구독하기' }} />
            <Stack.Screen name="QnA" component={QnAScreen} options={{ title: 'Q&A' }} />

            <Stack.Screen name="LaborInfoDetail" component={LaborInfoDetailScreen} options={{ title: '노동 정보 상세' }} />
            <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} options={{ title: '정책 상세' }} />
            <Stack.Screen name="TaxInfoDetail" component={TaxInfoDetailScreen} options={{ title: '세무 정보 상세' }} />
            <Stack.Screen name="TipsDetail" component={TipsDetailScreen} options={{ title: '팁 상세' }} />
            <Stack.Screen
                name="Attendance"
                component={AttendanceScreen}
                options={{ headerShown: true, title: '출퇴근 관리' }}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{headerShown: true, title: '설정'}}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{headerShown: true, title: '내 프로필'}}
            />

            <Stack.Screen
                name="EmployeeMyPageScreen"
                component={EmployeeMyPageRNScreen}
                options={{headerShown: true, title: '사원 마이페이지'}}
            />
            <Stack.Screen
                name="MasterMyPageScreen"
                component={MasterMyPageScreen}
                options={{headerShown: true, title: '사장 마이페이지'}}
            />
            <Stack.Screen
                name="ManagerMyPageScreen"
                component={ManagerMyPageScreen}
                options={{headerShown: true, title: '매니저 마이페이지'}}
            />
            <Stack.Screen
                name="UserMyPageScreen"
                component={UserMyPageScreen}
                options={{headerShown: true, title: '개인 마이페이지'}}
            />
            <Stack.Screen
                name="StoreRegistration"
                component={StoreRegistrationScreen}
                options={{headerShown: true, title: '매장 등록'}}
            />
        </Stack.Navigator>
    );
};

export default HomeNavigator;
