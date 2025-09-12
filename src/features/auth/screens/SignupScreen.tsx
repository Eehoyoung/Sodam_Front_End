import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { SignupScreenNavigationProp } from '../../../navigation/types';
import { useSignup } from '../hooks/useAuthQueries';
import SodamLogo from '../../../common/components/logo/SodamLogo';

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const signupMutation = useSignup();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('안내', '이름, 이메일, 비밀번호를 입력하세요.');
      return;
    }
    try {
      await signupMutation.mutateAsync({ name, email, password });
      Alert.alert('완료', '회원가입이 완료되었습니다. 로그인해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e: any) {
      Alert.alert('회원가입 실패', e?.response?.data?.message || '입력 정보를 확인해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <SodamLogo size={60} variant="simple" />
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={{ height: 12 }} />
      <Button title={signupMutation.isPending ? '가입 중...' : '가입하기'} onPress={handleSignup} disabled={signupMutation.isPending} />
      <View style={{ height: 12 }} />
      <Button title="로그인으로" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 },
  input: { width: '90%', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, marginVertical: 6 },
});

export default SignupScreen;
