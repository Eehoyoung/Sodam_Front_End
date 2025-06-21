import React, {ReactNode, useRef} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import Header from './Header'; // 같은 디렉토리에 있으므로 경로 수정
import Footer from './Footer'; // 같은 디렉토리에 있으므로 경로 수정
import {useResponsiveStyles} from '../../../utils/responsive';

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({children, title}) => {
    const {responsiveStyles} = useResponsiveStyles();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    // 스크롤 위치에 따라 Footer의 투명도 계산
    const footerOpacity = scrollY.interpolate({
        inputRange: [0, Dimensions.get('window').height * 0.8, Dimensions.get('window').height],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.container}>
            <Header title={title}/>
            <Animated.ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={[styles.contentContainer, {padding: responsiveStyles.container.padding}]}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: true}
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.content}>
                    {children}
                </View>
                <View style={styles.footerSpacing}/>
            </Animated.ScrollView>
            <Animated.View style={[styles.footerContainer, {opacity: footerOpacity}]}>
                <Footer/>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
    },
    footerSpacing: {
        height: 100, // Footer가 보이기 시작할 때 콘텐츠가 가려지지 않도록 여백 추가
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
});

export default MainLayout;
