import React, {useState} from 'react';
import {Animated, Dimensions, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../../navigation/types';

// Import section components
import StorytellingSection from '../components/StorytellingSection';
import FeatureDashboardSection from '../components/FeatureDashboardSection';
import ConversionSection from '../components/ConversionSection';
import Header from '../components/Header';

const {height: screenHeight} = Dimensions.get('window');

interface SectionVisibility {
    problems: boolean;
    solutions: boolean;
    cta: boolean;
}

const HybridMainScreen: React.FC = () => {
    const navigation = useNavigation<RootNavigationProp>();
    const [currentSection, setCurrentSection] = useState(0);
    const [isVisible, setIsVisible] = useState<SectionVisibility>({
        problems: true, // 첫 섹션은 즉시 표시
        solutions: false,
        cta: false
    });

    const scrollY = new Animated.Value(0);
    const progressAnim = new Animated.Value(0);

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const sectionHeight = screenHeight * 0.8;
                const totalScrollHeight = sectionHeight * 3; // 3 sections total

                // Calculate progress (0 to 1)
                const progress = Math.min(Math.max(offsetY / totalScrollHeight, 0), 1);

                // Animate progress indicator
                Animated.timing(progressAnim, {
                    toValue: progress,
                    duration: 100,
                    useNativeDriver: false,
                }).start();

                // 섹션별 가시성 업데이트
                if (offsetY > sectionHeight * 0.3 && !isVisible.solutions) {
                    setIsVisible(prev => ({...prev, solutions: true}));
                    setCurrentSection(1);
                }
                if (offsetY > sectionHeight * 1.2 && !isVisible.cta) {
                    setIsVisible(prev => ({...prev, cta: true}));
                    setCurrentSection(2);
                }
            }
        }
    );

    const handleFeatureTest = (featureId: string) => {
        console.log(`[DEBUG_LOG] Feature test requested: ${featureId}`);
        // TODO: 기능별 데모 구현
    };

    const handleAppDownload = () => {
        console.log('[DEBUG_LOG] App download initiated');
        // TODO: 앱 스토어 링크 연결
    };

    const handleWebTrial = () => {
        console.log('[DEBUG_LOG] Web trial started');
        navigation.navigate('Auth', {screen: 'Signup'});
    };

    const handleLogin = () => {
        navigation.navigate('Auth', {screen: 'Login'});
    };

    const handleSignup = () => {
        navigation.navigate('Auth', {screen: 'Signup'});
    };

    return (
        <View style={styles.container}>
            <Header onLogin={handleLogin} onSignup={handleSignup}/>

            {/* Scroll Progress Indicator */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                })
                            }
                        ]}
                    />
                </View>
                <View style={styles.progressDots}>
                    {[0, 1, 2].map((index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.progressDot,
                                {
                                    backgroundColor: progressAnim.interpolate({
                                        inputRange: [index / 3, (index + 1) / 3],
                                        outputRange: ['#E0E0E0', '#2196F3'],
                                        extrapolate: 'clamp',
                                    }),
                                    transform: [{
                                        scale: progressAnim.interpolate({
                                            inputRange: [index / 3, (index + 1) / 3],
                                            outputRange: [1, 1.2],
                                            extrapolate: 'clamp',
                                        })
                                    }]
                                }
                            ]}
                        />
                    ))}
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* Section 1: 스토리텔링 영역 */}
                <StorytellingSection
                    isVisible={isVisible.problems}
                    onComplete={() => setCurrentSection(1)}
                />

                {/* Section 2: 기능 대시보드 영역 */}
                <FeatureDashboardSection
                    isVisible={isVisible.solutions}
                    onFeatureTest={handleFeatureTest}
                />

                {/* Section 3: 체험 및 전환 영역 */}
                <ConversionSection
                    isVisible={isVisible.cta}
                    onDownload={handleAppDownload}
                    onWebTrial={handleWebTrial}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    progressContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 80,
        right: 20,
        zIndex: 1000,
        alignItems: 'center',
    },
    progressTrack: {
        width: 4,
        height: 120,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 2,
    },
    progressDots: {
        alignItems: 'center',
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginVertical: 8,
        backgroundColor: '#E0E0E0',
    },
});

export default HybridMainScreen;
