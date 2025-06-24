import {Workplace} from '../types';

// Mock data for workplaces
const mockWorkplaces: Workplace[] = [
    {
        id: '1',
        name: '카페 소담',
        address: '서울시 강남구 역삼동 123-45',
    },
    {
        id: '2',
        name: '레스토랑 소담',
        address: '서울시 서초구 서초동 456-78',
    },
    {
        id: '3',
        name: '베이커리 소담',
        address: '서울시 마포구 합정동 789-10',
    },
];

// Get all workplaces
export const getWorkplaces = async (): Promise<Workplace[]> => {
    // TODO: API 연결 필요 - 매장 목록을 가져오는 API 호출로 대체해야 함
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockWorkplaces);
        }, 500);
    });
};

// Get workplace by ID
export const getWorkplaceById = async (id: string): Promise<Workplace | undefined> => {
    // TODO: API 연결 필요 - 특정 매장 정보를 가져오는 API 호출로 대체해야 함
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const workplace = mockWorkplaces.find(wp => wp.id === id);
            resolve(workplace);
        }, 300);
    });
};
