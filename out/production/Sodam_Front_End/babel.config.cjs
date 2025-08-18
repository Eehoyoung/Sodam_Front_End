module.exports = {
    presets: ['@react-native/babel-preset'],
    plugins: [
        // 다른 플러그인들...
        'react-native-reanimated/plugin', // 🚨 반드시 맨 마지막에!
    ],
};
