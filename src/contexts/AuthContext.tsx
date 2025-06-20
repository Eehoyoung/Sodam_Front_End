import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../features/auth/services/authService';

// 사용자 타입 정의
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'MASTER' | 'USER';
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    kakaoLogin: (code: string) => Promise<void>;
}

// 기본값 생성
const defaultAuthContext: AuthContextType = {
    isAuthenticated: false,
    user: null,
    loading: true,
    login: async () => {
    },
    logout: async () => {
    },
    kakaoLogin: async () => {
    },
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// 컨텍스트 훅
export const useAuth = () => useContext(AuthContext);

// 프로바이더 컴포넌트
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 인증 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    // 토큰이 있으면 사용자 정보 가져오기
                    try {
                        const userData = await authService.getCurrentUser();
                        setUser(userData);
                        setIsAuthenticated(true);
                    } catch (error) {
                        // 사용자 정보를 가져오는 데 실패하면 토큰 삭제
                        await AsyncStorage.removeItem('userToken');
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('인증 상태 확인 중 오류 발생:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 로그인 함수
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await authService.login({email, password});
            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    };

    // 카카오 로그인 함수
    const kakaoLogin = async (code: string) => {
        try {
            setLoading(true);
            // 카카오 로그인 처리
            const response = await authService.kakaoLogin(code);

            if (response.token) {
                // 사용자 정보 가져오기
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                throw new Error('카카오 로그인 실패');
            }
        } catch (error) {
            console.error('카카오 로그인 중 오류 발생:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 컨텍스트 값
    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        kakaoLogin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
