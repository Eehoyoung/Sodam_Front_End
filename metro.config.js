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
        ]),
        // Fix @tanstack/react-query module resolution issue
        unstable_enablePackageExports: false,
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    // Explicitly clean server and watcher configurations
    server: {
        // Clean server config without deprecated options
    },
    watcher: {
        // Clean watcher config without deprecated unstable_* options
        healthCheck: {
            enabled: true,
        },
    },
};

module.exports = mergeConfig(defaultConfig, customConfig);
