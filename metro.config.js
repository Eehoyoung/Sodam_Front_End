import {getDefaultConfig, mergeConfig} from '@react-native/metro-config';
import {wrapWithReanimatedMetroConfig} from 'react-native-reanimated/metro-config/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
    resolver: {
        assetExts: ['bin', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff', 'ttf', 'otf'],
        sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    watchFolders: [],
    watcher: {
        additionalExts: ['ts', 'tsx'],
        ignored: [
            // Exclude problematic CMakeFiles directories that cause ENOENT errors
            /.*\/node_modules\/.*\/android\/\.cxx\/.*/,
            /.*\/android\/\.gradle\/.*/,
            /.*\/android\/app\/\.cxx\/.*/,
            /.*\/CMakeFiles\/.*/,
            /.*\/CMakeTmp\/.*/,
            // Standard exclusions
            /.*\/\.git\/.*/,
            /.*\/node_modules\/.*\/\.git\/.*/,
        ],
    },
};

// 기본 설정과 병합
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// Reanimated 설정으로 래핑
export default wrapWithReanimatedMetroConfig(mergedConfig);
