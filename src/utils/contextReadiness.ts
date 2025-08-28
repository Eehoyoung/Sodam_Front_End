import {InteractionManager} from 'react-native';

/**
 * Context Readiness Manager
 * Coordinates React Native context initialization with Android lifecycle events
 * to prevent ReactNoCrashSoftException timing issues
 */
export class ContextReadinessManager {
    private static instance: ContextReadinessManager;
    private isReady = false;
    private readyPromise: Promise<void>;
    private resolveReady: (() => void) | null = null;
    private readyCallbacks: Array<() => void> = [];
    private readyTimestamp: number | null = null;

    private constructor() {
        this.readyPromise = new Promise<void>((resolve) => {
            this.resolveReady = resolve;
        });
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ContextReadinessManager {
        if (!ContextReadinessManager.instance) {
            ContextReadinessManager.instance = new ContextReadinessManager();
        }
        return ContextReadinessManager.instance;
    }

    /**
     * Check if React Native context is ready
     */
    public isContextReady(): boolean {
        return this.isReady;
    }

    /**
     * Get a promise that resolves when context is ready
     */
    public waitForReady(): Promise<void> {
        return this.readyPromise;
    }

    /**
     * Signal that React Native context is ready
     * Should be called after all critical initialization is complete
     */
    public signalReady(): void {
        if (this.isReady) {
            console.warn('[CONTEXT_READINESS] signalReady called but context already ready');
            return;
        }

        console.log('[CONTEXT_READINESS] React Native context is now ready');
        this.isReady = true;
        this.readyTimestamp = Date.now();

        // Resolve the promise
        if (this.resolveReady) {
            this.resolveReady();
        }

        // Execute all pending callbacks
        this.readyCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('[CONTEXT_READINESS] Error in ready callback:', error);
            }
        });
        this.readyCallbacks = [];

        // Signal native layer if available
        this.signalNativeLayer();
    }

    /**
     * Add a callback to be executed when context is ready
     */
    public onReady(callback: () => void): void {
        if (this.isReady) {
            // Execute immediately if already ready
            try {
                callback();
            } catch (error) {
                console.error('[CONTEXT_READINESS] Error in immediate callback:', error);
            }
        } else {
            // Queue for later execution
            this.readyCallbacks.push(callback);
        }
    }

    /**
     * Get timing information for diagnostics
     */
    public getReadyTimestamp(): number | null {
        return this.readyTimestamp;
    }

    /**
     * Reset readiness state (for testing or app restart scenarios)
     */
    public reset(): void {
        console.log('[CONTEXT_READINESS] Resetting context readiness state');
        this.isReady = false;
        this.readyTimestamp = null;
        this.readyCallbacks = [];
        this.readyPromise = new Promise<void>((resolve) => {
            this.resolveReady = resolve;
        });
    }

    /**
     * Signal native layer about context readiness
     * This could be enhanced to communicate with native modules
     */
    private signalNativeLayer(): void {
        try {
            // In a real implementation, this might call a native module
            // For now, we'll use a global flag that native code could check
            if (typeof global !== 'undefined') {
                (global as any).__REACT_CONTEXT_READY__ = true;
                (global as any).__REACT_CONTEXT_READY_TIMESTAMP__ = this.readyTimestamp;
            }

            // Log for native layer to see in logcat
            console.log('[CONTEXT_READINESS] Native layer notified: React context ready');
        } catch (error) {
            console.warn('[CONTEXT_READINESS] Failed to signal native layer:', error);
        }
    }
}

/**
 * Utility function to safely execute code after React context is ready
 */
export const executeWhenReady = async <T>(
    operation: () => Promise<T> | T,
    timeoutMs: number = 5000
): Promise<T> => {
    const manager = ContextReadinessManager.getInstance();

    // If already ready, execute immediately
    if (manager.isContextReady()) {
        return operation();
    }

    // Wait for readiness with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Context readiness timeout after ${timeoutMs}ms`));
        }, timeoutMs);
    });

    try {
        await Promise.race([manager.waitForReady(), timeoutPromise]);
        return operation();
    } catch (error) {
        console.warn('[CONTEXT_READINESS] Operation failed or timed out:', error);
        throw error;
    }
};

/**
 * Hook-like function for components to safely initialize after context is ready
 */
export const initializeAfterReady = (
    initFunction: () => void,
    dependencies: any[] = []
): void => {
    const manager = ContextReadinessManager.getInstance();

    // Use InteractionManager to ensure we don't block the UI
    InteractionManager.runAfterInteractions(() => {
        manager.onReady(() => {
            // Add a small delay to ensure everything is truly ready
            requestAnimationFrame(() => {
                initFunction();
            });
        });
    });
};

/**
 * Get the global context readiness manager instance
 */
export const getContextReadinessManager = (): ContextReadinessManager => {
    return ContextReadinessManager.getInstance();
};

/**
 * Helper to log timing information for diagnostics
 */
export const logContextReadinessTiming = (): void => {
    const manager = ContextReadinessManager.getInstance();
    const timestamp = manager.getReadyTimestamp();

    if (timestamp) {
        const initTime = timestamp - (global as any).__APP_START_TIME__ || 0;
        console.log(`[CONTEXT_READINESS] Context became ready ${initTime}ms after app start`);
    } else {
        console.log('[CONTEXT_READINESS] Context not yet ready');
    }
};
