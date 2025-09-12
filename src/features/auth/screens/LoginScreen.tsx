import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import  LinearGradient  from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import  Ionicons from 'react-native-vector-icons/Ionicons';
import SodamLogo from '../../../common/components/logo/SodamLogo';
import { COLORS } from '../../../common/components/logo/Colors';

interface LoginScreenProps {
    navigation: NavigationProp<any>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 실제 API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert('성공', `로그인 성공!\n이메일: ${email}`, [
                {
                    text: '확인',
                    onPress: () => {
                        // 실제 앱에서는 메인 화면으로 이동
                        navigation.navigate('MainTabs');
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('오류', '로그인에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        Alert.alert('소셜 로그인', `${provider} 로그인 기능을 구현해주세요.`);
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <LinearGradient
            colors={[COLORS.SODAM_BLUE, '#6A5ACD', COLORS.SODAM_GREEN]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* 뒤로가기 버튼 */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={24} color="rgba(255, 255, 255, 0.8)" />
                            <Text style={styles.backButtonText}>돌아가기</Text>
                        </TouchableOpacity>

                        {/* 로그인 카드 */}
                        <View style={styles.loginCard}>
                            {/* 헤더 */}
                            <View style={styles.header}>
                                <SodamLogo size={60} variant="simple" />
                                <Text style={styles.title}>로그인</Text>
                                <Text style={styles.subtitle}>소담에 오신 것을 환영합니다</Text>
                            </View>

                            {/* 로그인 폼 */}
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>이메일</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="이메일을 입력하세요"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>비밀번호</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            placeholder="비밀번호를 입력하세요"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeButton}
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-off' : 'eye'}
                                                size={20}
                                                color={COLORS.GRAY_500}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.optionsRow}>
                                    <TouchableOpacity
                                        style={styles.rememberMe}
                                        onPress={() => setRememberMe(!rememberMe)}
                                    >
                                        <Ionicons
                                            name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                                            size={20}
                                            color={COLORS.SODAM_ORANGE}
                                        />
                                        <Text style={styles.rememberMeText}>로그인 상태 유지</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color={COLORS.WHITE} />
                                    ) : (
                                        <Text style={styles.loginButtonText}>로그인</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* 소셜 로그인 */}
                            <View style={styles.socialSection}>
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>또는</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <View style={styles.socialButtons}>
                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => handleSocialLogin('구글')}
                                    >
                                        <Text style={styles.socialButtonText}>구글</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => handleSocialLogin('카카오')}
                                    >
                                        <Text style={styles.socialButtonText}>카카오</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* 회원가입 링크 */}
                            <View style={styles.signupSection}>
                                <Text style={styles.signupText}>
                                    계정이 없으신가요?{' '}
                                    <Text
                                        style={styles.signupLink}
                                        onPress={() => navigation.navigate('SignupScreen')}
                                    >
                                        회원가입
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        marginLeft: 8,
    },
    loginCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.GRAY_800,
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.GRAY_600,
    },
    form: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.GRAY_700,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_300,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: COLORS.WHITE,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.GRAY_300,
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeButton: {
        paddingHorizontal: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        fontSize: 14,
        color: COLORS.GRAY_600,
        marginLeft: 8,
    },
    forgotPassword: {
        fontSize: 14,
        color: COLORS.SODAM_ORANGE,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: COLORS.SODAM_ORANGE,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.SODAM_ORANGE,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: '600',
    },
    socialSection: {
        marginBottom: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.GRAY_300,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: COLORS.GRAY_500,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.GRAY_300,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
        backgroundColor: COLORS.WHITE,
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.GRAY_700,
    },
    signupSection: {
        alignItems: 'center',
    },
    signupText: {
        fontSize: 14,
        color: COLORS.GRAY_600,
    },
    signupLink: {
        color: COLORS.SODAM_ORANGE,
        fontWeight: '600',
    },
});
