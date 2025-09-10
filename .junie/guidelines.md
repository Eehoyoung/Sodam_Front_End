# Sodam Front End Project Guidelines v3.2

This document provides comprehensive guidelines and instructions for developers working on the Sodam Front End project -
a cross-platform attendance and payroll management application for part-time workers and small business owners.

**Last Updated**: 2025-09-05  
**Version**: 3.2.0 - Change Scale Decision Framework implementation, balanced change policy, flexible approach to problem-solving

## Role

This section defines the principles and expectations regarding the assignment of roles in AI-assisted workflows

### Automatic Role Assignment Policy

1. At the beginning of every task or session, the AI must automatically determine and assign an appropriate role based on the task’s objective and contextual information.

2. Role assignment should be guided by the following criteria:
2.1 Purpose of the task (e.g., analysis, evaluation, generation, verification)
2.2 Type of input documents or user requests
2.3 Relevant policies, technical stack, and document structure

3. Even when a role is not explicitly specified, the AI is expected to autonomously infer and assign a suitable role, which must be clearly stated at the top of logs or reports.

4. **Example roles include:**
- Document Consistency Verifier
- Implementation Evaluator
- Flow Analyst
- Test Designer
- UX Flow Reviewer
- React Native Engineer — responsible for mobile architecture and UI logic
- Backend Engineer — responsible for API integrity and system performance
- QA Specialist — responsible for validation, edge case coverage, and regression prevention
- Release Coordinator — ensures delivery alignment across environments
- Security Reviewer — evaluates authentication, data handling, and policy compliance
5. Role assignment is considered a mandatory procedure to ensure the quality, clarity, and consistency of all deliverables.

## Post-Task Logging Policy
- Upon completion of every task, the AI must immediately record a summary of the task in the central file named Master_Task_Log.md.
- The log entry must include the following details:
- Task title and unique identifier (e.g., Task #2025-09-08-01)
- Assigned role(s) and functional responsibility
- Summary of key changes or implementation details
- Related file paths or code locations
- Test status and result (e.g., PASS / FAIL / Skipped)
- Recommended next steps or follow-up actions
- Logging is considered a mandatory step in the task lifecycle. If omitted, the session is not considered complete.
- [Master_Task_Log.md](../Master_Task_Log.md) serves as the single source of truth for all task history and must be updated sequentially without overwriting previous entries.
- Example log format:
- 
### Task #2025-09-08-01 — Navigation Flow: Welcome → Auth → Home Completed
- Role: Flow Analyst / React Native Engineer
- Summary: Set initial route in AppNavigator; added reset logic in LoginScreen
- Files: src\navigation\AppNavigator.tsx, src\features\auth\LoginScreen.tsx
- Test: flow.moderate.test.tsx (PASS)
- Next: Implement token-based initial routing logic

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
    "react-native": "0.81.0",
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
// jest.config.js
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
// metro.config.js
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


## Maintenance & Change Management

### Purpose
- Establish a consistent process for maintaining, deprecating, and evolving features across mobile (Android/iOS) and Web targets.
- Ensure operational safety via checklists, automation, and CI guardrails.

### Principles
- Security and stability first. All deprecations must be safe-by-default (feature flags or complete removal) and reversible via version control.
- Minimize functional coupling. Identify upstream/downstream dependencies before changing service boundaries.
- Automation over manual checks. Each policy must come with a scriptable verification where feasible.

### Standard Deprecation Workflow
1. Inventory & Coupling Analysis
   - Map affected files: code (services/hooks/components), navigation/routes, native manifests, tests, docs.
   - Identify coupling: shared types, analytics events, permissions, environment variables, build configs.
2. Plan & Communicate
   - Draft a removal plan (scope, impact, acceptance criteria, rollback path) and share in docs/.
3. Implement
   - Remove/replace feature code; update navigation; adjust native permissions and build configs.
   - Update tests and documentation accordingly.
4. Verify (Local)
   - Run unit tests and static checks.
   - Run feature-specific scanners if available (see QR example below).
5. Guard (CI)
   - Add CI step to fail builds if residuals are detected (scripts listed below).
6. Rollback
   - Keep changes in a feature branch and use PR-level reverts if needed.

### NFC Standardization and QR Deprecation (2025-08-28)
- Context: QR attendance has been fully deprecated; NFC is the single source for tag-based attendance.
- Implemented Changes (summary):
  - Removed QR services/hooks/components:
    - src\features\attendance\services\qrAttendanceService.ts (deleted)
    - src\features\attendance\services\attendanceService.ts: removed verifyQrCodeAttendance, getWorkplaceQrCode
    - src\features\attendance\hooks\useAttendanceQueries.ts: removed useVerifyQrCodeAttendance
    - src\features\welcome\components\demos\QRCodeDemo.tsx (deleted)
  - Android manifest cleanup:
    - Removed CAMERA permission and camera uses-feature entries
    - Kept NFC permissions and TAG/NDEF intent-filters
  - Added automation:
    - scripts\scan-qr-residue.ps1 to scan repository and produce logs\qr-scan-report.md
- Acceptance Criteria:
  - No QR code endpoints/components/hooks/permissions remain (code, tests, docs), except in the guideline and scan artifacts.
  - CI step fails if residual QR keywords are found outside allowed paths.
- How to run the scanner (Windows PowerShell):
  - powershell -ExecutionPolicy Bypass -File .\scripts\scan-qr-residue.ps1
  - powershell -ExecutionPolicy Bypass -File .\scripts\scan-qr-residue.ps1 -FailOnMatch

### Welcome Page as Main (Minimal mode decommissioned)
- Initial route fixed to 'Welcome'; MinimalNavigator path removed from routing.
- See: docs\개편_웰컴페이지_방향성_v2.1_2025-08-28.md for IA and acceptance criteria.

### CI Guardrails
- Integrate scripts\scan-qr-residue.ps1 with -FailOnMatch in CI so builds fail when disallowed residuals are detected.
- Keep exclusions limited to:
  - docs\QR_Residual_Removal_Guide_2025-08-28.md
  - scripts\scan-qr-residue.ps1
  - Generated bundle artifacts and lock files

### Ownership & SLO
- Owner: RN Lead (Junie) for app-layer; Android/iOS leads for native manifests; QA for CI guardrails.
- SLO: Residual-deprecation regressions (e.g., QR references reintroduced) must be triaged within 24h and hotfixed within 72h.

### Related Documents
- docs\QR_Residual_Removal_Guide_2025-08-28.md
- docs\개편_웰컴페이지_방향성_v2.1_2025-08-28.md
- docs\작업계획서_Sodam_FE_웰컴메인_및_문서표준화_v2.1.4_2025-08-29.md

### Library & Feature Lifecycle Coverage
- Scope: Applies to app-layer features and commonly used React Native libraries.
- Library Categories (examples; extend as needed):
  - Navigation: React Navigation (core, stacks, tabs), react-native-screens
  - Animations/Gestures: React Native Reanimated, react-native-gesture-handler
  - Permissions/Device Capabilities: react-native-permissions, NFC Manager, camera modules (if reintroduced)
  - Networking/State/Storage: axios, AsyncStorage/MMKV, React Query (if used)
  - Firebase Suite: @react-native-firebase (analytics, crashlytics, messaging)
  - Maps/Location: react-native-maps, geolocation
  - Notifications/Deep Link: FCM/APNs, Linking configuration
  - Web/Build: React Native Web, Metro/Hermes configs
  - Android/iOS Build Tooling: AGP/Kotlin/NDK, Xcode/Pods
- Update/Deprecation Playbooks (high-level):
  - React Navigation (major upgrade):
    1) Inventory navigators/types/routes; 2) Upgrade packages; 3) Adjust linking and type defs; 4) Smoke test core flows; 5) Update docs.
  - Reanimated (upgrade/removal):
    1) Verify Babel plugin/JSI flags; 2) Migrate APIs (v2->v3); 3) Replace animations if removing; 4) Run Android/iOS build; 5) Remove unused code.
  - Firebase module (add/remove):
    1) Add/remove native config (Android/iOS); 2) Update permission declarations; 3) Verify initialization; 4) Add mocks to tests; 5) Document data/privacy impact.
  - Permissions change:
    - Follow camera deprecation precedent: remove uses-permission/features, update screens, and run a residue scanner.
- Test Requirements (per change):
  - Unit tests for affected utilities/hooks and smoke tests for top 3 user flows; mock native modules as needed.

### Change Scale Decision Framework (Policy)

#### Core Philosophy: Right-Sized Changes for Right Problems

**Important**: While efficiency favors minimal changes, sometimes small fixes create bigger problems. This framework helps determine the appropriate scale of change based on problem scope and risk assessment.

#### Change Scale Categories

1. **Minimal Changes** (Preferred when appropriate):
   - Single file modifications
   - Localized bug fixes
   - Configuration adjustments
   - Simple component updates
   - **Use when**: Problem is isolated, well-understood, and low-risk

2. **Moderate Changes** (Often necessary):
   - Multi-file coordinated updates
   - Feature enhancements
   - Dependency upgrades
   - Cross-component refactoring
   - **Use when**: Problem spans multiple components but within single domain

3. **Comprehensive Changes** (Sometimes essential):
   - Architecture overhauls
   - Build system migrations
   - Global state management changes
   - Cross-cutting security implementations
   - **Use when**: Minimal fixes would create technical debt or instability

#### When Small Changes Create Big Problems

**Warning Signs** that minimal changes may backfire:
- **Cascade Dependencies**: Fixing one small issue reveals interconnected problems
- **Technical Debt Accumulation**: Quick fixes that compound maintenance burden
- **Inconsistent Patterns**: Patch solutions that break architectural consistency
- **Security Vulnerabilities**: Partial security fixes that leave attack vectors open
- **Performance Degradation**: Localized optimizations that harm overall performance

**Real Examples from Project History**:
- QR code removal: Initially seemed like a small deprecation, but required comprehensive cleanup across navigation, permissions, and documentation
- React Native Reanimated updates: Minor version bumps often require architectural changes due to breaking API changes
- NFC permission management: Localized permission fixes often need coordinated manifest and runtime handling

#### Decision Matrix

| Problem Scope | Risk Level | Recommended Approach | Required Process |
|---------------|------------|---------------------|------------------|
| Single Component | Low | Minimal Change | Standard review |
| Multiple Components | Low-Medium | Moderate Change | Enhanced testing |
| Cross-Domain | Medium | Moderate-Comprehensive | Architecture review |
| System-Wide | High | Comprehensive Change | Full proposal process |
| Security/Stability | Any | Scale to eliminate risk | Immediate comprehensive |

#### Implementation Guidelines

**For Minimal Changes**:
- Direct implementation with standard testing
- Single PR with clear scope

**For Moderate Changes**:
- Break into logical phases when possible
- Enhanced test coverage for affected areas
- Documentation updates included

**For Comprehensive Changes**:
- Mandatory process retained from previous policy:
  1) Prepare change proposal: docs\\change-proposals\\<YYMMDD>_<slug>_comprehensive_change_proposal.md
  2) Create dedicated branch: feat/comprehensive-change/<slug>-<YYMMDD>
  3) Request explicit approval before implementation
  4) Feature flags and rollback documentation required
  5) Full test suite and scanner verification

#### Quality Gates (All Changes)

- **Before Implementation**: Risk assessment and scope determination
- **During Implementation**: Continuous verification and testing
- **After Implementation**: Verification of acceptance criteria and monitoring

#### Emergency Override Policy

When critical issues (security, production outages) require immediate comprehensive changes:
- Document emergency justification
- Implement with maximum safety measures
- Complete formal process documentation post-resolution
- Conduct post-incident review for process improvement

### CI/Automation Extensions
- Extend the scanner concept beyond QR when deprecating other features/libs by adding pattern-based scripts (follow scripts\\scan-qr-residue.ps1 as a reference) and enable -FailOnMatch in CI.


## AI 어시스턴트 프롬프트 표준 v3

본 섹션은 docs\가이드_AI_프롬프트_작성_베스트프랙티스_v2.1.3_2025-08-30.md의 표준을 프로젝트 운영 규칙으로 승격한 것입니다. 모든 AI 보조 작업(이슈 분석/수정/문서화)은 아래 규칙과 스켈레톤을 따라야 합니다.

### 1) 기본 원칙 (Principles)
- 구체성: 변경 대상 파일 경로, 함수/컴포넌트 이름, 재현 절차, 기대 결과를 명시합니다.
- 제약 명시: OS(Windows), 셸(PowerShell), 경로 구분자(\\), RN/React/SDK 버전, "적절한 규모의 변경" 원칙 등을 조건으로 고정합니다.
- 수락기준(AC) 선제시: 완료 정의(정상 빌드, 특정 테스트 통과, 특정 스크린 진입 등)를 미리 제공합니다.
- 안전성: 민감한 권한, 네이티브 설정 변경 시 근거와 영향 범위를 명시하고, 회귀 위험 줄이기(테스트/스캐너 실행)를 요청합니다.
- 도구 우선: 프로젝트 내 제공되는 전용 도구와 스크립트를 먼저 사용하도록 지시합니다. (예: search_project, create, search_replace, run_test, PowerShell 스크립트 등)
- 재현 가능성: 오류/현상 재현 스크립트 또는 테스트를 명시하고, 수정 후 재실행을 요구합니다.

### 2) 필수 환경/조건 명세 (항상 프롬프트 상단 포함)
- OS/셸: Windows, PowerShell 사용. 모든 경로는 백슬래시(\\) 사용.
- RN/React: React Native 0.81.0(New Architecture, Hermes), React 19.1.0
- Android 설정: Compile/Target SDK 36, Min SDK 24, Hermes 활성화
- Node: >= 18
- 테스트: Jest preset ‘react-native’, jest.setup.js 존재
- 제품 정책: 태그 기반 근태(NFC 중심). 과거 잔존물 방지 준수(스캐너 사용).
- 내비게이션: 초기 라우트는 Welcome 고정
- 원칙: "적절한 규모의 변경"으로 해결, 변경된 파일에 한해 관련 테스트 점검
- 경로/명령: PowerShell 포맷, 전용 툴과 터미널 명령 한 줄 혼용 금지

### 3) 프롬프트 스켈레톤 (복사 후 이슈에 맞게 작성)
```
[이슈 요약]
- 문제/요청:
- 영향 범위:
- 재현 방법(있다면):
- 기대 결과(수락기준):

[환경/조건]
- OS/셸: Windows + PowerShell, 경로는 \\ 사용
- RN/React/Node: RN 0.81.0(New Arch, Hermes) / React 19.1.0 / Node >=18
- Android: Compile/Target SDK 36, Min 24
- 테스트: Jest preset ‘react-native’
- 원칙: 적절한 규모의 변경, 관련 테스트 유지, 문서 표준 준수

[대상 파일/심볼]
- 파일 경로:
- 관련 컴포넌트/함수/훅/테스트:

[세부 작업]
- 단계별 할 일 목록:
- 변경 후 검증 방법(테스트/빌드/스크립트):

[출력 형식 요구]
- <UPDATE> 섹션에 PREVIOUS_STEP/PLAN/NEXT_STEP 포함
- PowerShell 규칙 및 특수 도구 사용 규칙 준수
- 코드 수정 시 적절한 규모의 변경, 에지 케이스 고려
```

### 4) <UPDATE> 운영 규칙
- 모든 응답은 반드시 <UPDATE> 블록을 포함하고, 내부에 다음 3개 하위 태그를 갖습니다:
  - <PREVIOUS_STEP>: 직전 결과/관찰 요약
  - <PLAN>: 번호 매기기(1., 2., …) + 하위 불릿. 진행 상태 표기: ✓(완료), *(진행중), !(실패)
  - <NEXT_STEP>: 다음으로 수행할 즉시 행동 요약
- <UPDATE> 바로 뒤에 동일 응답 내에서 전용 도구 호출을 1회 이상 수행합니다. 도구 호출 전에는 절대 호출 금지.
- 전용 도구와 터미널 명령을 같은 커맨드 라인에서 결합 금지.
- Windows 경로(\\) 사용, PowerShell 문법 유지.

### 5) 자동화 스크립트 (프롬프트 생성기)
- 스크립트: scripts\generate-ai-prompt.ps1
- 목적: 표준 프롬프트 스켈레톤을 신속히 생성하여 이슈 템플릿 품질을 균일화
- 사용 예시(파일로 저장):
  - powershell -ExecutionPolicy Bypass -File .\scripts\generate-ai-prompt.ps1 -Issue "빌드 오류" -Impact "Android 그레이들" -AC "CI 통과" -OutFile ".\docs\AI_Prompt_Example_250830.md"
- 사용 예시(클립보드로 바로 복사):
  - powershell -ExecutionPolicy Bypass -File .\scripts\generate-ai-prompt.ps1 -Issue "NFC 초기화 실패" | Set-Clipboard
- 매개변수: -Issue, -Impact, -Repro, -AC, -Files(";" 구분), -Symbols(";" 구분), -Steps(";" 구분), -Verify(";" 구분), -OutFile

### 6) 상황별 가이드
- 버그 수정: 재현 스크립트/테스트를 먼저 제시하고, 수정 후 재실행 결과를 보고합니다.
- 구성 변경: 변경 전/후 설정 차이, 영향 범위, 롤백 경로, 수락기준을 명시합니다.
- 문서 개정: 버전/날짜/변경 요약을 문서 상단에 업데이트하고, 레퍼런스 문서를 링크합니다.

### 7) 수락 기준(프롬프트 관점)
- <UPDATE> 및 도구 호출 규칙 준수
- 계획 항목과 진행 상태 기호의 일관성
- 환경/조건 절 포함
- 적절한 규모의 변경 원칙과 검증 절차 명시

## Maintenance Guidelines

### Project Maintenance Standards

For comprehensive maintenance procedures, refer to the dedicated maintenance guide:
- **Document**: [Maintenance Guide v1.0](../docs/Maintenance_Guide_v1.0_2025-09-01.md)
- **Scope**: Covers all aspects of project maintenance including regular checks, troubleshooting, security updates, and performance monitoring

### Key Maintenance Principles

1. **Preventive Maintenance**: Regular checks and proactive updates
2. **Security First**: Immediate response to security vulnerabilities
3. **Performance Monitoring**: Continuous tracking of build and runtime performance
4. **Documentation**: Keep all maintenance procedures documented and up-to-date
5. **Change Management**: Structured approach to updates and modifications

### Maintenance Schedule

- **Weekly**: Build status checks, security updates, performance monitoring
- **Monthly**: Dependency updates, configuration reviews, code quality assessment  
- **Quarterly**: Comprehensive security audit, performance benchmarking, dependency cleanup

### Emergency Response

For critical issues requiring immediate attention:
1. Follow the emergency rollback procedures in the maintenance guide
2. Contact RN Lead (Junie) for technical support
3. Document all emergency actions for post-incident analysis

## v3 변경 사항 요약 (2025-08-30)
- 추가: AI 프롬프트 표준 v3 섹션(본 문서) 및 <UPDATE> 운영 규칙 명문화
- 추가: scripts\generate-ai-prompt.ps1 프롬프트 생성 스크립트
- 정합성: 예시 구성 JSON의 react-native 버전을 0.81.0으로 통일
- 유지: NFC 전용 정책과 QR 잔존물 스캐너/CI 가드레일 정책 유지

## v3.1 변경 사항 요약 (2025-09-01)
- 추가: 유지보수 가이드라인 섹션 및 전용 문서 연결
- 업데이트: 엔터프라이즈급 설정 고도화 완료 반영
- 강화: 보안 및 성능 모니터링 절차 명문화

## v3.2 변경 사항 요약 (2025-09-05)
- 주요 개편: "Minimal Change Principle" → "Change Scale Decision Framework"로 전면 개선
- 유연성 강화: 작은 변경이 큰 문제를 야기할 수 있는 사례와 판단 기준 명시
- 정책 개선: "최소 변경" → "적절한 규모의 변경" 원칙으로 전환
- 의사결정 지원: 변경 규모별 구체적인 가이드라인과 결정 매트릭스 제공
- 실용성 증대: 상황별 맞춤형 접근 방식으로 개발 효율성과 품질 균형
