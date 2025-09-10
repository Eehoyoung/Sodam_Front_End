import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { LoginScreenNavigationProp, RootNavigationProp } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  // Use root navigation to perform app-level reset to HomeRoot after successful login
  const rootNavigation = useNavigation<RootNavigationProp>();

  const handleLoginSuccess = () => {
    // TODO: persist token via AuthContext/TokenManager if available
    rootNavigation.reset({ index: 0, routes: [{ name: 'HomeRoot' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <Text style={styles.body}>이 화면은 플레이스홀더입니다. 인증 구현 전까지 내비게이션 검증용으로 사용됩니다.</Text>
      <Button title="회원가입으로" onPress={() => navigation.navigate('Signup')} />
      <View style={{ height: 12 }} />
      <Button title="로그인 성공" onPress={handleLoginSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 },
});

export default LoginScreen;
