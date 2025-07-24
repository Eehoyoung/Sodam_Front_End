import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Camera, useCameraDevices, useCodeScanner} from 'react-native-vision-camera';
import {Button, Card, MainLayout} from '../../../common/components';
import attendanceService from '../services/attendanceService';
import {AttendanceRecord, AttendanceStatus} from '../types';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';

// 네비게이션 타입 정의
type AttendanceStackParamList = {
    Attendance: undefined;
    AttendanceDetail: { attendanceId: string };
    CheckIn: undefined;
    QRScan: undefined;
};

type AttendanceScreenNavigationProp = StackNavigationProp<AttendanceStackParamList, 'Attendance'>;

const AttendanceScreen = () => {
    const navigation = useNavigation<AttendanceScreenNavigationProp>();
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord | null>(null);
    const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<string>('');
    const [workplaces, setWorkplaces] = useState<{ id: string; name: string }[]>([]);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');
    const [checkInMethod, setCheckInMethod] = useState<'standard' | 'location' | 'qr'>('standard');

    // Vision Camera 설정
    const devices = useCameraDevices();
    const device = devices.find(d => d.position === 'back');

    // 코드 스캐너 설정
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (codes.length > 0) {
                handleQRCodeScanned(codes[0].value || '');
            }
        }
    });

    // 카메라 권한 확인
    const checkCameraPermission = async () => {
        const permission = await Camera.getCameraPermissionStatus();

        if (permission !== 'granted') {
            const newPermission = await Camera.requestCameraPermission();

            if (newPermission !== 'granted') {
                Alert.alert(
                    '카메라 권한 필요',
                    'QR 코드 스캔을 위해서는 카메라 접근 권한이 필요합니다.',
                    [{text: '확인'}]
                );
                return false;
            }
        }

        return true;
    };

    // QR 스캐너 열기
    const openQRScanner = async () => {
        const hasPermission = await checkCameraPermission();
        if (hasPermission) {
            setShowQRScanner(true);
        }
    };

    // 출퇴근 기록 조회
    const fetchAttendanceRecords = async () => {
        try {
            // 현재 날짜 기준 한 달 전부터 현재까지의 기록 조회
            const endDate = format(new Date(), 'yyyy-MM-dd');
            const startDate = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd');

            const filter = {
                startDate,
                endDate,
                workplaceId: selectedWorkplaceId || undefined
            };

            const data = await attendanceService.getAttendanceRecords(filter);
            setAttendanceRecords(data);

            // 현재 근무 상태 조회
            if (selectedWorkplaceId) {
                const currentData = await attendanceService.getCurrentAttendance(selectedWorkplaceId);
                setCurrentAttendance(currentData);
            }
        } catch (error) {
            console.error('출퇴근 기록을 가져오는 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '출퇴근 기록을 불러오는 데 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 근무지 목록 조회 (실제 구현에서는 API 호출)
    const fetchWorkplaces = async () => {
        try {
            // 임시 데이터 (실제 구현에서는 API 호출)
            const data = [
                {id: '1', name: '카페 소담'},
                {id: '2', name: '레스토랑 소담'}
            ];
            setWorkplaces(data);

            if (data.length > 0) {
                setSelectedWorkplaceId(data[0].id);
            }
        } catch (error) {
            console.error('근무지 목록을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    // 위치 권한 요청
    const requestLocationPermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            const result = await request(permission);

            if (result === RESULTS.GRANTED) {
                setLocationPermissionGranted(true);
                getCurrentLocation();
            } else {
                setLocationPermissionGranted(false);
                Alert.alert(
                    '위치 권한 필요',
                    '위치 기반 출퇴근을 위해서는 위치 접근 권한이 필요합니다.',
                    [{text: '확인'}]
                );
            }
        } catch (error) {
            console.error('위치 권한 요청 중 오류가 발생했습니다:', error);
        }
    };

    // 현재 위치 가져오기
    const getCurrentLocation = () => {
        if (locationPermissionGranted) {
            Geolocation.getCurrentPosition(
                position => {
                    const {latitude, longitude} = position.coords;
                    setCurrentLocation({latitude, longitude});
                },
                error => {
                    console.error('위치 정보를 가져오는 중 오류가 발생했습니다:', error);
                    Alert.alert('오류', '위치 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
        }
    };

    // QR 코드 스캔 처리
    const handleQRCodeScanned = (scannedQRCode: string) => {
        setQrCode(scannedQRCode);
        setShowQRScanner(false);

        // QR 코드로 출퇴근 처리
        if (currentAttendance) {
            handleCheckOutWithQR(scannedQRCode);
        } else {
            handleCheckInWithQR(scannedQRCode);
        }
    };

    // 화면 로드 시 데이터 조회 및 위치 권한 요청
    useEffect(() => {
        fetchWorkplaces();
        requestLocationPermission();
    }, []);

    // 선택된 근무지가 변경되면 출퇴근 기록 다시 조회
    useEffect(() => {
        if (selectedWorkplaceId) {
            fetchAttendanceRecords();
        }
    }, [selectedWorkplaceId]);

    // 새로고침 처리
    const handleRefresh = () => {
        setRefreshing(true);
        fetchAttendanceRecords();
    };

    // 기본 출근 처리
    const handleCheckIn = async () => {
        if (!selectedWorkplaceId) {
            Alert.alert('알림', '근무지를 선택해주세요.');
            return;
        }

        try {
            const checkInData = {
                workplaceId: selectedWorkplaceId
            };

            const response = await attendanceService.checkIn(checkInData);
            Alert.alert('성공', '출근 처리되었습니다.');
            setCurrentAttendance(response);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('출근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '출근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 위치 기반 출근 처리
    const handleCheckInWithLocation = async () => {
        if (!selectedWorkplaceId) {
            Alert.alert('알림', '근무지를 선택해주세요.');
            return;
        }

        if (!locationPermissionGranted) {
            requestLocationPermission();
            return;
        }

        if (!currentLocation) {
            Alert.alert('알림', '위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.');
            getCurrentLocation();
            return;
        }

        try {
            // 위치 기반 인증 먼저 수행
            const verifyResult = await attendanceService.verifyLocationAttendance(
                '1', // 임시 employeeId (실제 구현에서는 로그인한 사용자 ID 사용)
                selectedWorkplaceId,
                currentLocation.latitude,
                currentLocation.longitude
            );

            if (!verifyResult.success) {
                Alert.alert('알림', verifyResult.message || '위치 인증에 실패했습니다. 매장 반경 내에서 다시 시도해주세요.');
                return;
            }

            // 인증 성공 시 출근 처리
            const checkInData = {
                workplaceId: selectedWorkplaceId,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            };

            const response = await attendanceService.checkIn(checkInData);
            Alert.alert('성공', '위치 기반 출근 처리되었습니다.');
            setCurrentAttendance(response);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('위치 기반 출근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '위치 기반 출근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // QR 코드 기반 출근 처리
    const handleCheckInWithQR = async (scannedQRCode: string) => {
        if (!selectedWorkplaceId) {
            Alert.alert('알림', '근무지를 선택해주세요.');
            return;
        }

        try {
            // QR 코드 기반 인증 먼저 수행
            const verifyResult = await attendanceService.verifyQrCodeAttendance(
                '1', // 임시 employeeId (실제 구현에서는 로그인한 사용자 ID 사용)
                selectedWorkplaceId,
                scannedQRCode
            );

            if (!verifyResult.success) {
                Alert.alert('알림', verifyResult.message || 'QR 코드 인증에 실패했습니다. 다시 시도해주세요.');
                return;
            }

            // 인증 성공 시 출근 처리
            const checkInData = {
                workplaceId: selectedWorkplaceId
            };

            const response = await attendanceService.checkIn(checkInData);
            Alert.alert('성공', 'QR 코드 기반 출근 처리되었습니다.');
            setCurrentAttendance(response);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('QR 코드 기반 출근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', 'QR 코드 기반 출근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 기본 퇴근 처리
    const handleCheckOut = async () => {
        if (!currentAttendance) {
            Alert.alert('알림', '현재 출근 상태가 아닙니다.');
            return;
        }

        try {
            const checkOutData = {
                workplaceId: selectedWorkplaceId
            };

            await attendanceService.checkOut(currentAttendance.id, checkOutData);
            Alert.alert('성공', '퇴근 처리되었습니다.');
            setCurrentAttendance(null);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('퇴근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '퇴근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 위치 기반 퇴근 처리
    const handleCheckOutWithLocation = async () => {
        if (!currentAttendance) {
            Alert.alert('알림', '현재 출근 상태가 아닙니다.');
            return;
        }

        if (!locationPermissionGranted) {
            requestLocationPermission();
            return;
        }

        if (!currentLocation) {
            Alert.alert('알림', '위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.');
            getCurrentLocation();
            return;
        }

        try {
            // 위치 기반 인증 먼저 수행
            const verifyResult = await attendanceService.verifyLocationAttendance(
                '1', // 임시 employeeId (실제 구현에서는 로그인한 사용자 ID 사용)
                selectedWorkplaceId,
                currentLocation.latitude,
                currentLocation.longitude
            );

            if (!verifyResult.success) {
                Alert.alert('알림', verifyResult.message || '위치 인증에 실패했습니다. 매장 반경 내에서 다시 시도해주세요.');
                return;
            }

            // 인증 성공 시 퇴근 처리
            const checkOutData = {
                workplaceId: selectedWorkplaceId,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            };

            await attendanceService.checkOut(currentAttendance.id, checkOutData);
            Alert.alert('성공', '위치 기반 퇴근 처리되었습니다.');
            setCurrentAttendance(null);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('위치 기반 퇴근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '위치 기반 퇴근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // QR 코드 기반 퇴근 처리
    const handleCheckOutWithQR = async (scannedQRCode: string) => {
        if (!currentAttendance) {
            Alert.alert('알림', '현재 출근 상태가 아닙니다.');
            return;
        }

        try {
            // QR 코드 기반 인증 먼저 수행
            const verifyResult = await attendanceService.verifyQrCodeAttendance(
                '1', // 임시 employeeId (실제 구현에서는 로그인한 사용자 ID 사용)
                selectedWorkplaceId,
                scannedQRCode
            );

            if (!verifyResult.success) {
                Alert.alert('알림', verifyResult.message || 'QR 코드 인증에 실패했습니다. 다시 시도해주세요.');
                return;
            }

            // 인증 성공 시 퇴근 처리
            const checkOutData = {
                workplaceId: selectedWorkplaceId
            };

            await attendanceService.checkOut(currentAttendance.id, checkOutData);
            Alert.alert('성공', 'QR 코드 기반 퇴근 처리되었습니다.');
            setCurrentAttendance(null);
            fetchAttendanceRecords();
        } catch (error) {
            console.error('QR 코드 기반 퇴근 처리 중 오류가 발생했습니다:', error);
            Alert.alert('오류', 'QR 코드 기반 퇴근 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 출퇴근 상태에 따른 색상 반환
    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.CHECKED_IN:
                return '#4CAF50'; // 출근 - 초록색
            case AttendanceStatus.CHECKED_OUT:
                return '#2196F3'; // 퇴근 - 파란색
            case AttendanceStatus.LATE:
                return '#FF9800'; // 지각 - 주황색
            case AttendanceStatus.ABSENT:
                return '#F44336'; // 결근 - 빨간색
            case AttendanceStatus.EARLY_LEAVE:
                return '#FF5722'; // 조퇴 - 주황빨간색
            case AttendanceStatus.ON_LEAVE:
                return '#9C27B0'; // 휴가 - 보라색
            default:
                return '#757575'; // 기본 - 회색
        }
    };

    // 출퇴근 상태 텍스트 반환
    const getStatusText = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PENDING:
                return '출근 전';
            case AttendanceStatus.CHECKED_IN:
                return '출근';
            case AttendanceStatus.CHECKED_OUT:
                return '퇴근';
            case AttendanceStatus.LATE:
                return '지각';
            case AttendanceStatus.ABSENT:
                return '결근';
            case AttendanceStatus.EARLY_LEAVE:
                return '조퇴';
            case AttendanceStatus.ON_LEAVE:
                return '휴가';
            default:
                return '알 수 없음';
        }
    };

    // 출퇴근 기록 항목 렌더링
    const renderAttendanceItem = ({item}: { item: AttendanceRecord }) => {
        const date = format(new Date(item.date), 'yyyy년 MM월 dd일 (EEE)', {locale: ko});
        const checkInTime = item.checkInTime ? format(new Date(item.checkInTime), 'HH:mm') : '-';
        const checkOutTime = item.checkOutTime ? format(new Date(item.checkOutTime), 'HH:mm') : '-';
        const workHours = item.workHours ? `${item.workHours}시간` : '-';

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('AttendanceDetail', {attendanceId: item.id})}
            >
                <Card style={styles.attendanceCard}>
                    <View style={styles.attendanceHeader}>
                        <Text style={styles.attendanceDate}>{date}</Text>
                        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
                            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                        </View>
                    </View>

                    <View style={styles.attendanceDetails}>
                        <View style={styles.timeContainer}>
                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>출근</Text>
                                <Text style={styles.timeValue}>{checkInTime}</Text>
                            </View>

                            <View style={styles.timeSeparator}/>

                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>퇴근</Text>
                                <Text style={styles.timeValue}>{checkOutTime}</Text>
                            </View>

                            <View style={styles.timeSeparator}/>

                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>근무시간</Text>
                                <Text style={styles.timeValue}>{workHours}</Text>
                            </View>
                        </View>

                        <View style={styles.workplaceContainer}>
                            <Icon name="business" size={14} color="#757575"/>
                            <Text style={styles.workplaceName}>{item.workplaceName}</Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    // 빈 목록 표시
    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="event-busy" size={64} color="#bdc3c7"/>
            <Text style={styles.emptyText}>출퇴근 기록이 없습니다.</Text>
            <Text style={styles.emptySubText}>출근 버튼을 눌러 근무를 시작해보세요.</Text>
        </View>
    );

    // QR 스캐너 렌더링
    const renderQRScanner = () => (
        <Modal
            visible={showQRScanner}
            animationType="slide"
            onRequestClose={() => setShowQRScanner(false)}
        >
            <View style={styles.cameraContainer}>
                <View style={styles.cameraHeader}>
                    <TouchableOpacity
                        onPress={() => setShowQRScanner(false)}
                        style={styles.closeButton}
                    >
                        <Icon name="close" size={24} color="#fff"/>
                    </TouchableOpacity>
                    <Text style={styles.cameraTitle}>QR 코드 스캔</Text>
                </View>

                {device ? (
                    <Camera
                        style={styles.camera}
                        device={device}
                        isActive={showQRScanner}
                        codeScanner={codeScanner}
                    />
                ) : (
                    <View style={styles.loadingCameraContainer}>
                        <ActivityIndicator size="large" color="#fff"/>
                        <Text style={styles.loadingCameraText}>카메라를 불러오는 중...</Text>
                    </View>
                )}

                <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraInstructions}>
                        QR 코드를 화면 중앙에 맞춰주세요
                    </Text>
                </View>
            </View>
        </Modal>
    );

    return (
        <MainLayout>
            <View style={styles.container}>
                {renderQRScanner()}
                <View style={styles.header}>
                    <Text style={styles.title}>출퇴근 관리</Text>
                </View>

                <View style={styles.workplaceSelector}>
                    {workplaces.map(workplace => (
                        <TouchableOpacity
                            key={workplace.id}
                            style={[
                                styles.workplaceOption,
                                selectedWorkplaceId === workplace.id && styles.selectedWorkplace
                            ]}
                            onPress={() => setSelectedWorkplaceId(workplace.id)}
                        >
                            <Text
                                style={[
                                    styles.workplaceOptionText,
                                    selectedWorkplaceId === workplace.id && styles.selectedWorkplaceText
                                ]}
                            >
                                {workplace.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.currentStatusContainer}>
                    <Card style={styles.currentStatusCard}>
                        <Text style={styles.currentStatusTitle}>현재 근무 상태</Text>

                        <View style={styles.statusInfo}>
                            {currentAttendance ? (
                                <>
                                    <View style={styles.statusDetail}>
                                        <Text style={styles.statusLabel}>출근 시간:</Text>
                                        <Text style={styles.statusValue}>
                                            {format(new Date(currentAttendance.checkInTime), 'HH:mm')}
                                        </Text>
                                    </View>

                                    <View style={styles.statusDetail}>
                                        <Text style={styles.statusLabel}>근무 시간:</Text>
                                        <Text style={styles.statusValue}>
                                            {Math.floor((new Date().getTime() - new Date(currentAttendance.checkInTime).getTime()) / (1000 * 60 * 60))}시간
                                            {Math.floor((new Date().getTime() - new Date(currentAttendance.checkInTime).getTime()) / (1000 * 60)) % 60}분
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <Text style={styles.notWorkingText}>현재 근무 중이 아닙니다</Text>
                            )}
                        </View>

                        <View style={styles.checkInMethodSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.methodOption,
                                    checkInMethod === 'standard' && styles.selectedMethod
                                ]}
                                onPress={() => setCheckInMethod('standard')}
                            >
                                <Icon name="login" size={16} color={checkInMethod === 'standard' ? '#fff' : '#555'}/>
                                <Text
                                    style={[
                                        styles.methodOptionText,
                                        checkInMethod === 'standard' && styles.selectedMethodText
                                    ]}
                                >
                                    기본
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.methodOption,
                                    checkInMethod === 'location' && styles.selectedMethod
                                ]}
                                onPress={() => {
                                    setCheckInMethod('location');
                                    if (!locationPermissionGranted) {
                                        requestLocationPermission();
                                    } else {
                                        getCurrentLocation();
                                    }
                                }}
                            >
                                <Icon name="location-on" size={16}
                                      color={checkInMethod === 'location' ? '#fff' : '#555'}/>
                                <Text
                                    style={[
                                        styles.methodOptionText,
                                        checkInMethod === 'location' && styles.selectedMethodText
                                    ]}
                                >
                                    위치
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.methodOption,
                                    checkInMethod === 'qr' && styles.selectedMethod
                                ]}
                                onPress={() => setCheckInMethod('qr')}
                            >
                                <Icon name="qr-code-scanner" size={16}
                                      color={checkInMethod === 'qr' ? '#fff' : '#555'}/>
                                <Text
                                    style={[
                                        styles.methodOptionText,
                                        checkInMethod === 'qr' && styles.selectedMethodText
                                    ]}
                                >
                                    QR
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionButtons}>
                            {!currentAttendance ? (
                                <>
                                    {checkInMethod === 'standard' && (
                                        <Button
                                            title="출근하기"
                                            onPress={handleCheckIn}
                                            type="primary"
                                            icon="login"
                                            fullWidth
                                        />
                                    )}
                                    {checkInMethod === 'location' && (
                                        <Button
                                            title="위치 기반 출근하기"
                                            onPress={handleCheckInWithLocation}
                                            type="primary"
                                            icon="location-on"
                                            fullWidth
                                        />
                                    )}
                                    {checkInMethod === 'qr' && (
                                        <Button
                                            title="QR 코드로 출근하기"
                                            onPress={openQRScanner}
                                            type="primary"
                                            icon="qr-code-scanner"
                                            fullWidth
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    {checkInMethod === 'standard' && (
                                        <Button
                                            title="퇴근하기"
                                            onPress={handleCheckOut}
                                            type="secondary"
                                            icon="logout"
                                            fullWidth
                                        />
                                    )}
                                    {checkInMethod === 'location' && (
                                        <Button
                                            title="위치 기반 퇴근하기"
                                            onPress={handleCheckOutWithLocation}
                                            type="secondary"
                                            icon="location-on"
                                            fullWidth
                                        />
                                    )}
                                    {checkInMethod === 'qr' && (
                                        <Button
                                            title="QR 코드로 퇴근하기"
                                            onPress={openQRScanner}
                                            type="secondary"
                                            icon="qr-code-scanner"
                                            fullWidth
                                        />
                                    )}
                                </>
                            )}
                        </View>
                    </Card>
                </View>

                <View style={styles.recordsContainer}>
                    <View style={styles.recordsHeader}>
                        <Text style={styles.recordsTitle}>최근 출퇴근 기록</Text>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3498db"/>
                            <Text style={styles.loadingText}>출퇴근 기록을 불러오는 중...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={attendanceRecords}
                            renderItem={renderAttendanceItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={renderEmptyList}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={['#3498db']}
                                />
                            }
                        />
                    )}
                </View>
            </View>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    workplaceSelector: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    workplaceOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
    selectedWorkplace: {
        backgroundColor: '#3498db',
    },
    workplaceOptionText: {
        color: '#555',
        fontWeight: '500',
    },
    selectedWorkplaceText: {
        color: '#fff',
    },
    currentStatusContainer: {
        padding: 16,
    },
    currentStatusCard: {
        padding: 16,
    },
    currentStatusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    statusInfo: {
        marginBottom: 16,
    },
    statusDetail: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    statusLabel: {
        width: 80,
        fontSize: 14,
        color: '#666',
    },
    statusValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    notWorkingText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 8,
    },
    checkInMethodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    methodOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginHorizontal: 4,
        backgroundColor: '#f0f0f0',
    },
    selectedMethod: {
        backgroundColor: '#3498db',
    },
    methodOptionText: {
        color: '#555',
        fontWeight: '500',
        marginLeft: 4,
    },
    selectedMethodText: {
        color: '#fff',
    },
    actionButtons: {
        marginTop: 8,
    },
    recordsContainer: {
        flex: 1,
    },
    recordsHeader: {
        padding: 16,
        paddingBottom: 8,
    },
    recordsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 16,
        paddingTop: 0,
    },
    attendanceCard: {
        marginBottom: 12,
        padding: 16,
    },
    attendanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    attendanceDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    attendanceDetails: {
        marginTop: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    timeItem: {
        alignItems: 'center',
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    timeSeparator: {
        width: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 8,
    },
    workplaceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workplaceName: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 8,
        textAlign: 'center',
    },
    // QR 스캐너 관련 스타일
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    closeButton: {
        padding: 10,
    },
    cameraTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: 44, // closeButton 크기만큼 오프셋
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    cameraInstructions: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    loadingCameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCameraText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
    },
});

export default AttendanceScreen;
