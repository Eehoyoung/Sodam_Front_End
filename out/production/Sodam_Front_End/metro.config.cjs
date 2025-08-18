const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
    resolver: {
        assetExts: [
            'bin', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
            'ico', 'bmp', 'tiff', 'ttf', 'otf', 'woff', 'woff2'
        ],
        sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
    },
    transformer: {
        assetRegistryPath: require.resolve(
            'react-native/Libraries/Image/AssetRegistry'
        ),
        // Metro 최적화 설정 (Old Architecture)
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
                // 성능 최적화
                unstable_disableES6Transforms: false,
            },
        }),
    },
    watchFolders: [],
};

const mergedConfig = mergeConfig(defaultConfig, customConfig);
module.exports = mergedConfig;
