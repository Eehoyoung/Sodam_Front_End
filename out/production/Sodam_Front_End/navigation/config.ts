// Navigation feature flags and recovery toggles
// Restoring stability: keep StackView disabled until RNGestureHandler native module is available.

export const ENABLE_STACK_NAV: boolean = true; // Enable StackView for staged validation

// Some builds currently lack react-native-screens native module.
// To avoid console errors, gate enableScreens() behind this explicit flag.
export const ENABLE_SCREENS_NATIVE: boolean = true; // set true after native rebuild/validation

// Stage index for stepwise reintroduction logging (0..20)
export const STACK_RECOVERY_STAGE: number = 20; // 0: disabled, 1..20: iteration steps

// Helper to check if we reached a given iteration stage
export const stageAtLeast = (n: number): boolean => {
  try {
    return (STACK_RECOVERY_STAGE ?? 0) >= n;
  } catch {
    return false;
  }
};
