import api from '../../../common/utils/api';
import {unifiedStorage} from '../../../common/utils/unifiedStorage';
import {logger} from '../../../utils/logger';

/**
 * ?�증 관???�비??
 * 로그?? ?�원가?? ?�큰 관�??�의 기능???�공?�니??
 */

// ?�용???�???�의
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'MASTER' | 'USER';
}

// 로그???�청 ?�??
export interface LoginRequest {
    email: string;
    password: string;
}

// ?�원가???�청 ?�??
export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'EMPLOYEE' | 'MANAGER' | 'MASTER' | 'USER';
}

// ?�증 ?�답 ?�??
export interface AuthResponse {
    user: User;
    token: string;
}

// ?�큰 ?�???�수
const saveToken = async (token: string): Promise<void> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        await unifiedStorage.setItem('userToken', token);
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
    }
};

// ?�큰 가?�오�??�수
const getToken = async (): Promise<string | null> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        return await unifiedStorage.getItem('userToken');
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
        return null;
    }
};

// ?�큰 ??�� ?�수
const removeToken = async (): Promise<void> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        await unifiedStorage.removeItem('userToken');
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
    }
};

// ?�증 ?�비??객체
const authService = {
    /**
     * 로그??
     * @param loginRequest 로그???�청 ?�이??
     * @returns ?�증 ?�답 (?�용???�보 �??�큰)
     */
    login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', loginRequest);
            const {token} = response.data;
            await saveToken(token);
            return response.data;
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * 카카??로그??
     * @param code 카카???�증 코드
     * @returns ?�증 ?�답 (?�용???�보 �??�큰)
     */
    kakaoLogin: async (code: string): Promise<AuthResponse> => {
        try {
            const response = await api.get<AuthResponse>(`/kakao/auth/proc?code=${code}`);
            const {token} = response.data;
            await saveToken(token);
            return response.data;
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�원가??
     * @param signupRequest ?�원가???�청 ?�이??
     * @returns ?�증 ?�답 (?�용???�보 �??�큰)
     */
    signup: async (signupRequest: SignupRequest): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/auth/signup', signupRequest);
            const {token} = response.data;
            await saveToken(token);
            return response.data;
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * 로그?�웃
     */
    logout: async (): Promise<void> => {
        await removeToken();
    },

    /**
     * ?�재 ?�용???�보 가?�오�?
     * @returns ?�용???�보
     */
    getCurrentUser: async (): Promise<User> => {
        try {
            const response = await api.get<User>('/auth/me');
            return response.data;
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * 비�?번호 ?�설???�청
     * @param email ?�용???�메??
     */
    requestPasswordReset: async (email: string): Promise<void> => {
        try {
            await api.post('/auth/password-reset-request', {email});
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * 비�?번호 ?�설??
     * @param token ?�설???�큰
     * @param newPassword ??비�?번호
     */
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        try {
            await api.post('/auth/password-reset', {token, newPassword});
        } catch (error) {
            logger.error('', 'AUTH_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�증 ?�태 ?�인
     * @returns ?�증 ?��?
     */
    isAuthenticated: async (): Promise<boolean> => {
        const token = await getToken();
        return !!token;
    },
};

export default authService;
