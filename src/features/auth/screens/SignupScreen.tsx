import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import SodamLogo from '../../../common/components/logo/SodamLogo';
import { COLORS } from '../../../common/components/logo/Colors';

interface UserType {
    id: 'personal' | 'boss' | 'employee';
    title: string;
    description: string;
    icon: string;
    color: string;
    backgroundColor: string;
}

const SignUpScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const userTypes: UserType[] = [
        {
            id: 'personal',
            title: '개인 사용자',
            description: '혼자서 간편하게 근태 기록',
            icon: '🏠',
            color: COLORS.SUCCESS,
            backgroundColor: '#ECFDF5'
        },
        {
            id: 'boss',
            title: '매장 대표',
            description: '직원들의 근태를 관리',
            icon: '🏢',
            color: COLORS.SODAM_BLUE,
            backgroundColor: '#EFF8FF'
        },
        {
            id: 'employee',
            title: '직원',
            description: '매장에 참여하여 근태 기록',
            icon: '👥',
            color: COLORS.SODAM_GREEN,
            backgroundColor: '#FDF2F8'
        }
    ];

    const handleSignup = async () => {
        if (isLoading) {return;}

        if (!name || !email || !password || !selectedUserType) {
            Alert.alert('알림', '모든 정보를 입력하고 사용자 타입을 선택해주세요.');
            return;
        }

        setIsLoading(true);

        // 실제 회원가입 로직 시뮬레이션
        setTimeout(() => {
            const userTypeText = userTypes.find(type => type.id === selectedUserType)?.title ?? '';
            Alert.alert(
                '회원가입 완료',
                `회원가입이 완료되었습니다!\n\n이름: ${name}\n이메일: ${email}\n사용자 타입: ${userTypeText}`
            );

            // 폼 초기화
            setName('');
            setEmail('');
            setPassword('');
            setSelectedUserType(null);
            setIsLoading(false);
        }, 2000);
    };

    const handleLogin = () => {
        Alert.alert('알림', '로그인 화면으로 이동합니다.');
    };

    const renderUserTypeCard = (userType: UserType) => {
        const isSelected = selectedUserType === userType.id;

        return (
            <TouchableOpacity
                key={userType.id}
                style={[
                    styles.userTypeCard,
                    isSelected && {
                        borderColor: userType.color,
                        backgroundColor: userType.backgroundColor
                    }
                ]}
                onPress={() => setSelectedUserType(userType.id)}
            >
                <View style={[
                    styles.radioButton,
                    isSelected && { borderColor: COLORS.SODAM_ORANGE }
                ]}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>

                <View style={styles.userTypeContent}>
                    <Text style={styles.userTypeIcon}>{userType.icon}</Text>
                    <View>
                        <Text style={styles.userTypeTitle}>{userType.title}</Text>
                        <Text style={styles.userTypeDesc}>{userType.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <SodamLogo size={80} variant="simple" />
                    <Text style={styles.headerTitle}>회원가입</Text>
                    <Text style={styles.headerSubtitle}>소담과 함께 시작해보세요</Text>
                </View>

                {/* 폼 카드 */}
                <View style={styles.formCard}>
                    {/* 기본 정보 입력 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>기본 정보</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>이름</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={COLORS.GRAY_400}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>이메일</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="이메일 주소를 입력해주세요"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={COLORS.GRAY_400}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>비밀번호</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="비밀번호를 입력해주세요 (8자 이상)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={COLORS.GRAY_400}
                            />
                        </View>
                    </View>

                    {/* 사용자 타입 선택 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>사용 목적을 선택해주세요</Text>
                        {userTypes.map(renderUserTypeCard)}
                    </View>

                    {/* 버튼들 */}
                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignup}
                            disabled={isLoading}
                        >
                            <Text style={styles.signupButtonText}>
                                {isLoading ? '가입 중...' : '가입하기'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
                            <Text style={styles.loginLinkText}>
                                이미 계정이 있으신가요? 로그인
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: `linear-gradient(135deg, ${COLORS.SODAM_ORANGE} 0%, ${COLORS.SODAM_BLUE} 100%)`,
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.WHITE,
        marginTop: 20,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    formCard: {
        backgroundColor: COLORS.WHITE,
        marginTop: -20,
        marginHorizontal: 20,
        borderRadius: 25,
        padding: 30,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.GRAY_800,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.GRAY_700,
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 2,
        borderColor: COLORS.GRAY_200,
        borderRadius: 15,
        padding: 16,
        fontSize: 16,
        backgroundColor: COLORS.GRAY_50,
        color: COLORS.GRAY_800,
    },
    userTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.GRAY_200,
        backgroundColor: COLORS.GRAY_50,
        marginBottom: 12,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.GRAY_300,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.SODAM_ORANGE,
    },
    userTypeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userTypeIcon: {
        fontSize: 32,
        marginRight: 15,
    },
    userTypeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.GRAY_800,
        marginBottom: 4,
    },
    userTypeDesc: {
        fontSize: 14,
        color: COLORS.GRAY_500,
    },
    buttonSection: {
        marginTop: 10,
    },
    signupButton: {
        backgroundColor: `linear-gradient(135deg, ${COLORS.SODAM_ORANGE} 0%, ${COLORS.SODAM_BLUE} 100%)`,
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        marginBottom: 15,
    },
    signupButtonDisabled: {
        opacity: 0.6,
    },
    signupButtonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        alignItems: 'center',
        padding: 15,
    },
    loginLinkText: {
        color: COLORS.GRAY_500,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
