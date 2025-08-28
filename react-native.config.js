
// React Native CLI configuration for autolinking (updated to refresh cache)
module.exports = {
  project: {
    android: {
      sourceDir: './android',
      appName: 'app',
      manifestPath: './android/app/src/main/AndroidManifest.xml',
      packageName: 'com.sodam_front_end',
    },
  },
  // 의존성 수동 설정 (필요시)
  dependencies: {},
  assets: ['./src/assets/fonts/'],
};
