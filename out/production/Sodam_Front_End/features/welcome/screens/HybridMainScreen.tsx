import React, {useMemo, useState} from 'react';
import {Dimensions, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../../navigation/types';

// Import section components
import StorytellingSection from '../components/StorytellingSection';
import FeatureDashboardSection from '../components/FeatureDashboardSection';
import ConversionSection from '../components/ConversionSection';
import Header from '../components/Header';

interface SectionVisibility {
    problems: boolean;
    solutions: boolean;
    cta: boolean;
}

const HybridMainScreen: React.FC = () => {
    const navigation = useNavigation<RootNavigationProp>();

    // Cache screen height outside worklet to avoid JSI violation
    let screenHeight;
    try {
        screenHeight = useMemo(() => {
            const dimensions = Dimensions.get('window');
            return dimensions.height;
        }, []);
    } catch (error) {
        console.error('HybridMainScreen: Failed to get screen dimensions:', error);
        throw error;
    }

    const [currentSection, setCurrentSection] = useState(0);
    const [isVisible, setIsVisible] = useState<SectionVisibility>({
        problems: true, // 첫 섹션은 즉시 표시
        solutions: false,
        cta: false
    });

    // Disabled for MVP stability - basic scroll handling
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const sectionHeight = screenHeight * 0.8;

        // 섹션별 가시성 업데이트 (simplified without animations)
        if (offsetY > sectionHeight * 0.3) {
            setIsVisible(prev => {
                if (!prev.solutions) {
                    setCurrentSection(1);
                    return {...prev, solutions: true};
                }
                return prev;
            });
        }
        if (offsetY > sectionHeight * 1.2) {
            setIsVisible(prev => {
                if (!prev.cta) {
                    setCurrentSection(2);
                    return {...prev, cta: true};
                }
                return prev;
            });
        }
    };

    const handleFeatureTest = (featureId: string) => {
        // TODO: 기능별 데모 구현
    };

    const handleAppDownload = () => {
        // TODO: 앱 스토어 링크 연결
    };

    const handleWebTrial = () => {
        navigation.navigate('Auth', {screen: 'Signup'});
    };

    const handleLogin = () => {
        navigation.navigate('Auth', {screen: 'Login'});
    };

    const handleSignup = () => {
        navigation.navigate('Auth', {screen: 'Signup'});
    };

    // Progress bar style (disabled animations for MVP)
    const progressBarStyle = {
        width: `${(currentSection + 1) * 33}%`,
    };

    // Progress dots styles (simplified for MVP)
    const getProgressDotStyle = (index: number) => {
        return {
            backgroundColor: index <= currentSection ? '#2196F3' : '#E0E0E0',
            transform: [{scale: index === currentSection ? 1.2 : 1}],
        };
    };

    return (
        <View style={styles.container}>
            <Header onLogin={handleLogin} onSignup={handleSignup}/>

            {/* Scroll Progress Indicator */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View
                        style={[styles.progressBar]}
                    />
                </View>
                <View style={styles.progressDots}>
                    {[0, 1, 2].map((index) => (
                        <View
                            key={index}
                            style={[styles.progressDot, getProgressDotStyle(index)]}
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
