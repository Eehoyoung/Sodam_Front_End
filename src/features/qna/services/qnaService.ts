import api from '../../../common/utils/api';

// [API Mapping] QnA APIs — Phase 2 minimal integration
// - GET /api/site-questions?query=&page=&size=
// - GET /api/site-questions/{id}
// - POST /api/site-questions (multipart/form-data)

export interface QnAItem { id: number; title: string; content: string; createdAt?: string }

async function list(params?: { page?: number; size?: number; query?: string }): Promise<QnAItem[]> {
  const res = await api.get<QnAItem[]>(`/api/site-questions`, params as any);
  const data: any = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}

async function getById(id: number): Promise<QnAItem> {
  const res = await api.get<QnAItem>(`/api/site-questions/${id}`);
  return res.data?.data || res.data as any;
}

async function create(payload: { title: string; content: string; attachments?: Array<{ name: string; uri: string; type: string }> }): Promise<{ id: number }>{
  // multipart/form-data 구성
  const form = new FormData();
  form.append('title', payload.title);
  form.append('content', payload.content);
  (payload.attachments || []).forEach((f, idx) => {
    form.append('files', {
      // @ts-ignore RN FormData File
      uri: f.uri,
      name: f.name || `file_${idx}`,
      type: f.type || 'application/octet-stream',
    });
  });

  const res = await api.post<{ id: number }>(`/api/site-questions`, form as any, {
    headers: { 'Content-Type': 'multipart/form-data' }
  } as any);
  return res.data?.data || res.data as any;
}

async function search(query: string): Promise<QnAItem[]> {
  return list({ query });
}

const qnaService = {
  list,
  getById,
  create,
  search,
};

export default qnaService;
