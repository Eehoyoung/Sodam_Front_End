const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/private/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);

// Remove deprecated options from defaultConfig
if (defaultConfig.server && defaultConfig.server.forwardClientLogs !== undefined) {
    delete defaultConfig.server.forwardClientLogs;
}
if (defaultConfig.watcher) {
    delete defaultConfig.watcher.unstable_lazySha1;
    delete defaultConfig.watcher.unstable_workerThreads;
    delete defaultConfig.watcher.unstable_autoSaveCache;
}

const customConfig = {
    resolver: {
        assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
        blockList: exclusionList([
            /out\/production\/.*/, // 🚫 out 폴더 무시
            /\.git\//,
            /\.expo\//,
            /node_modules\/.*\/test\//,
        ]),
        unstable_enablePackageExports: false,
        // 개발 모드 해결 최적화
        platforms: ['ios', 'android', 'native', 'web'],
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        // 개발 모드 변환 최적화
        unstable_allowRequireContext: true,
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false, // 개발 모드에서는 비활성화
            },
        }),
    },
    server: {
        port: 8081,
    },
    watcher: {
        healthCheck: {
            enabled: true,
            interval: 30000,
            timeout: 10000,
        },
        // 개발 성능 최적화
        watchman: true,
        additionalExts: ['ts', 'tsx'],
    },
    // 개발 모드 캐싱 강화
    cacheStores: [
        {
            type: 'FileStore',
            root: require('path').join(__dirname, '.metro-cache'),
        },
    ],
};

module.exports = mergeConfig(defaultConfig, customConfig);
