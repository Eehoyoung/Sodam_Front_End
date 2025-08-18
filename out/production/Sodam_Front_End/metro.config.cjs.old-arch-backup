const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');

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
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    watchFolders: [],
    watcher: {
        additionalExts: ['ts', 'tsx', 'cjs', 'mjs'],
        ignored: [
            /.*\/node_modules\/.*\/android\/\.cxx\/.*/,
            /.*\/android\/\.gradle\/.*/,
            /.*\/android\/app\/\.cxx\/.*/,
            /.*\/CMakeFiles\/.*/,
            /.*\/CMakeTmp\/.*/,
            /.*\/\.git\/.*/,
            /.*\/node_modules\/.*\/\.git\/.*/,
            /.*\/build\/.*/,
            /.*\/dist\/.*/,
            /.*\/\.cache\/.*/,
        ],
    },
};

const mergedConfig = mergeConfig(defaultConfig, customConfig);
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
