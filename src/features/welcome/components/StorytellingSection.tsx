import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing, StyleSheet, Text, View} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface Problem {
    id: string;
    emoji: string;
    title: string;
    description: string;
    animation: 'fadeIn' | 'slideUp' | 'bounce';
}

interface StorytellingSectionProps {
    isVisible: boolean;
    onComplete?: () => void;
}

const StorytellingSection: React.FC<StorytellingSectionProps> = ({
                                                                     isVisible,
                                                                     onComplete
                                                                 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim1 = useRef(new Animated.Value(50)).current;
    const slideAnim2 = useRef(new Animated.Value(50)).current;
    const slideAnim3 = useRef(new Animated.Value(50)).current;
    const arrowBounce = useRef(new Animated.Value(0)).current;

    const problems: Problem[] = [
        {
            id: 'attendance',
            emoji: '😰',
            title: '출퇴근 확인이 번거로워',
            description: '매번 직원들 출근시간\n확인하기가 힘들어요',
            animation: 'fadeIn'
        },
        {
            id: 'salary',
            emoji: '💸',
            title: '급여 계산이 복잡해',
            description: '시간당 계산하고 세금까지\n고려하면 너무 복잡해요',
            animation: 'slideUp'
        },
        {
            id: 'management',
            emoji: '🏪',
            title: '여러 매장 관리 어려워',
            description: '매장마다 다른 시스템으로\n관리하기가 힘들어요',
            animation: 'bounce'
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

            // 문제 카드들 순차적 애니메이션
            const animations = [
                Animated.timing(slideAnim1, {
                    toValue: 0,
                    duration: 800,
                    delay: 300,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim2, {
                    toValue: 0,
                    duration: 800,
                    delay: 600,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim3, {
                    toValue: 0,
                    duration: 800,
                    delay: 900,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true,
                })
            ];

            Animated.parallel(animations).start(() => {
                // 모든 애니메이션 완료 후 화살표 바운스 시작
                startArrowBounce();
                if (onComplete) {
                    setTimeout(onComplete, 1000);
                }
            });
        }
    }, [isVisible]);

    const startArrowBounce = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(arrowBounce, {
                    toValue: -10,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(arrowBounce, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    const getAnimationStyle = (index: number) => {
        const anims = [slideAnim1, slideAnim2, slideAnim3];
        return {
            transform: [{translateY: anims[index]}],
            opacity: fadeAnim,
        };
    };

    const ProblemCard: React.FC<{ problem: Problem; index: number }> = ({problem, index}) => (
        <Animated.View style={[styles.problemCard, getAnimationStyle(index)]}>
            <View style={styles.problemHeader}>
                <Text style={styles.problemEmoji}>{problem.emoji}</Text>
                <Text style={styles.problemTitle}>{problem.title}</Text>
            </View>
            <Text style={styles.problemDescription}>{problem.description}</Text>
        </Animated.View>
    );

    return (
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>이런 고민, 혹시 있으신가요?</Text>

                <View style={styles.problemsContainer}>
                    {problems.map((problem, index) => (
                        <ProblemCard
                            key={problem.id}
                            problem={problem}
                            index={index}
                        />
                    ))}
                </View>

                <View style={styles.transitionHint}>
                    <Text style={styles.hintText}>이 모든 걱정을...</Text>
                    <Animated.View
                        style={[
                            styles.scrollIndicator,
                            {transform: [{translateY: arrowBounce}]}
                        ]}
                    >
                        <Text style={styles.arrowText}>↓</Text>
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: screenHeight * 0.9,
        backgroundColor: '#FFF8F0',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF6B35',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
    },
    problemsContainer: {
        width: '100%',
        marginBottom: 60,
    },
    problemCard: {
        backgroundColor: '#FFE5E5',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#D32F2F',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    problemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    problemEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    problemTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#D32F2F',
        flex: 1,
    },
    problemDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        lineHeight: 20,
        paddingLeft: 36,
    },
    transitionHint: {
        alignItems: 'center',
    },
    hintText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF6B35',
        marginBottom: 16,
    },
    scrollIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default StorytellingSection;
