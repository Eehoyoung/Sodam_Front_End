import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import authService, {User} from '../features/auth/services/authService';
import {memoryStorage} from '../common/utils/memoryStorage';
import {safeLogger} from '../utils/safeLogger';

// 조건부 import를 통한 안전한 AsyncStorage 접근
const getAsyncStorage = async () => {
    try {
        // 모듈 로딩 오류를 방지하기 위한 동적 AsyncStorage import
        const AsyncStorageModule = await import('@react-native-async-storage/async-storage');
        const AsyncStorage = AsyncStorageModule.default;

        // AsyncStorage 모듈이 존재하고 필요한 메서드를 가지고 있는지 확인
        if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
            console.log('[DEBUG_LOG] AsyncStorage module not available, using memory storage');
            return memoryStorage;
        }

        // 타임아웃을 통한 AsyncStorage 기능 테스트
        const testPromise = AsyncStorage.getItem('__test__');
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AsyncStorage timeout')), 1000)
        );

        await Promise.race([testPromise, timeoutPromise]);
        console.log('[DEBUG_LOG] AsyncStorage is available and functional');
        return AsyncStorage;
    } catch (error: any) {
        console.log('[DEBUG_LOG] AsyncStorage not available, falling back to memory storage:', error?.message || 'Unknown error');
        return memoryStorage;
    }
};

// 인증 컨텍스트 타입 정의
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    isFirstLaunch: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    kakaoLogin: (code: string) => Promise<void>;
    setFirstLaunchComplete: () => Promise<void>;
}

// 기본값 생성
const defaultAuthContext: AuthContextType = {
    isAuthenticated: false,
    user: null,
    loading: true,
    isFirstLaunch: true,
    login: async () => {
    },
    logout: async () => {
    },
    kakaoLogin: async () => {
    },
    setFirstLaunchComplete: async () => {
    },
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// 컨텍스트 훅 - 안전장치 추가
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        console.error('[DEBUG_LOG] AuthContext not found - using default values');
        return {
            isAuthenticated: false,
            user: null,
            loading: false,  // loading을 false로 설정하여 무한 로딩 방지
            isFirstLaunch: true,
            login: async () => {
                throw new Error('AuthProvider not found');
            },
            logout: async () => {
                throw new Error('AuthProvider not found');
            },
            kakaoLogin: async () => {
                throw new Error('AuthProvider not found');
            },
            setFirstLaunchComplete: async () => {
                throw new Error('AuthProvider not found');
            },
        };
    }

    return context;
};

// 프로바이더 컴포넌트
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);

    // 앱 시작 시 인증 상태 및 첫 실행 확인
    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const checkAuth = async () => {
            try {
                if (!isMounted) return;

                const storage = await getAsyncStorage();

                if (!isMounted) return;

                // 첫 실행 여부 확인
                const hasLaunched = await storage.getItem('hasLaunched');
                if (isMounted) {
                    setIsFirstLaunch(!hasLaunched);

                }

                if (!isMounted) return;

                const token = await storage.getItem('userToken');
                if (token && isMounted) {
                    // 토큰이 있으면 사용자 정보 가져오기 (AbortController 사용)
                    try {
                        console.log('[DEBUG_LOG] Token found, fetching user data...');

                        // API 호출에 AbortController 적용
                        const userData = await authService.getCurrentUser();

                        if (isMounted && !abortController.signal.aborted) {
                            setUser(userData);
                            setIsAuthenticated(true);
                            console.log('[DEBUG_LOG] User authenticated successfully');
                        }
                    } catch (error) {
                        if (!abortController.signal.aborted && isMounted) {
                            safeLogger.error('[DEBUG_LOG] User data fetch failed:', error);
                            // 사용자 정보를 가져오는 데 실패하면 토큰 삭제
                            try {
                                await storage.removeItem('userToken');
                            } catch (removeError) {
                                safeLogger.asyncStorageError('[DEBUG_LOG] Failed to remove token:', removeError);
                            }
                            setIsAuthenticated(false);
                            setUser(null);
                        }
                    }
                } else if (isMounted) {
                    console.log('[DEBUG_LOG] No token found, user not authenticated');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                if (!abortController.signal.aborted && isMounted) {
                    safeLogger.asyncStorageError('[DEBUG_LOG] Auth check failed:', error);
                    // Storage 오류 시 graceful fallback
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log('[DEBUG_LOG] Auth check completed');
                }
            }
        };

        // 지연 실행으로 네이티브 모듈 초기화 대기
        const timeoutId: NodeJS.Timeout = setTimeout(() => {
            if (isMounted && !abortController.signal.aborted) {
                checkAuth();
            }
        }, 500); // 전체 인증 체크에 대한 최대 타임아웃 (3초) - WSOD 해결을 위해 단축
        const maxTimeoutId: NodeJS.Timeout = setTimeout(() => {
            if (isMounted) {
                console.log('[DEBUG_LOG] FORCE: Auth check timeout - setting loading false');
                setLoading(false);
            }
        }, 3000);
        return () => {
            isMounted = false;
            abortController.abort();
            clearTimeout(timeoutId);
            clearTimeout(maxTimeoutId);
        };
    }, []);

    // 로그인 함수
    const login = async (email: string, password: string) => {
        const isMounted = true;
        try {
            if (isMounted) setLoading(true);
            console.log('[DEBUG_LOG] Starting login process');
            const response = await authService.login({email, password});
            if (isMounted) {
                setUser(response.user);
                setIsAuthenticated(true);
                console.log('[DEBUG_LOG] Login successful');
            }
        } catch (error) {
            safeLogger.error('[DEBUG_LOG] Login failed:', error);
            throw error;
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        const isMounted = true;
        try {
            if (isMounted) setLoading(true);
            console.log('[DEBUG_LOG] Starting logout process');
            await authService.logout();
            if (isMounted) {
                setIsAuthenticated(false);
                setUser(null);
                console.log('[DEBUG_LOG] Logout successful');
            }
        } catch (error) {
            safeLogger.error('[DEBUG_LOG] Logout failed:', error);
            // 로그아웃이 실패하더라도 로컬 상태를 정리
            if (isMounted) {
                setIsAuthenticated(false);
                setUser(null);
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    // 카카오 로그인 함수
    const kakaoLogin = async (code: string) => {
        const isMounted = true;
        try {
            if (isMounted) setLoading(true);
            console.log('[DEBUG_LOG] Starting Kakao login process');
            // 카카오 로그인 처리
            const response = await authService.kakaoLogin(code);

            if (response.token && isMounted) {
                // 사용자 정보 가져오기
                const userData = await authService.getCurrentUser();
                if (isMounted) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('[DEBUG_LOG] Kakao login successful');
                }
            } else if (!isMounted) {
                return; // 컴포넌트가 언마운트되었으므로 에러를 발생시키지 않음
            } else {
                throw new Error('카카오 로그인 실패');
            }
        } catch (error) {
            safeLogger.error('[DEBUG_LOG] Kakao login failed:', error);
            throw error;
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    // 첫 실행 완료 처리 함수
    const setFirstLaunchComplete = async () => {
        try {
            console.log('[DEBUG_LOG] Setting first launch complete');
            const storage = await getAsyncStorage();
            await storage.setItem('hasLaunched', 'true');
            setIsFirstLaunch(false);
            console.log('[DEBUG_LOG] First launch completed successfully');
        } catch (error) {
            safeLogger.asyncStorageError('[DEBUG_LOG] Failed to set first launch complete:', error);
        }
    };

    // 컨텍스트 값
    const value = {
        isAuthenticated,
        user,
        loading,
        isFirstLaunch,
        login,
        logout,
        kakaoLogin,
        setFirstLaunchComplete,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {AuthProvider as default};

