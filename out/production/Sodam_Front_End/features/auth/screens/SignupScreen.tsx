import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SignupScreenNavigationProp } from '../../../navigation/types';

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.body}>이 화면은 플레이스홀더입니다. 인증 구현 전까지 내비게이션 검증용으로 사용됩니다.</Text>
      <Button title="로그인으로" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 },
});

export default SignupScreen;
