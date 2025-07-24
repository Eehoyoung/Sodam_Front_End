import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface Testimonial {
    id: string;
    text: string;
    author: string;
    role: string;
    rating: number;
}

interface ConversionSectionProps {
    isVisible: boolean;
    onDownload: () => void;
    onWebTrial: () => void;
}

const ConversionSection: React.FC<ConversionSectionProps> = ({
                                                                 isVisible,
                                                                 onDownload,
                                                                 onWebTrial
                                                             }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const ctaSlideAnim = useRef(new Animated.Value(50)).current;
    const testimonialAnim1 = useRef(new Animated.Value(50)).current;
    const testimonialAnim2 = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const testimonials: Testimonial[] = [
        {
            id: '1',
            text: '정말 편해졌어요! 출퇴근 관리가 이렇게 간단할 줄 몰랐어요. 직원들도 만족해해요!',
            author: '김사장님',
            role: '강남구 카페 (3개 매장 운영)',
            rating: 5
        },
        {
            id: '2',
            text: '급여 계산 실수가 없어져서 정말 좋아요! 시간도 많이 절약되고 직원들과의 신뢰도 높아졌어요.',
            author: '박사장님',
            role: '홍대 음식점 (15명 직원 관리)',
            rating: 5
        }
    ];

    useEffect(() => {
        if (isVisible) {
            // 섹션 전체 페이드인
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();

            // CTA 섹션 애니메이션
            Animated.timing(ctaSlideAnim, {
                toValue: 0,
                duration: 600,
                delay: 200,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
            }).start();

            // 후기 카드들 순차적 애니메이션
            const testimonialAnimations = [
                Animated.timing(testimonialAnim1, {
                    toValue: 0,
                    duration: 800,
                    delay: 600,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(testimonialAnim2, {
                    toValue: 0,
                    duration: 800,
                    delay: 900,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ];

            Animated.parallel(testimonialAnimations).start(() => {
                // 후기 애니메이션 완료 후 CTA 버튼 펄스 시작
                startPulseAnimation();
            });
        }
    }, [isVisible]);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    const getTestimonialAnimationStyle = (index: number) => {
        const anims = [testimonialAnim1, testimonialAnim2];
        return {
            transform: [{translateY: anims[index]}],
            opacity: fadeAnim,
        };
    };

    const renderStars = (rating: number) => {
        return Array.from({length: 5}, (_, index) => (
            <Text key={index} style={styles.star}>
                {index < rating ? '⭐' : '☆'}
            </Text>
        ));
    };

    const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({
                                                                                        testimonial,
                                                                                        index
                                                                                    }) => (
        <Animated.View style={[styles.testimonialCard, getTestimonialAnimationStyle(index)]}>
            <View style={styles.testimonialHeader}>
                <View style={styles.starsContainer}>
                    {renderStars(testimonial.rating)}
                </View>
            </View>
            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
            <View style={styles.testimonialFooter}>
                <Text style={styles.testimonialAuthor}>- {testimonial.author}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
            </View>
        </Animated.View>
    );

    return (
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            <View style={styles.content}>
                {/* CTA 섹션 */}
                <Animated.View
                    style={[
                        styles.ctaContainer,
                        {transform: [{translateY: ctaSlideAnim}]}
                    ]}
                >
                    <Text style={styles.ctaTitle}>🚀 지금 바로 시작하기</Text>

                    <View style={styles.benefits}>
                        <Text style={styles.benefit}>✨ 30일 무료 체험</Text>
                        <Text style={styles.benefit}>💳 신용카드 등록 불필요</Text>
                        <Text style={styles.benefit}>📞 전화 상담 무료 제공</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={onDownload}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryButtonText}>📱 모바일 앱 다운로드</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onWebTrial}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>🌐 웹에서 바로 체험</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* 사용자 후기 섹션 */}
                <View style={styles.testimonialsContainer}>
                    <Text style={styles.testimonialsTitle}>💬 실제 사용자 후기</Text>
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            index={index}
                        />
                    ))}
                </View>

                {/* 신뢰 신호 */}
                <Animated.View style={[styles.trustSignals, {opacity: fadeAnim}]}>
                    <Text style={styles.trustSignal}>🔒 안전한 데이터 보호</Text>
                    <Text style={styles.trustSignal}>📞 24/7 고객 지원</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: screenHeight * 1.1,
        backgroundColor: '#F0F8FF',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    ctaContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FF4081',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 36,
    },
    benefits: {
        alignItems: 'center',
        marginBottom: 32,
    },
    benefit: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 8,
        textAlign: 'center',
    },
    actionButtons: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#FF4081',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF4081',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2196F3',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2196F3',
    },
    testimonialsContainer: {
        width: '100%',
        marginBottom: 40,
    },
    testimonialsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 32,
    },
    testimonialCard: {
        backgroundColor: '#E8F5E8',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    testimonialHeader: {
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    star: {
        fontSize: 16,
        marginHorizontal: 1,
    },
    testimonialText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333333',
        lineHeight: 24,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16,
    },
    testimonialFooter: {
        alignItems: 'center',
    },
    testimonialAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 4,
    },
    testimonialRole: {
        fontSize: 12,
        fontWeight: '400',
        color: '#666666',
    },
    trustSignals: {
        alignItems: 'center',
        gap: 12,
    },
    trustSignal: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4CAF50',
        textAlign: 'center',
    },
});

export default ConversionSection;
