import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../../navigation/types';

/**
 * WelcomeMainScreen (Moderate plan mock)
 * - Purpose: Production-grade Welcome placeholder for initial user entry
 * - CTA: Go to Login / Signup via nested Auth navigator
 * - Notes: Not wired in AppNavigator yet (HybridMainScreen is still active).
 */
const WelcomeMainScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const scrollRef = useRef<ScrollView>(null);

  const handleStart = () => {
    navigation.navigate('Auth', {screen: 'Login'});
  };

  const handleSignup = () => {
    navigation.navigate('Auth', {screen: 'Signup'});
  };

  const handleExplore = () => {
    scrollRef.current?.scrollTo({y: 420, animated: true});
  };

  const onScroll = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // reserved for future metrics
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView ref={scrollRef} style={styles.container} onScroll={onScroll} scrollEventThrottle={16}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.brand}>SODAM</Text>
          <Text style={styles.title}>알바 근태·급여, 한 곳에서 끝</Text>
          <Text style={styles.subtitle}>NFC 출퇴근 · 자동 급여 계산 · 멀티 매장 관리</Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity accessibilityRole="button" onPress={handleStart} style={[styles.button, styles.primary]}
                              accessibilityLabel="시작하기 (로그인으로 이동)">
              <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" onPress={handleSignup} style={[styles.button, styles.secondary]}
                              accessibilityLabel="회원가입으로 이동">
              <Text style={[styles.buttonText, styles.secondaryText]}>회원가입</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity accessibilityRole="button" onPress={handleExplore}
                            style={styles.linkBtn} accessibilityLabel="기능 살펴보기로 이동">
            <Text style={styles.linkText}>기능 살펴보기 ↓</Text>
          </TouchableOpacity>
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>왜 소담인가요?</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>빠른 출퇴근</Text>
            <Text style={styles.cardBody}>NFC 태그 한 번으로 출근/퇴근. 위치 기반 보안.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>자동 급여 계산</Text>
            <Text style={styles.cardBody}>근태 기록과 시급을 바탕으로 자동 합산.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>멀티 매장 관리</Text>
            <Text style={styles.cardBody}>여러 매장 직원과 근태를 한 눈에.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>정보 서비스</Text>
            <Text style={styles.cardBody}>정책/노동/세무 정보와 Q&A를 제공.</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>로그인 없이도 둘러볼 수 있어요. 언제든 시작하기를 눌러 가입/로그인하세요.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#ffffff'},
  container: {flex: 1},
  hero: {paddingTop: 48, paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center'},
  brand: {fontSize: 18, fontWeight: '700', letterSpacing: 2, color: '#4F46E5', marginBottom: 8},
  title: {fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center'},
  subtitle: {fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center'},
  ctaRow: {flexDirection: 'row', marginTop: 20},
  button: {paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginHorizontal: 6},
  primary: {backgroundColor: '#4F46E5'},
  secondary: {backgroundColor: '#EEF2FF'},
  buttonText: {fontSize: 16, color: '#ffffff', fontWeight: '700'},
  secondaryText: {color: '#4F46E5'},
  linkBtn: {marginTop: 16, padding: 8},
  linkText: {color: '#4F46E5', fontWeight: '600'},
  section: {paddingHorizontal: 24, paddingBottom: 32},
  sectionTitle: {fontSize: 18, fontWeight: '800', marginBottom: 12, color: '#111827'},
  card: {backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 10},
  cardTitle: {fontSize: 16, fontWeight: '700', color: '#111827'},
  cardBody: {fontSize: 13, color: '#4B5563', marginTop: 4},
  footer: {paddingHorizontal: 24, paddingBottom: 48},
  footerText: {fontSize: 12, color: '#6B7280', textAlign: 'center'},
});

export default WelcomeMainScreen;
