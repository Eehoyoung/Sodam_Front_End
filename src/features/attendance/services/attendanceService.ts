/**
 * 출퇴�?관�?관???�비??
 * 출퇴�?기록 조회, 출근, ?�근, ?�정 �??�계 기능???�공?�니??
 */

import api from '../../../common/utils/api';
import {
    AttendanceFilter,
    AttendanceRecord,
    AttendanceStatistics,
    AttendanceStatus,
    CheckInRequest,
    CheckOutRequest,
    UpdateAttendanceRequest
} from '../types';
import {NFCVerifyResponse, verifyCheckInByNFC, verifyCheckOutByNFC} from './nfcAttendanceService';
import {logger} from '../../../utils/logger';

// 출퇴�?관�??�비??객체
const attendanceService = {
    /**
     * 출퇴�?기록 목록 조회
     * @param filter ?�터 조건
     * @returns 출퇴�?기록 목록
     */
    getAttendanceRecords: async (filter: AttendanceFilter): Promise<AttendanceRecord[]> => {
        try {
            const response = await api.get<AttendanceRecord[]>('/attendance', filter);
            return response.data;
        } catch (error) {
            logger.error('출퇴�?기록??가?�오??�??�류가 발생?�습?�다', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�정 출퇴�?기록 조회
     * @param attendanceId 출퇴�?기록 ID
     * @returns 출퇴�?기록
     */
    getAttendanceById: async (attendanceId: string): Promise<AttendanceRecord> => {
        try {
            const response = await api.get<AttendanceRecord>(`/attendance/${attendanceId}`);
            return response.data;
        } catch (error) {
            logger.error('?�정 출퇴�?기록??가?�오??�??�류가 발생?�습?�다', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 출근 처리
     * @param checkInData 출근 ?�이??
     * @returns ?�성??출퇴�?기록
     */
    checkIn: async (checkInData: CheckInRequest): Promise<AttendanceRecord> => {
        try {
            const response = await api.post<AttendanceRecord>('/attendance/check-in', checkInData);
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�근 처리
     * @param attendanceId 출퇴�?기록 ID
     * @param checkOutData ?�근 ?�이??
     * @returns ?�데?�트??출퇴�?기록
     */
    checkOut: async (attendanceId: string, checkOutData: CheckOutRequest): Promise<AttendanceRecord> => {
        try {
            const response = await api.post<AttendanceRecord>(`/attendance/${attendanceId}/check-out`, checkOutData);
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 출퇴�?기록 ?�정
     * @param attendanceId 출퇴�?기록 ID
     * @param updateData ?�정 ?�이??
     * @returns ?�데?�트??출퇴�?기록
     */
    updateAttendance: async (attendanceId: string, updateData: UpdateAttendanceRequest): Promise<AttendanceRecord> => {
        try {
            const response = await api.put<AttendanceRecord>(`/attendance/${attendanceId}`, updateData);
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 출퇴�?기록 ??��
     * @param attendanceId 출퇴�?기록 ID
     */
    deleteAttendance: async (attendanceId: string): Promise<void> => {
        try {
            await api.delete(`/attendance/${attendanceId}`);
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�재 근무 ?�태 조회
     * @param workplaceId 근무지 ID
     * @returns ?�재 출퇴�?기록 (?�으�?null)
     */
    getCurrentAttendance: async (workplaceId: string): Promise<AttendanceRecord | null> => {
        try {
            const response = await api.get<AttendanceRecord | null>('/attendance/current', {workplaceId});
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 출퇴�??�계 조회
     * @param filter ?�터 조건
     * @returns 출퇴�??�계
     */
    getAttendanceStatistics: async (filter: AttendanceFilter): Promise<AttendanceStatistics> => {
        try {
            const response = await api.get<AttendanceStatistics>('/attendance/statistics', filter);
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 직원�?출퇴�??�계 조회
     * @param employeeId 직원 ID
     * @param startDate ?�작??
     * @param endDate 종료??
     * @returns 직원�?출퇴�??�계
     */
    getEmployeeAttendanceStatistics: async (
        employeeId: string,
        startDate: string,
        endDate: string
    ): Promise<AttendanceStatistics> => {
        try {
            const response = await api.get<AttendanceStatistics>(`/attendance/statistics/employee/${employeeId}`, {
                startDate,
                endDate
            });
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * 근무지�?출퇴�??�계 조회
     * @param workplaceId 근무지 ID
     * @param startDate ?�작??
     * @param endDate 종료??
     * @returns 근무지�?출퇴�??�계
     */
    getWorkplaceAttendanceStatistics: async (
        workplaceId: string,
        startDate: string,
        endDate: string
    ): Promise<AttendanceStatistics> => {
        try {
            const response = await api.get<AttendanceStatistics>(`/attendance/statistics/workplace/${workplaceId}`, {
                startDate,
                endDate
            });
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�괄 출퇴�??�태 변�?
     * @param attendanceIds 출퇴�?기록 ID 배열
     * @param status 변경할 ?�태
     * @returns ?�데?�트??출퇴�?기록 배열
     */
    batchUpdateStatus: async (
        attendanceIds: string[],
        status: AttendanceStatus
    ): Promise<AttendanceRecord[]> => {
        try {
            const response = await api.put<AttendanceRecord[]>('/attendance/batch-status', {
                attendanceIds,
                status
            });
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },

    /**
     * ?�치 기반 출퇴�??�증
     * @param employeeId 직원 ID
     * @param workplaceId 근무지 ID
     * @param latitude ?�도
     * @param longitude 경도
     * @returns ?�증 결과 (?�공 ?��? �?거리 ?�보)
     */
    verifyLocationAttendance: async (
        employeeId: string,
        workplaceId: string,
        latitude: number,
        longitude: number
    ): Promise<{ success: boolean; distance?: number; message?: string }> => {
        try {
            const response = await api.post<{ success: boolean; distance?: number; message?: string }>(
                '/attendance/location-verify',
                {
                    employeeId,
                    workplaceId,
                    latitude,
                    longitude
                }
            );
            return response.data;
        } catch (error) {
            logger.error('', 'ATTENDANCE_SERVICE', error);
            throw error;
        }
    },



    /**
     * NFC ?�그 기반 출퇴�??�증 (?�퍼)
     * @param employeeId 직원 ID (number ?�는 string ?�용)
     * @param workplaceId 근무지 ID (number ?�는 string ?�용)
     * @param nfcTagId NFC ?�그 문자??
     * @param isCheckOut ?�근 ?��? (기본 false = 출근)
     */
    verifyNfcTagAttendance: async (
        employeeId: string | number,
        workplaceId: string | number,
        nfcTagId: string,
        isCheckOut: boolean = false
    ): Promise<NFCVerifyResponse> => {
        const employeeIdNum = typeof employeeId === 'string' ? Number(employeeId) : employeeId;
        const storeIdNum = typeof workplaceId === 'string' ? Number(workplaceId) : workplaceId;
        if (!Number.isFinite(employeeIdNum) || !Number.isFinite(storeIdNum)) {
            return {success: false, message: '?�효?��? ?��? ID?�니??'};
        }

        if (isCheckOut) {
            return await verifyCheckOutByNFC({employeeId: employeeIdNum, storeId: storeIdNum, nfcTagId});
        }
        return await verifyCheckInByNFC({employeeId: employeeIdNum, storeId: storeIdNum, nfcTagId});
    },
};

export default attendanceService;
