import {useState, useCallback, useEffect} from 'react';
import authService, {User} from '../services/authService';

/**
 * 인증 관련 기능을 제공하는 커스텀 훅
 *
 * 로그인, 회원가입, 로그아웃 및 인증 상태 관리 기능을 제공합니다.
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 초기 인증 상태 확인
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const isAuth = await authService.isAuthenticated();
                if (isAuth) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error('인증 상태 확인 오류:', err);
                // 토큰이 유효하지 않은 경우 로그아웃 처리
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // 로그인 함수
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login({email, password});
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (err: any) {
            setError(err.message || '로그인 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 회원가입 함수
    const signup = useCallback(async (name: string, email: string, password: string, phone: string = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.signup({name, email, password, phone});
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (err: any) {
            setError(err.message || '회원가입 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 로그아웃 함수
    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err: any) {
            setError(err.message || '로그아웃 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 비밀번호 재설정 요청 함수
    const requestPasswordReset = useCallback(async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.requestPasswordReset(email);
        } catch (err: any) {
            setError(err.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 비밀번호 재설정 함수
    const resetPassword = useCallback(async (token: string, newPassword: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword(token, newPassword);
        } catch (err: any) {
            setError(err.message || '비밀번호 재설정 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        isAuthenticated,
        user,
        error,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
    };
};

export default useAuth;
