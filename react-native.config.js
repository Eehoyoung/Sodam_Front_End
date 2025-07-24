const dependencies = {
    // MIXED APPROACH: Disable autolinking for problematic packages and use manual linking
    // This ensures stable builds with React Native 0.80.0

    'react-native-vector-icons': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    '@react-native-async-storage/async-storage': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    '@react-native-community/datetimepicker': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    'react-native-geolocation-service': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    'react-native-gesture-handler': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    'react-native-permissions': {
        platforms: {
            android: null, // Disable Android auto linking - manual linking required
        },
    },
    'react-native-safe-area-context': {
        platforms: {
            android: null, // Disable Android autolinking - manual linking required
        },
    },
    'react-native-screens': {
        platforms: {
            android: null, // Disable Android autolinking - manual linking required
        },
    },
    'react-native-vision-camera': {
        platforms: {
            android: null, // Disable Android autolinking - manual linking required
        },
    },
    'react-native-reanimated': {
        platforms: {
            android: {
                sourceDir: '../node_modules/react-native-reanimated/android',
                packageImportPath: 'import com.swmansion.reanimated.ReanimatedPackage;',
            },
        },
    },
    'react-native-worklets-core': {
        platforms: {
            android: null, // Disable Android autolinking - manual linking required
        },
    },
};

const project = {
    ios: {},
    android: {
        sourceDir: './android',
        appName: 'app',
        packageName: 'com.sodam_front_end',
    },
};

module.exports = {
    dependencies,
    project,
};
