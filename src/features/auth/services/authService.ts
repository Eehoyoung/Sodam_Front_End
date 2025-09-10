import api from '../../../common/utils/api';
import {unifiedStorage} from '../../../common/utils/unifiedStorage';
import {logger} from '../../../utils/logger';

/**
 * ?¸ì¦ ê´€???œë¹„??
 * ë¡œê·¸?? ?Œì›ê°€?? ? í° ê´€ë¦??±ì˜ ê¸°ëŠ¥???œê³µ?©ë‹ˆ??
 */

// ?¬ìš©???€???•ì˜
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'MASTER' | 'USER';
}

// ë¡œê·¸???”ì²­ ?€??
export interface LoginRequest {
    email: string;
    password: string;
}

// ?Œì›ê°€???”ì²­ ?€??
export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'EMPLOYEE' | 'MANAGER' | 'MASTER' | 'USER';
}

// ?¸ì¦ ?‘ë‹µ ?€??
export interface AuthResponse {
    user: User;
    token: string;
}

// ? í° ?€???¨ìˆ˜
const saveToken = async (token: string): Promise<void> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        await unifiedStorage.setItem('userToken', token);
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
    }
};

// ? í° ê°€?¸ì˜¤ê¸??¨ìˆ˜
const getToken = async (): Promise<string | null> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        return await unifiedStorage.getItem('userToken');
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
        return null;
    }
};

// ? í° ?? œ ?¨ìˆ˜
const removeToken = async (): Promise<void> => {
    try {
        logger.debug('', 'AUTH_SERVICE');
        await unifiedStorage.removeItem('userToken');
    } catch (error) {
        logger.error('', 'AUTH_SERVICE', error);
    }
};

// ?¸ì¦ ?œë¹„??ê°ì²´
const authService = {
    /**
     * ë¡œê·¸??
     * @param loginRequest ë¡œê·¸???”ì²­ ?°ì´??
     * @returns ?¸ì¦ ?‘ë‹µ (?¬ìš©???•ë³´ ë°?? í°)
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
     * ì¹´ì¹´??ë¡œê·¸??
     * @param code ì¹´ì¹´???¸ì¦ ì½”ë“œ
     * @returns ?¸ì¦ ?‘ë‹µ (?¬ìš©???•ë³´ ë°?? í°)
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
     * ?Œì›ê°€??
     * @param signupRequest ?Œì›ê°€???”ì²­ ?°ì´??
     * @returns ?¸ì¦ ?‘ë‹µ (?¬ìš©???•ë³´ ë°?? í°)
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
     * ë¡œê·¸?„ì›ƒ
     */
    logout: async (): Promise<void> => {
        await removeToken();
    },

    /**
     * ?„ì¬ ?¬ìš©???•ë³´ ê°€?¸ì˜¤ê¸?
     * @returns ?¬ìš©???•ë³´
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
     * ë¹„ë?ë²ˆí˜¸ ?¬ì„¤???”ì²­
     * @param email ?¬ìš©???´ë©”??
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
     * ë¹„ë?ë²ˆí˜¸ ?¬ì„¤??
     * @param token ?¬ì„¤??? í°
     * @param newPassword ??ë¹„ë?ë²ˆí˜¸
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
     * ?¸ì¦ ?íƒœ ?•ì¸
     * @returns ?¸ì¦ ?¬ë?
     */
    isAuthenticated: async (): Promise<boolean> => {
        const token = await getToken();
        return !!token;
    },
};

export default authService;
