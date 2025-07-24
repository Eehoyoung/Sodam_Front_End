# Sodam Front End Project Guidelines

This document provides comprehensive guidelines and instructions for developers working on the Sodam Front End project -
a cross-platform attendance and payroll management application for part-time workers and small business owners.

## Project Overview

Sodam is a React Native-based cross-platform application that provides:

- **Attendance Management**: QR code-based check-in/out with location verification
- **Payroll Management**: Automated salary calculation and payslip generation
- **Store Management**: Multi-store support with employee management
- **Information Services**: Small business tips and government policy information
- **Q&A System**: Labor law consultation and support
- **Tax Integration**: Seamless tax filing and consultation services

### Technology Stack

- **Frontend**: React Native 0.80.0 with TypeScript
- **Cross-Platform**: Android, iOS, and Web (via React Native Web)
- **Backend**: Java Spring Boot with MySQL
- **Authentication**: Kakao OAuth + JWT
- **Key Libraries**: React Navigation, Axios, Vision Camera, Chart Kit, Date-fns

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

- React Native 0.80.0 with New Architecture enabled
- Android:
    - Compile SDK: 35
    - Min SDK: 24
    - Target SDK: 35
    - Hermes JavaScript engine enabled
    - VisionCamera frame processors and code scanner enabled

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

1. **VisionCamera**: Frame processors and code scanner are enabled in gradle.properties:
   ```
   VisionCamera_enableFrameProcessors=true
   VisionCamera_enableCodeScanner=true
   ```

2. **React Native Camera**: Uses the MLKit flavor:
   ```gradle
   // In app/build.gradle
   defaultConfig {
       missingDimensionStrategy "react-native-camera", "mlkit"
   }
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

- For React Native Camera issues, ensure the MLKit flavor is properly configured

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

- **QR Code Scanning**: React Native Vision Camera integration for quick check-in/out
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
