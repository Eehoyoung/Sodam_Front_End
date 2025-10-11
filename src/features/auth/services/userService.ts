import api from '../../../common/utils/api';

// [API Mapping] User APIs — Phase 2 minimal integration
// - POST /api/users/{userId}/purpose
// - GET /api/user/{userId}
// - PUT /api/user/{employeeId}

export interface PurposePayload { purpose: 'EMPLOYER' | 'EMPLOYEE' }
export interface UserProfile { id: number; name?: string; role?: string; phone?: string }

async function setPurpose(userId: number, data: PurposePayload): Promise<{ success: boolean }>{
  const res = await api.post<{ success: boolean }>(`/api/users/${userId}/purpose`, data);
  return res.data?.data || res.data || { success: true };
}

async function getUser(userId: number): Promise<UserProfile>{
  const res = await api.get<UserProfile>(`/api/user/${userId}`);
  return res.data?.data || res.data as any;
}

async function updateEmployee(employeeId: number, data: Partial<UserProfile>): Promise<UserProfile>{
  const res = await api.put<UserProfile>(`/api/user/${employeeId}`, data);
  return res.data?.data || res.data as any;
}

const userService = {
  setPurpose,
  getUser,
  updateEmployee,
};

export default userService;
