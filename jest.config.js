module.exports = {
  preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@expo/vector-icons|react-native-vector-icons|react-native-chart-kit)/)',
    ],
};
