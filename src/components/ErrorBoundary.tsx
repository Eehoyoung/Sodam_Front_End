import React, {Component, ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {safeLogger} from '../utils/safeLogger';
import {errorMonitor, ErrorSeverity, ErrorType, reportRenderError} from '../utils/errorMonitoring';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: any) => void;
    enableRetry?: boolean;
    maxRetries?: number;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: any;
    retryCount: number;
    errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
    private maxRetries: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            retryCount: 0
        };
        this.maxRetries = props.maxRetries || 3;
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // SafeLogger를 사용하여 LogBox 무한 루프 방지
        safeLogger.errorBoundaryLog(error);

        // Report to error monitoring system
        reportRenderError(error.message, error.stack, {
            screen: 'ErrorBoundary',
            action: 'getDerivedStateFromError'
        });

        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // SafeLogger를 사용하여 LogBox 무한 루프 방지
        safeLogger.errorBoundaryLog(error, errorInfo);

        // Report to error monitoring system with detailed context
        const errorId = errorMonitor.reportError({
            type: ErrorType.RENDER_ERROR,
            severity: ErrorSeverity.HIGH,
            message: `ErrorBoundary caught: ${error.message}`,
            stack: error.stack,
            context: {
                screen: 'ErrorBoundary',
                action: 'componentDidCatch',
                additionalData: {
                    componentStack: errorInfo.componentStack,
                    retryCount: this.state.retryCount
                }
            }
        });

        // Update state with error info and ID
        this.setState({
            errorInfo,
            errorId: errorId ?? `error_${Date.now()}`
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleRetry = () => {
        const {retryCount} = this.state;

        if (retryCount < this.maxRetries) {
            safeLogger.log(`[ErrorBoundary] Retrying... Attempt ${retryCount + 1}/${this.maxRetries}`);

            this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined,
                retryCount: retryCount + 1
            });
        } else {
            safeLogger.warn('[ErrorBoundary] Max retries reached');
        }
    };

    handleReportError = () => {
        if (this.state.errorId) {
            const report = errorMonitor.exportErrorReports();
            safeLogger.log('[ErrorBoundary] Error report generated:', report);
            // In a real app, this would send the report to a crash reporting service
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const {enableRetry = true} = this.props;
            const {retryCount, error} = this.state;
            const canRetry = enableRetry && retryCount < this.maxRetries;

            return (
                <View style={styles.container}>
                    <Text style={styles.title}>앱에서 오류가 발생했습니다</Text>
                    <Text style={styles.message}>
                        {canRetry
                            ? '아래 버튼을 눌러 다시 시도하거나 잠시 후 다시 시도해주세요.'
                            : '앱을 다시 시작해주세요.'
                        }
                    </Text>
                    <Text style={styles.error}>
                        {error?.message || '알 수 없는 오류'}
                    </Text>

                    {retryCount > 0 && (
                        <Text style={styles.retryInfo}>
                            재시도 횟수: {retryCount}/{this.maxRetries}
                        </Text>
                    )}

                    <View style={styles.buttonContainer}>
                        {canRetry && (
                            <TouchableOpacity
                                style={[styles.button, styles.retryButton]}
                                onPress={this.handleRetry}
                            >
                                <Text style={styles.buttonText}>다시 시도</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.reportButton]}
                            onPress={this.handleReportError}
                        >
                            <Text style={styles.buttonText}>오류 신고</Text>
                        </TouchableOpacity>
                    </View>

                    {__DEV__ && (
                        <View style={styles.debugContainer}>
                            <Text style={styles.debugTitle}>디버그 정보:</Text>
                            <Text style={styles.debugText}>Error ID: {this.state.errorId}</Text>
                            <Text style={styles.debugText}>Stack: {error?.stack?.substring(0, 200)}...</Text>
                        </View>
                    )}
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
        lineHeight: 22,
    },
    error: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    retryInfo: {
        fontSize: 14,
        color: '#ff6b35',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    retryButton: {
        backgroundColor: '#2196F3',
    },
    reportButton: {
        backgroundColor: '#ff6b35',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    debugContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        width: '100%',
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
