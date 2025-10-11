import api from '../../../common/utils/api';

// [API Mapping] Master (사장) MyPage APIs — Phase 2 minimal integration
// - GET /api/master/mypage
// - GET /api/master/profile
// - PUT /api/master/profile
// - GET /api/master/stores
// - GET /api/master/stats/store/{storeId}
// - GET /api/master/stats/overall
// - GET /api/master/timeoff/pending
// - PUT /api/master/timeoff/{requestId}/approve
// - PUT /api/master/timeoff/{requestId}/reject

export interface MasterProfile { id: number; name?: string; phone?: string }
export interface StoreStats { storeId: number; employees?: number; todayAttendance?: number; monthPayroll?: number }
export interface OverallStats { stores?: number; employees?: number; monthPayroll?: number }

async function mypage(): Promise<any> {
  const res = await api.get<any>(`/api/master/mypage`);
  return res.data?.data || res.data;
}

async function getProfile(): Promise<MasterProfile> {
  const res = await api.get<MasterProfile>(`/api/master/profile`);
  return res.data?.data || res.data as any;
}

async function putProfile(data: Partial<MasterProfile>): Promise<MasterProfile> {
  const res = await api.put<MasterProfile>(`/api/master/profile`, data);
  return res.data?.data || res.data as any;
}

async function stores(): Promise<any[]> {
  const res = await api.get<any[]>(`/api/master/stores`);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function storeStats(storeId: number): Promise<StoreStats> {
  const res = await api.get<StoreStats>(`/api/master/stats/store/${storeId}`);
  return res.data?.data || res.data as any;
}

async function overallStats(): Promise<OverallStats> {
  const res = await api.get<OverallStats>(`/api/master/stats/overall`);
  return res.data?.data || res.data as any;
}

async function timeoffPending(): Promise<any[]> {
  const res = await api.get<any[]>(`/api/master/timeoff/pending`);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function approve(requestId: number): Promise<{ success: boolean }>{
  const res = await api.put<{ success: boolean }>(`/api/master/timeoff/${requestId}/approve`);
  return res.data?.data || res.data || { success: true };
}

async function reject(requestId: number): Promise<{ success: boolean }>{
  const res = await api.put<{ success: boolean }>(`/api/master/timeoff/${requestId}/reject`);
  return res.data?.data || res.data || { success: true };
}

const masterService = {
  mypage,
  getProfile,
  putProfile,
  stores,
  storeStats,
  overallStats,
  timeoffPending,
  approve,
  reject,
};

export default masterService;
