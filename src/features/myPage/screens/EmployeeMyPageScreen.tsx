import React, { useState } from 'react';

interface Store {
    id: number;
    name: string;
    type: '정규직' | '아르바이트' | '계약직';
    status: '주력 매장' | '부업' | '휴직중';
    hourlyWage: number;
    startDate: string;
    monthlyHours: number;
    expectedSalary: number;
    paymentDate: string;
    address: string;
    gradientColors: string;
}

interface Schedule {
    day: string;
    store: string;
    time: string;
    hours: number;
    dailyPay: number;
    isToday?: boolean;
}

interface JobSupport {
    id: number;
    title: string;
    type: string;
    description: string;
    organization: string;
    gradientColors: string;
}

const EmployeeMyPage: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const stores: Store[] = [
        {
            id: 1,
            name: '소담 카페 강남점',
            type: '정규직',
            status: '주력 매장',
            hourlyWage: 12000,
            startDate: '2023.03.15',
            monthlyHours: 120,
            expectedSalary: 1800000,
            paymentDate: '매월 25일 (다음 급여일: 2024.02.25)',
            address: '서울시 강남구 테헤란로 123',
            gradientColors: 'from-blue-500 to-blue-400'
        },
        {
            id: 2,
            name: '소담 베이커리 홍대점',
            type: '아르바이트',
            status: '부업',
            hourlyWage: 9620,
            startDate: '2024.01.10',
            monthlyHours: 36,
            expectedSalary: 680000,
            paymentDate: '매월 말일 (다음 급여일: 2024.02.29)',
            address: '서울시 마포구 홍익로 456',
            gradientColors: 'from-purple-500 to-purple-400'
        },
        {
            id: 3,
            name: '소담 치킨 신촌점',
            type: '계약직',
            status: '휴직중',
            hourlyWage: 11000,
            startDate: '2023.11.01',
            monthlyHours: 0,
            expectedSalary: 0,
            paymentDate: '매월 15일 (휴직으로 인한 급여 없음)',
            address: '서울시 서대문구 신촌로 789',
            gradientColors: 'from-orange-500 to-orange-400'
        }
    ];

    const schedules: Schedule[] = [
        {
            day: '오늘',
            store: '소담 카페 강남점',
            time: '09:00 - 18:00 (8시간)',
            hours: 8,
            dailyPay: 96000,
            isToday: true
        },
        {
            day: '내일',
            store: '소담 베이커리 홍대점',
            time: '14:00 - 20:00 (6시간)',
            hours: 6,
            dailyPay: 57720
        },
        {
            day: '모레',
            store: '소담 카페 강남점',
            time: '09:00 - 18:00 (8시간)',
            hours: 8,
            dailyPay: 96000
        }
    ];

    const jobSupports: JobSupport[] = [
        {
            id: 1,
            title: '국민취업지원제도',
            type: '정부지원',
            description: '월 50만원 × 6개월 구직촉진수당 + 취업지원서비스',
            organization: '고용노동부 | 만 18~34세',
            gradientColors: 'from-blue-500 to-purple-600'
        },
        {
            id: 2,
            title: '청년내일채움공제',
            type: '적금형',
            description: '2년 근무시 최대 1,200만원 + 기업지원금',
            organization: '중소벤처기업부 | 만 15~34세',
            gradientColors: 'from-green-500 to-teal-600'
        },
        {
            id: 3,
            title: 'K-Digital Training',
            type: '교육지원',
            description: '디지털 신기술 교육 + 월 최대 31.6만원 훈련수당',
            organization: '고용노동부 | 국민내일배움카드',
            gradientColors: 'from-orange-500 to-red-500'
        }
    ];

    const handleAlert = (title: string, message?: string) => {
        setAlertTitle(title);
        setAlertMessage(message ?? `${title} 화면으로 이동합니다.`);
        setShowAlert(true);
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case '주력 매장': return 'bg-green-500';
            case '부업': return 'bg-yellow-500';
            case '휴직중': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden" style={{ height: '800px' }}>
            {/* 상태바 */}
            <div className="bg-black text-white text-xs flex justify-between items-center px-4 py-1">
                <span>9:41</span>
                <span>📶 📶 📶 🔋</span>
            </div>

            {/* 앱 컨텐츠 */}
            <div className="h-full overflow-y-auto bg-gray-50">
                {/* 헤더 */}
                <div className="bg-white px-5 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">안녕하세요, 김알바님</h1>
                        <p className="text-sm text-gray-600">오늘도 수고하세요! 💪</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z"/>
                        </svg>
                    </button>
                </div>

                {/* 전체 현황 카드 */}
                <div className="mx-5 mb-6 bg-white rounded-2xl p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">이번달 급여 현황</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">근무 매장</p>
                            <p className="text-lg font-bold text-gray-800">2개</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">총 근무시간</p>
                            <p className="text-lg font-bold text-gray-800">156시간</p>
                        </div>
                    </div>
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">이번달 예상 급여</p>
                        <p className="text-2xl font-bold text-orange-500">2,480,000원</p>
                    </div>
                </div>

                {/* 근무 매장 목록 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center px-5 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">근무 매장</h2>
                        <button className="text-sm text-blue-600 font-medium">전체보기</button>
                    </div>

                    <div className="flex overflow-x-auto space-x-4 px-5 pb-2">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className={`min-w-80 bg-gradient-to-br ${store.gradientColors} rounded-2xl p-5 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform`}
                                onClick={() => handleAlert(`${store.name} 상세보기`)}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">{store.name}</h3>
                                    <div className="flex flex-col items-end">
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-xs mb-1">{store.type}</span>
                                        <span className={`${getStatusColor(store.status)} px-2 py-1 rounded-lg text-xs`}>{store.status}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">시급</p>
                                        <p className="text-base font-bold">{store.hourlyWage.toLocaleString()}원</p>
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">입사일</p>
                                        <p className="text-base font-bold">{store.startDate}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">이번달 근무시간</p>
                                        <p className="text-base font-bold">{store.monthlyHours}시간</p>
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">예상 급여</p>
                                        <p className="text-base font-bold">{store.expectedSalary.toLocaleString()}원</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs opacity-80 mb-1">급여일</p>
                                    <p className="text-sm font-bold">{store.paymentDate}</p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white border-opacity-20">
                                    <p className="text-xs opacity-80">{store.address}</p>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 빠른 메뉴 */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 px-5 mb-4">근무 관리</h2>
                    <div className="grid grid-cols-4 gap-4 px-5">
                        <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => handleAlert('출퇴근 기록')}>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-700">출퇴근</span>
                        </button>

                        <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => handleAlert('급여 명세서')}>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-700">급여명세서</span>
                        </button>

                        <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => handleAlert('근무 일정')}>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-700">근무일정</span>
                        </button>

                        <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => handleAlert('휴가 신청')}>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-700">휴가신청</span>
                        </button>
                    </div>
                </div>

                {/* 이번주 근무 일정 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center px-5 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">이번주 근무 일정</h2>
                        <button className="text-sm text-blue-600 font-medium">전체보기</button>
                    </div>

                    <div className="px-5">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="space-y-3">
                                {schedules.map((schedule, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-3 rounded-xl ${
                                            schedule.isToday ? 'bg-orange-50' : 'bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                                                schedule.isToday ? 'bg-orange-500' : 'bg-gray-300'
                                            }`}>
                                                <span className="text-white font-bold text-sm">{schedule.day}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{schedule.store}</p>
                                                <p className="text-sm text-gray-600">{schedule.time}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${schedule.isToday ? 'text-orange-500' : 'text-gray-600'}`}>
                      {schedule.dailyPay.toLocaleString()}원
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 국가 청년 취업 지원 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center px-5 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">🎯 청년 취업 지원</h2>
                        <button className="text-sm text-blue-600 font-medium">더보기</button>
                    </div>

                    <div className="space-y-3 px-5">
                        {jobSupports.map((support) => (
                            <div
                                key={support.id}
                                className={`bg-gradient-to-r ${support.gradientColors} rounded-2xl p-4 text-white cursor-pointer hover:shadow-lg transition-shadow`}
                                onClick={() => handleAlert(`${support.title} 신청하기`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg">{support.title}</h3>
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-xs">{support.type}</span>
                                </div>
                                <p className="text-sm opacity-90 mb-3">{support.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs opacity-80">{support.organization}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 스킬업 & 자격증 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center px-5 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">📚 스킬업 & 자격증</h2>
                        <button className="text-sm text-blue-600 font-medium">전체보기</button>
                    </div>

                    <div className="px-5">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors" onClick={() => handleAlert('온라인 강의 시작하기')}>
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700 text-center">온라인<br/>강의</span>
                                </button>

                                <button className="flex flex-col items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors" onClick={() => handleAlert('자격증 준비 시작하기')}>
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700 text-center">자격증<br/>준비</span>
                                </button>

                                <button className="flex flex-col items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors" onClick={() => handleAlert('직업훈련 시작하기')}>
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700 text-center">직업<br/>훈련</span>
                                </button>

                                <button className="flex flex-col items-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors" onClick={() => handleAlert('어학 공부 시작하기')}>
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700 text-center">어학<br/>공부</span>
                                </button>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-2">추천 자격증</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">컴활 1급</span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">토익 700+</span>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">GTQ</span>
                                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">바리스타</span>
                                    <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">조리기능사</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 근로자 권익 정보 */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 px-5 mb-4">⚖️ 근로자 권익 정보</h2>
                    <div className="mx-5 bg-white rounded-2xl p-5 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">2024년 최저임금</p>
                                <p className="text-base font-bold text-gray-800">9,620원</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">주휴수당</p>
                                <p className="text-base font-bold text-gray-800">15시간 이상시</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">연장근무 수당</p>
                                <p className="text-base font-bold text-gray-800">1.5배</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">야간근무 수당</p>
                                <p className="text-base font-bold text-gray-800">1.5배</p>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center pt-4 border-t border-gray-200 text-blue-600 font-medium" onClick={() => handleAlert('근로자 권익')}>
                            <span className="mr-1">근로자 권익 자세히 보기</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 하단 여백 */}
                <div className="h-20"></div>
            </div>

            {/* 알림 모달 */}
            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeAlert}>
                    <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{alertTitle}</h3>
                        <p className="text-gray-600 mb-4">{alertMessage}</p>
                        <button onClick={closeAlert} className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium">
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeMyPage;
