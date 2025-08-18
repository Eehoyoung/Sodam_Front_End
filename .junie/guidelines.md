# Sodam Front End Project Guidelines v2.1

This document provides comprehensive guidelines and instructions for developers working on the Sodam Front End project -
a cross-platform attendance and payroll management application for part-time workers and small business owners.

**Last Updated**: 2025-08-06  
**Version**: 2.1 - Enhanced with comprehensive development standards

## Role

Your role is the head of our project React-Native and is currently the best React-Native developer in our industry

## Project Overview

Sodam is a React Native-based cross-platform application that provides:

- **Project Plan**: [사업계획서_v2.1.md](../docs/project-management/%EC%82%AC%EC%97%85%EA%B3%84%ED%9A%8D%EC%84%9C_v2.1.md)
- **Attendance Management**: NFC tag-based check-in/out with location verification
- **Payroll Management**: Automated salary calculation and payslip generation
- **Store Management**: Multi-store support with employee management
- **Information Services**: Small business tips and government policy information
- **Q&A System**: Labor law consultation and support
- **Tax Integration**: Seamless tax filing and consultation services

### Technology Stack

- **Frontend**: React Native 0.81.0 with TypeScript
- **Cross-Platform**: Android, iOS, and Web (via React Native Web)
- **Backend**: Java Spring Boot with MySQL
- **Authentication**: Kakao OAuth + JWT
- **Key Libraries**: React Navigation, Axios, NFC Manager, Chart Kit, Date-fns

## Build/Configuration Instructions

### Prerequisites

- Node.js >= 18
- Android SDK with build tools version 35.0.0
- NDK version 27.1.12297006
- For iOS development: Xcode and iOS SDK

### Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Android

```bash
npm run android
```

#### iOS

```bash
npm run ios
```

#### Web (React Native Web)

The project supports web deployment through React Native Web, enabling the same codebase to run in browsers for desktop
management interfaces.

### Build Configuration

The project uses the following key configurations:

- React Native 0.81.0 with New Architecture enabled
- Android:
    - Compile SDK: 36
    - Min SDK: 24
    - Target SDK: 36
    - Hermes JavaScript engine enabled
    - NFC Manager for tag-based attendance tracking enabled

## Testing Information

### Testing Framework

The project uses Jest for testing with the React Native preset. The configuration is minimal:

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
};
```

### Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- path/to/test/file.test.ts
```

### Writing Tests

#### Component Tests

For React components, use React Test Renderer to create snapshots and test component behavior. Here's an example:

```typescript
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    const renderer = ReactTestRenderer.create(React.createElement(MyComponent));
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
    // Add more assertions as needed
  });
});
```

When testing components that cause state updates, wrap the test in `act()`:

```typescript
import { act } from 'react-test-renderer';

test('handles state updates', () => {
  let renderer;
  act(() => {
    renderer = ReactTestRenderer.create(React.createElement(MyComponent));
  });
  // Test interactions and assertions
});
```

#### Utility Function Tests

For utility functions, write simple unit tests that verify the expected behavior:

```typescript
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  test('formats number with default currency symbol', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(10.5)).toBe('$10.50');
  });
});
```

### Test Example

Here's a complete example of testing utility functions from the project:

```typescript
// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatTime = (timeString: string | null): string => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? '오후' : '오전';
    const hour12 = hour % 12 || 12;
    return `${ampm} ${hour12}:${minutes}`;
};

// __tests__/formatters.test.ts
import { formatCurrency, formatTime } from '../src/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
      expect(formatCurrency(10000)).toBe('₩10,000');
      expect(formatCurrency(1500)).toBe('₩1,500');
      expect(formatCurrency(0)).toBe('₩0');
    });

    test('formats large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('₩1,000,000');
      expect(formatCurrency(50000000)).toBe('₩50,000,000');
    });
  });

  describe('formatTime', () => {
    test('formats morning times correctly', () => {
      expect(formatTime('09:30')).toBe('오전 9:30');
      expect(formatTime('11:45')).toBe('오전 11:45');
    });

    test('formats afternoon times correctly', () => {
      expect(formatTime('13:30')).toBe('오후 1:30');
      expect(formatTime('18:45')).toBe('오후 6:45');
    });

    test('handles null and empty values', () => {
      expect(formatTime(null)).toBe('-');
      expect(formatTime('')).toBe('-');
    });
  });
});
```

## Additional Development Information

### Project Structure

- `src/`: Main source code
    - `assets/`: Static assets like images
    - `common/`: Shared components, hooks, styles, and utilities
    - `contexts/`: React contexts for state management
    - `features/`: Feature-specific code organized by domain
    - `navigation/`: Navigation configuration
    - `theme/`: Theme-related code (colors, typography, etc.)
    - `types/`: TypeScript type definitions
    - `utils/`: Utility functions
- `__tests__/`: Test files
- `android/`: Android-specific code
- `ios/`: iOS-specific code

### Native Module Configuration

The project uses several native modules that require special configuration:

1. **NFC Manager**: NFC functionality is enabled for attendance tracking:
   ```
   // Ensure NFC permissions are added in AndroidManifest.xml
   <uses-permission android:name="android.permission.NFC" />
   <uses-feature android:name="android.hardware.nfc" android:required="true" />
   ```

2. **React Native NFC Manager**: Configure NFC tag reading capabilities:
   ```javascript
   // NFC Manager initialization
   import NfcManager, {NfcTech} from 'react-native-nfc-manager';
   
   // Initialize NFC Manager
   NfcManager.start();
   ```

### Code Style

- The project uses TypeScript for type safety
- ESLint and Prettier are configured for code linting and formatting
- Run linting with `npm run lint`

### Troubleshooting

- If you encounter build issues with native modules, check that the SDK versions match in:
    - android/build.gradle
    - android/app/build.gradle
    - gradle.properties

- For NFC Manager issues, ensure NFC permissions are properly configured in AndroidManifest.xml

- For testing issues with React Native components, consider:
    - Properly mocking native modules
    - Using `act()` for component rendering
    - Testing pure JavaScript utilities separately from React components

## API Structure and Usage

The Sodam backend provides a comprehensive REST API documented in OpenAPI 3.0.1 format. The API is organized into the
following functional areas:

### API Base URLs

- **Development**: `http://localhost:8080`
- **Production**: `https://sodam-api.com`

### Authentication

All API endpoints require Bearer token authentication using JWT tokens obtained through Kakao OAuth login.

```typescript
// Example API call with authentication
const response = await axios.get('/api/stores/master/123', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Main API Categories

#### 1. Authentication (`/kakao/auth/proc`)

- Kakao OAuth login integration
- JWT token management
- User role assignment (employer/employee)

#### 2. Attendance Management (`/api/attendance/*`)

- **Check-in**: `POST /api/attendance/check-in` - Location-based clock-in
- **Check-out**: `POST /api/attendance/check-out` - Clock-out processing
- **Store Records**: `GET /api/attendance/store/{storeId}` - Store attendance records
- **Employee Records**: `GET /api/attendance/employee/{employeeId}` - Individual attendance
- **Monthly Summary**: `GET /api/attendance/employee/{employeeId}/monthly` - Monthly reports

#### 3. Store Management (`/api/stores/*`)

- **Location Management**: `PUT /api/stores/{storeId}/location` - Store location settings
- **Employee Management**: `GET /api/stores/{storeId}/employees` - Store staff management
- **Ownership Transfer**: `POST /api/stores/change/master` - Change store owner
- **Store Lookup**: `GET /api/stores/master/{userId}` - Employer's stores
- **Employee Stores**: `GET /api/stores/employee/{userId}` - Employee's workplaces

#### 4. Wage Management (`/api/wages/*`)

- **Standard Wage**: `PUT /api/wages/store/{storeId}/standard` - Set base hourly rate
- **Employee Wages**: `POST /api/wages/employee` - Individual wage management
- **Wage Policies**: `GET /api/wages/employee/{employeeId}/store/{storeId}` - Wage settings

#### 5. Information Services

- **Business Tips**: `/api/tip-info` - Small business advice and tips
- **Government Policies**: `/api/policy-info` - National policy information
- **Labor Information**: `/api/labor-info` - Labor law and regulations

#### 6. Q&A System (`/api/site-questions/*`)

- Question and answer management
- Labor law consultation
- User support system

### API Usage Examples

```typescript
// Check-in with location verification
const checkIn = async (storeId: number, location: {lat: number, lng: number}) => {
  const response = await axios.post('/api/attendance/check-in', {
    storeId,
    latitude: location.lat,
    longitude: location.lng,
    timestamp: new Date().toISOString()
  });
  return response.data;
};

// Get monthly attendance summary
const getMonthlyAttendance = async (employeeId: number, year: number, month: number) => {
  const response = await axios.get(`/api/attendance/employee/${employeeId}/monthly`, {
    params: { year, month }
  });
  return response.data;
};

// Update store hourly wage
const updateStoreWage = async (storeId: number, hourlyWage: number) => {
  const response = await axios.put(`/api/wages/store/${storeId}/standard`, null, {
    params: { standardHourlyWage: hourlyWage }
  });
  return response.data;
};
```

## Business Context and Features

### Target Users

1. **Part-time Workers**: Students and young adults seeking efficient attendance tracking and payroll management
2. **Small Business Owners**: Restaurant, retail, and service business owners managing multiple part-time employees
3. **Accountants/Tax Professionals**: Integration with tax filing and payroll processing services

### Core Business Features

#### Attendance System

- **NFC Tag Scanning**: React Native NFC Manager integration for quick check-in/out
- **Location Verification**: GPS-based validation to prevent time theft
- **Real-time Tracking**: Live attendance monitoring for managers

#### Payroll Management

- **Automated Calculation**: Based on attendance records and hourly rates
- **Tax Integration**: Seamless connection with Korean tax filing systems
- **Payslip Generation**: Digital payslip creation and distribution

#### Multi-Platform Support

- **Mobile Apps**: Native Android and iOS applications
- **Web Dashboard**: React Native Web for desktop management
- **Unified Experience**: Consistent UI/UX across all platforms

### Revenue Model

1. **Subscription Service**: ₩15,000/month for business owners
2. **Tax Filing Commission**: 10-20% of tax refunds
3. **Premium Consultation**: ₩50,000/month for direct tax professional access
4. **Freemium Model**: Basic features free with ads, premium features paid

### Integration Partners

- **Tax Professionals**: Partnership with certified tax accountants
- **Labor Consultants**: Integration with labor law specialists
- **Government Services**: Connection to national policy and business support systems

## Development Best Practices

### Code Organization

Follow the established feature-based architecture:

```
src/
├── features/
│   ├── attendance/     # Attendance management
│   ├── auth/          # Authentication
│   ├── salary/        # Payroll management
│   ├── workplace/     # Store management
│   ├── info/          # Information services
│   ├── qna/           # Q&A system
│   └── myPage/        # User profile
├── common/            # Shared components and utilities
├── contexts/          # React contexts for state management
└── navigation/        # App navigation configuration
```

### State Management

- Use React Context for global state (AuthContext, ThemeContext)
- Keep component state local when possible
- Implement proper error boundaries for robust error handling

### Performance Considerations

- **Image Optimization**: Compress and optimize all image assets
- **Bundle Splitting**: Use React Native's built-in code splitting
- **Memory Management**: Properly cleanup listeners and subscriptions
- **Network Optimization**: Implement request caching and retry logic

### Security Guidelines

- **Token Storage**: Use secure storage for JWT tokens
- **API Security**: Validate all API responses and handle errors gracefully
- **Location Privacy**: Request location permissions appropriately
- **Data Encryption**: Encrypt sensitive data in local storage

### Cross-Platform Considerations

- **Platform-Specific Code**: Use Platform.select() for platform differences
- **Web Compatibility**: Test React Native Web functionality thoroughly
- **Responsive Design**: Ensure UI works on various screen sizes
- **Native Module Compatibility**: Verify all native modules work across platforms

## Development Environment Standardization

### Required Development Tools

```yaml
# 권장 개발 환경
IDE: VS Code (TypeScript/React Native), Android Studio (Android), Xcode (iOS)
Node.js: 18.x LTS
npm: 8.x 이상
React Native CLI: 19.1.0
Git: 2.40 이상
Android SDK: API Level 35
NDK: 27.1.12297006
```

### Project Configuration Standards

```json
{
  "name": "Sodam_Front_End",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "react": "19.1.0",
    "react-native": "^0.80.1",
    "react-native-nfc-manager": "^3.14.13"
  }
}
```

### Code Quality Tools Configuration

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'error'
  }
};
```

#### Prettier Configuration

```json
{
  "arrowParens": "avoid",
  "bracketSameLine": true,
  "bracketSpacing": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true
}
```

#### TypeScript Configuration

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "src/**/*",
    "__tests__/**/*"
  ],
  "exclude": [
    "node_modules",
    "android",
    "ios"
  ]
}
```

## Security Guidelines

### Authentication Security

```typescript
// JWT 토큰 보안 저장
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from './encryption';

export const TokenManager = {
  async storeToken(token: string): Promise<void> {
    const encryptedToken = encrypt(token);
    await AsyncStorage.setItem('auth_token', encryptedToken);
  },
  
  async getToken(): Promise<string | null> {
    const encryptedToken = await AsyncStorage.getItem('auth_token');
    return encryptedToken ? decrypt(encryptedToken) : null;
  },
  
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
  }
};
```

### API Security Best Practices

```typescript
// API 요청 보안 설정
import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await TokenManager.removeToken();
      // 로그인 화면으로 리다이렉트
    }
    return Promise.reject(error);
  }
);
```

### Data Validation

```typescript
// 입력 데이터 검증
import { z } from 'zod';

export const AttendanceSchema = z.object({
  storeId: z.number().positive(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timestamp: z.string().datetime(),
  nfcTagId: z.string().min(1).max(50)
});

export const validateAttendanceData = (data: unknown) => {
  return AttendanceSchema.safeParse(data);
};
```

## Testing Framework Standards

### Unit Testing Configuration

```javascript
// jest.config.cjs
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Testing Best Practices

```typescript
// 컴포넌트 테스트 예제
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AttendanceButton } from '../AttendanceButton';

describe('AttendanceButton', () => {
  const mockOnPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <AttendanceButton onPress={mockOnPress} title="출근" />
    );
    
    expect(getByText('출근')).toBeTruthy();
  });

  test('calls onPress when pressed', async () => {
    const { getByText } = render(
      <AttendanceButton onPress={mockOnPress} title="출근" />
    );
    
    fireEvent.press(getByText('출근'));
    
    await waitFor(() => {
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});
```

### NFC Manager Testing

```typescript
// NFC 서비스 테스트
import NfcManager from 'react-native-nfc-manager';
import { NFCAttendanceService } from '../NFCAttendanceService';

jest.mock('react-native-nfc-manager');

describe('NFCAttendanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize NFC manager', async () => {
    const mockStart = jest.spyOn(NfcManager, 'start').mockResolvedValue(true);
    
    await NFCAttendanceService.initialize();
    
    expect(mockStart).toHaveBeenCalled();
  });

  test('should read NFC tag', async () => {
    const mockReadNdefOnce = jest.spyOn(NfcManager, 'readNdefOnce')
      .mockResolvedValue({ ndefMessage: [{ payload: 'test-tag-id' }] });
    
    const result = await NFCAttendanceService.readTag();
    
    expect(mockReadNdefOnce).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
```

## Performance Optimization Guidelines

### Bundle Optimization

```javascript
// metro.config.cjs
const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Bundle splitting 설정
  config.serializer = {
    ...config.serializer,
    createModuleIdFactory: () => (path) => {
      // 모듈 ID 최적화
      return require('crypto').createHash('sha1').update(path).digest('hex');
    }
  };

  // 이미지 최적화
  config.transformer = {
    ...config.transformer,
    assetPlugins: ['react-native-asset-plugin']
  };

  return config;
})();
```

### Memory Management

```typescript
// 메모리 누수 방지
import { useEffect, useRef } from 'react';

export const useCleanup = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanup = (fn: () => void) => {
    cleanupFunctions.current.push(fn);
  };

  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(fn => fn());
      cleanupFunctions.current = [];
    };
  }, []);

  return { addCleanup };
};
```

### Network Optimization

```typescript
// 요청 캐싱 및 재시도 로직
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheManager {
  private static CACHE_PREFIX = 'api_cache_';
  private static CACHE_DURATION = 5 * 60 * 1000; // 5분

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        await this.remove(key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  static async set<T>(key: string, data: T): Promise<void> {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheData));
  }

  static async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(this.CACHE_PREFIX + key);
  }
}
```

## Error Handling Standards

### Global Error Boundary

```typescript
// ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // 에러 로깅 서비스로 전송
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 구현
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>문제가 발생했습니다.</Text>
          <Button
            title="다시 시도"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// 표준화된 에러 처리
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NFC_ERROR = 'NFC_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): AppError => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return new AppError(ErrorCode.UNAUTHORIZED, '인증이 필요합니다.');
      case 400:
        return new AppError(ErrorCode.VALIDATION_ERROR, '입력 데이터를 확인해주세요.');
      default:
        return new AppError(ErrorCode.NETWORK_ERROR, '서버 오류가 발생했습니다.');
    }
  }
  
  return new AppError(ErrorCode.NETWORK_ERROR, '네트워크 연결을 확인해주세요.');
};
```

## Deployment Procedures

### Android Deployment

```bash
# Android 릴리스 빌드
cd android
./gradlew clean
./gradlew bundleRelease

# APK 생성
./gradlew assembleRelease

# 서명 확인
keytool -list -v -keystore app/release.keystore
```

### iOS Deployment

```bash
# iOS 릴리스 빌드
cd ios
xcodebuild clean -workspace SodamFrontEnd.xcworkspace -scheme SodamFrontEnd
xcodebuild archive -workspace SodamFrontEnd.xcworkspace -scheme SodamFrontEnd -archivePath build/SodamFrontEnd.xcarchive

# App Store 업로드
xcodebuild -exportArchive -archivePath build/SodamFrontEnd.xcarchive -exportPath build/ -exportOptionsPlist ExportOptions.plist
```

### Web Deployment

```bash
# React Native Web 빌드
npm run build:web

# 정적 파일 배포
npm run deploy:web
```

## Monitoring and Logging

### Performance Monitoring

```typescript
// 성능 모니터링
import { Performance } from 'react-native-performance';

export const PerformanceMonitor = {
  startTimer: (name: string) => {
    Performance.mark(`${name}-start`);
  },
  
  endTimer: (name: string) => {
    Performance.mark(`${name}-end`);
    Performance.measure(name, `${name}-start`, `${name}-end`);
  },
  
  logMetrics: () => {
    const entries = Performance.getEntriesByType('measure');
    entries.forEach(entry => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  }
};
```

### Crash Reporting

```typescript
// 크래시 리포팅 설정
import crashlytics from '@react-native-firebase/crashlytics';

export const CrashReporter = {
  logError: (error: Error, context?: string) => {
    if (context) {
      crashlytics().setContext('error_context', context);
    }
    crashlytics().recordError(error);
  },
  
  setUserId: (userId: string) => {
    crashlytics().setUserId(userId);
  },
  
  setCustomKey: (key: string, value: string | number | boolean) => {
    crashlytics().setCustomKey(key, value);
  }
};
```

## Code Quality and Coding Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfileCard`, `AttendanceButton`)
- **Functions/Variables**: camelCase (e.g., `getUserData`, `isLoading`)
- **Custom Hooks**: camelCase with 'use' prefix (e.g., `useUserData`, `useAttendance`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`, `DEFAULT_TIMEOUT`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse<T>`)
- **Files**: kebab-case for components (e.g., `user-profile-card.tsx`)

### Component Design Principles

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use default parameters instead of defaultProps
- **Component Size**: Keep components under 200 lines; split larger components
- **Reusability**: Design components to be reusable across different contexts

#### Component Structure Example

```typescript
// ✅ Good Example
interface AttendanceButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const AttendanceButton: React.FC<AttendanceButtonProps> = ({
  onPress,
  title,
  isLoading = false,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.button, disabled && styles.disabled]}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

### State Management Guidelines

- **Local State**: Use `useState` for component-specific state
- **Global State**: Use React Context for app-wide state (auth, theme, etc.)
- **Complex State**: Use `useReducer` for complex state logic
- **State Updates**: Always use functional updates for state that depends on previous state
- **State Structure**: Keep state flat and normalized when possible

### Function Design Principles

- **Pure Functions**: Prefer pure functions for utility functions
- **Function Length**: Keep functions under 50 lines
- **Parameters**: Limit to 3 parameters; use objects for more
- **Return Types**: Always specify return types in TypeScript
- **Error Handling**: Use proper error boundaries and try-catch blocks

## React Native Specific Security Guidelines

### Secure Storage Best Practices

```typescript
// Secure token storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from './encryption';

export const SecureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    const encryptedValue = encrypt(value);
    await AsyncStorage.setItem(key, encryptedValue);
  },
  
  async getItem(key: string): Promise<string | null> {
    const encryptedValue = await AsyncStorage.getItem(key);
    return encryptedValue ? decrypt(encryptedValue) : null;
  }
};
```

### Network Security

- **HTTPS Only**: All API calls must use HTTPS
- **Certificate Pinning**: Implement certificate pinning for production
- **Request Timeout**: Set appropriate timeouts for all network requests
- **Data Validation**: Validate all data received from APIs
- **Error Messages**: Don't expose sensitive information in error messages

### Permission Management

```typescript
// Location permission handling
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
};
```

## Documentation Guidelines

### Document Directory Structure

All project documentation is organized under the `docs/` directory with the following structure:

```
docs/
├── components/          # Component documentation
├── features/           # Feature-specific documentation
├── api/               # API integration documentation
├── deployment/        # Deployment guides
├── troubleshooting/   # Problem-solving guides
└── assets/           # Documentation assets (images, diagrams)
```

### Documentation Standards

#### File Naming Rules

1. **Basic Principles**:
    - Use **Korean** or **English** consistently (no mixing)
    - Use underscores (`_`) or hyphens (`-`) instead of spaces
    - Always use `.md` extension

2. **Naming Patterns**:
    - Sequential documents: `Guide01.md`, `Guide02.md`
    - Date-based: `YYMMDD_document_name.md`
    - Version-based: `document_name_v1.0.md`

3. **Category Prefixes**:
    - Analysis documents: `분석_`, `Analysis_`
    - Implementation guides: `구현_`, `Implementation_`
    - User guides: `가이드_`, `Guide_`

#### Document Structure Standard

All documents must follow this structure:

```markdown
# Document Title

## 📋 Overview
- **Created**: YYYY-MM-DD
- **Author**: [Author Name]
- **Type**: [Guide/Report/Analysis/Implementation]
- **Related Issue**: [Issue Number or N/A]

## 🎯 Purpose
[Document purpose and scope]

## 📝 Content
[Main content]

## 🔗 Related Documents
- [Related document links]

## 📅 Change History
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| YYYY-MM-DD | 1.0 | Initial creation | [Author] |
```

#### Component Documentation

For React Native components, use this template:

```markdown
# ComponentName

## Overview
Brief description of the component's purpose and functionality.

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Button title text |
| onPress | () => void | Yes | - | Press handler function |
| disabled | boolean | No | false | Whether button is disabled |

## Usage Example
```typescript
import { ComponentName } from './ComponentName';

const ExampleScreen = () => {
  return (
    <ComponentName
      title="Click Me"
      onPress={() => console.log('Pressed')}
    />
  );
};
```

## Testing Guidelines

- Unit tests should be in `__tests__` folders
- Integration tests should cover user workflows
- Mock external dependencies appropriately

```

### API Documentation Standards
- **Location**: `docs/api/`
- **Format**: OpenAPI 3.0 specification when possible
- **Manual Documentation**: Include business logic explanations and usage examples
- **Examples**: Provide request/response examples for all endpoints

### Feature Documentation
Each feature should have comprehensive documentation including:
- **Purpose**: What problem the feature solves
- **User Stories**: How users interact with the feature
- **Technical Implementation**: Architecture and key components
- **Testing Strategy**: How the feature is tested
- **Known Issues**: Current limitations or bugs

### Deployment Documentation
- **Environment Setup**: Step-by-step setup instructions
- **Build Process**: Detailed build and deployment steps
- **Configuration**: Environment-specific configurations
- **Rollback Procedures**: How to rollback deployments
- **Monitoring**: How to monitor the deployed application

### Documentation Quality Standards
- **Accuracy**: All documentation must be accurate and up-to-date
- **Completeness**: Cover all aspects of the topic
- **Clarity**: Use clear, concise language
- **Examples**: Include practical examples and code snippets
- **Maintenance**: Regular reviews and updates

### Documentation Tools and Automation
- **Markdown Editors**: Typora, Mark Text, VS Code
- **Diagrams**: Draw.io, PlantUML, Mermaid
- **API Documentation**: Swagger UI, Postman collections
- **Screenshots**: Consistent styling and up-to-date captures
- **Link Validation**: Regular automated link checking

## UI/UX Consistency Guidelines

### Design System Implementation
- **Colors**: Use theme-based color system
- **Typography**: Consistent font sizes and weights
- **Spacing**: Use standardized spacing units (4px, 8px, 16px, 24px, 32px)
- **Components**: Reuse common UI components
- **Icons**: Use consistent icon library (Expo Vector Icons)

### Accessibility Guidelines
- **Screen Readers**: Implement proper accessibility labels
- **Color Contrast**: Ensure sufficient color contrast ratios
- **Touch Targets**: Minimum 44px touch target size
- **Focus Management**: Proper focus handling for navigation
- **Text Scaling**: Support dynamic text sizing

### Responsive Design
- **Screen Sizes**: Support various screen sizes and orientations
- **Safe Areas**: Respect device safe areas
- **Keyboard Handling**: Proper keyboard avoidance
- **Platform Differences**: Handle iOS/Android platform differences

---

*이 가이드라인은 백엔드 개발팀의 표준과 일치하도록 지속적으로 업데이트됩니다.*
