// Jest setup file for mocking React Native modules

// Mock AsyncStorage - conditional mock to avoid requiring the package
try {
    jest.mock('@react-native-async-storage/async-storage', () => ({
        getItem: jest.fn(() => Promise.resolve(null)),
        setItem: jest.fn(() => Promise.resolve()),
        removeItem: jest.fn(() => Promise.resolve()),
    }));
} catch (e) {
    // Package not installed, skip mock
}

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({children}) => children,
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
}));

jest.mock('@react-navigation/stack', () => ({
    createStackNavigator: () => ({
        Navigator: ({children}) => children,
        Screen: ({children}) => children,
    }),
}));

// Mock React Native modules
jest.mock('react-native', () => ({
    StatusBar: 'StatusBar',
    useColorScheme: jest.fn(() => 'light'),
    StyleSheet: {
        create: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    Image: 'Image',
    ScrollView: 'ScrollView',
    Animated: {
        Value: jest.fn(() => ({
            setValue: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            removeAllListeners: jest.fn(),
            interpolate: jest.fn(() => ({
                setValue: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
            })),
        })),
        View: 'Animated.View',
        ScrollView: 'Animated.ScrollView',
        Text: 'Animated.Text',
        timing: jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        })),
        spring: jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        })),
        decay: jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        })),
        sequence: jest.fn(),
        parallel: jest.fn(),
        stagger: jest.fn(),
        loop: jest.fn(),
        delay: jest.fn(),
        event: jest.fn(() => jest.fn()),
        createAnimatedComponent: jest.fn(() => 'AnimatedComponent'),
        add: jest.fn(),
        subtract: jest.fn(),
        multiply: jest.fn(),
        divide: jest.fn(),
        modulo: jest.fn(),
        diffClamp: jest.fn(),
    },
    Dimensions: {
        get: jest.fn(() => ({width: 375, height: 812})),
    },
    Platform: {
        OS: 'ios',
        select: jest.fn((obj) => obj.ios),
    },
    LogBox: {
        ignoreLogs: jest.fn(),
        ignoreAllLogs: jest.fn(),
    },
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
    enableScreens: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children}) => children,
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

// Mock react-native-vector-icons - conditional mocks to avoid requiring the package
try {
    jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
    jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');
    jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
    jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
} catch (e) {
    // Package not installed, skip mocks
}

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
    FontAwesome: 'FontAwesome',
    FontAwesome5: 'FontAwesome5',
    MaterialIcons: 'MaterialIcons',
    AntDesign: 'AntDesign',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
    Svg: 'Svg',
    Circle: 'Circle',
    Ellipse: 'Ellipse',
    G: 'G',
    Text: 'Text',
    TSpan: 'TSpan',
    TextPath: 'TextPath',
    Path: 'Path',
    Polygon: 'Polygon',
    Polyline: 'Polyline',
    Line: 'Line',
    Rect: 'Rect',
    Use: 'Use',
    Image: 'Image',
    Symbol: 'Symbol',
    Defs: 'Defs',
    LinearGradient: 'LinearGradient',
    RadialGradient: 'RadialGradient',
    Stop: 'Stop',
    ClipPath: 'ClipPath',
    Pattern: 'Pattern',
    Mask: 'Mask',
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
    LineChart: 'LineChart',
    BarChart: 'BarChart',
    PieChart: 'PieChart',
    ProgressChart: 'ProgressChart',
    ContributionGraph: 'ContributionGraph',
    StackedBarChart: 'StackedBarChart',
}));
