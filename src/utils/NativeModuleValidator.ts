import {NativeModules} from 'react-native';

interface ModuleValidation {
    isAvailable: boolean;
    module: any;
    error?: string;
}

export class CriticalModuleValidator {
    static validateGestureHandler(): ModuleValidation {
        try {
            // TurboModule name exposed by RNGH
            const module = (NativeModules as any).RNGestureHandlerModule;

            if (!module) {
                return {
                    isAvailable: false,
                    module: null,
                    error: 'RNGestureHandlerModule not found in TurboModuleRegistry',
                };
            }

            // Probe for a commonly present method
            if (typeof module.handleSetJSResponder !== 'function') {
                return {
                    isAvailable: false,
                    module,
                    error: 'RNGestureHandlerModule found but missing critical methods',
                };
            }

            return {isAvailable: true, module};
        } catch (error: any) {
            return {
                isAvailable: false,
                module: null,
                error: `Validation failed: ${error?.message ?? String(error)}`,
            };
        }
    }

    static async performCriticalValidation(): Promise<boolean> {
        const gestureValidation = this.validateGestureHandler();

        if (!gestureValidation.isAvailable) {
            // Log loudly for diagnostics
            // eslint-disable-next-line no-console
            console.error('[CRITICAL] Native module validation failed:', gestureValidation.error);

            if (__DEV__) {
                try {
                    // eslint-disable-next-line no-alert
                    alert(`CRITICAL ERROR: ${gestureValidation.error}`);
                } catch {
                }
            }

            return false;
        }

        // eslint-disable-next-line no-console
        console.log('[RECOVERY] All critical native modules validated successfully');
        return true;
    }
}
