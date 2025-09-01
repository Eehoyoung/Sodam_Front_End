module.exports = {
  presets: [
    [
      '@react-native/babel-preset',
      {
        // TypeScript 컴파일 최적화
        typescript: {
          allowNamespaces: true,
          allowDeclareFields: true,
        },
      },
    ],
  ],
  plugins: [
    // Reanimated는 반드시 마지막에
    'react-native-reanimated/plugin',
  ],
  env: {
    development: {
      plugins: [
        // 개발 모드 전용 플러그인들
        ['@babel/plugin-transform-react-jsx-development'],
      ],
    },
    test: {
      plugins: [
        // 테스트 전용 최적화
        ['@babel/plugin-transform-modules-commonjs'],
      ],
    },
  },
  // Jest 호환성을 위해 캐싱 최적화는 Metro에서만 적용
  // cacheDirectory: true,
  // compact: false,
};
