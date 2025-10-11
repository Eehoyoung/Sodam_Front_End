import api from '../../../common/utils/api';

// [API Mapping] TimeOff APIs — Phase 2 minimal integration
// - POST /api/timeoff (신규 신청)
// - GET /api/timeoff/store/{storeId}
// - GET /api/timeoff/store/{storeId}/status/{status}
// - GET /api/timeoff/employee/{employeeId}
// - PUT /api/timeoff/{requestId}/approve
// - PUT /api/timeoff/{requestId}/reject

export interface TimeOffRequestPayload { employeeId: number; storeId: number; from: string; to: string; reason?: string }
export interface TimeOffItem { id: number; employeeId: number; storeId: number; status: string; from: string; to: string }

async function create(payload: TimeOffRequestPayload): Promise<{ id: number }>{
  const res = await api.post<{ id: number }>(`/api/timeoff`, payload);
  return res.data?.data || res.data as any;
}

async function getStoreAll(storeId: number): Promise<TimeOffItem[]>{
  const res = await api.get<TimeOffItem[]>(`/api/timeoff/store/${storeId}`);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function getByStatus(storeId: number, status: 'PENDING'|'APPROVED'|'REJECTED'): Promise<TimeOffItem[]>{
  const res = await api.get<TimeOffItem[]>(`/api/timeoff/store/${storeId}/status/${status}`);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function getEmployeeAll(employeeId: number): Promise<TimeOffItem[]>{
  const res = await api.get<TimeOffItem[]>(`/api/timeoff/employee/${employeeId}`);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function approve(requestId: number): Promise<{ success: boolean }>{
  const res = await api.put<{ success: boolean }>(`/api/timeoff/${requestId}/approve`);
  return res.data?.data || res.data || { success: true };
}

async function reject(requestId: number): Promise<{ success: boolean }>{
  const res = await api.put<{ success: boolean }>(`/api/timeoff/${requestId}/reject`);
  return res.data?.data || res.data || { success: true };
}

const timeOffService = {
  create,
  getStoreAll,
  getByStatus,
  getEmployeeAll,
  approve,
  reject,
};

export default timeOffService;
