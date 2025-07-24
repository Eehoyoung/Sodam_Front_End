module.exports = {
    presets: ['module:@react-native/babel-preset'], // <- 이 부분을 변경합니다.
    plugins: [
        // Reanimated 플러그인은 항상 마지막에 위치해야 합니다.
        'react-native-reanimated/plugin',
    ],
};
