/**
 * JSI-Safe Animation Components
 * Standardized animation component templates for React Native Reanimated 3
 * Prevents JSI assertion failures by using proper worklet patterns
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useJSISafeDimensions } from '../../../hooks/useJSISafeDimensions';

// Common animation configuration types
export interface AnimationConfig {
  duration?: number;
  easing?: any; // Allow flexible easing function types
  delay?: number;
}

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  delay?: number;
}

export interface FadeAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  config?: AnimationConfig;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export interface ScaleAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  config?: SpringConfig;
  style?: ViewStyle;
  fromScale?: number;
  toScale?: number;
  onAnimationComplete?: () => void;
}

export interface ProgressAnimationProps {
  children: React.ReactNode;
  progress: number;
  config?: AnimationConfig;
  style?: ViewStyle;
  onProgressComplete?: () => void;
}

export interface PulseAnimationProps {
  children: React.ReactNode;
  isActive: boolean;
  config?: {
    minScale?: number;
    maxScale?: number;
    duration?: number;
  };
  style?: ViewStyle;
}

export interface NumberCountAnimationProps {
  targetValue: number;
  startValue?: number;
  config?: AnimationConfig;
  formatter?: (value: number) => string;
  onCountComplete?: (finalValue: number) => void;
}

/**
 * JSI-Safe Fade Animation Component
 * Provides smooth fade in/out animations with proper cleanup
 */
export const FadeAnimation: React.FC<FadeAnimationProps> = ({
  children,
  isVisible,
  config = {},
  style,
  onAnimationComplete,
}) => {
  const fadeAnim = useSharedValue(isVisible ? 1 : 0);

  const {
    duration = 300,
    easing = Easing.out(Easing.cubic),
    delay = 0,
  } = config;

  useEffect(() => {
    const targetValue = isVisible ? 1 : 0;

    fadeAnim.value = withTiming(
      targetValue,
      {
        duration,
        easing,
      },
      (finished) => {
        'worklet';
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }
    );
  }, [isVisible, duration, easing, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * JSI-Safe Scale Animation Component
 * Provides smooth scale animations with spring physics
 */
export const ScaleAnimation: React.FC<ScaleAnimationProps> = ({
  children,
  isVisible,
  config = {},
  style,
  fromScale = 0.8,
  toScale = 1,
  onAnimationComplete,
}) => {
  const scaleAnim = useSharedValue(isVisible ? toScale : fromScale);

  const {
    damping = 15,
    stiffness = 150,
    delay = 0,
  } = config;

  useEffect(() => {
    const targetValue = isVisible ? toScale : fromScale;

    scaleAnim.value = withSpring(
      targetValue,
      {
        damping,
        stiffness,
      },
      (finished) => {
        'worklet';
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }
    );
  }, [isVisible, damping, stiffness, fromScale, toScale, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * JSI-Safe Progress Animation Component
 * Provides smooth progress bar animations
 */
export const ProgressAnimation: React.FC<ProgressAnimationProps> = ({
  children,
  progress,
  config = {},
  style,
  onProgressComplete,
}) => {
  console.log('[DEBUG_LOG] ProgressAnimation: Component initialization started');
  console.log('[DEBUG_LOG] ProgressAnimation: Props received:', { progress });

  // Use JSI-safe dimensions hook
  console.log('[DEBUG_LOG] ProgressAnimation: About to call useJSISafeDimensions hook');
  let dimensions;
  try {
    const hookResult = useJSISafeDimensions();
    dimensions = hookResult.dimensions;
    console.log('[DEBUG_LOG] ProgressAnimation: useJSISafeDimensions hook called successfully');
    console.log('[DEBUG_LOG] ProgressAnimation: Received dimensions:', dimensions);
    console.log('[DEBUG_LOG] ProgressAnimation: Full hook result:', hookResult);
  } catch (error) {
    console.error('[DEBUG_LOG] ProgressAnimation: ERROR calling useJSISafeDimensions:', error);
    if (error instanceof Error) {
      console.error('[DEBUG_LOG] ProgressAnimation: Error stack:', error.stack);
    }
    throw error;
  }

  const progressAnim = useSharedValue(0);

  const {
    duration = 2000,
    easing = Easing.out(Easing.quad),
    delay = 0,
  } = config;

  useEffect(() => {
    progressAnim.value = withTiming(
      progress,
      {
        duration,
        easing,
      },
      (finished) => {
        'worklet';
        if (finished && progress >= 1 && onProgressComplete) {
          runOnJS(onProgressComplete)();
        }
      }
    );
  }, [progress, duration, easing, onProgressComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progressAnim.value,
      [0, 1],
      [0, dimensions.screenWidth * 0.8]
    );

    return {
      width,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * JSI-Safe Pulse Animation Component
 * Provides continuous pulse animations with proper cleanup
 */
export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  isActive,
  config = {},
  style,
}) => {
  const pulseAnim = useSharedValue(1);

  const {
    minScale = 1,
    maxScale = 1.1,
    duration = 500,
  } = config;

  useEffect(() => {
    if (isActive) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(maxScale, {
            duration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(minScale, {
            duration,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1, // infinite
        true // reverse
      );
    } else {
      pulseAnim.value = withTiming(minScale, {
        duration: duration / 2,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isActive, minScale, maxScale, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * JSI-Safe Number Count Animation Component
 * Provides smooth number counting animations
 */
export const NumberCountAnimation: React.FC<NumberCountAnimationProps> = ({
  targetValue,
  startValue = 0,
  config = {},
  formatter = (value) => Math.round(value).toString(),
  onCountComplete,
}) => {
  const countAnim = useSharedValue(startValue);

  const {
    duration = 1500,
    easing = Easing.out(Easing.cubic),
    delay = 0,
  } = config;

  useEffect(() => {
    countAnim.value = withTiming(
      targetValue,
      {
        duration,
        easing,
      },
      (finished) => {
        'worklet';
        if (finished && onCountComplete) {
          runOnJS(onCountComplete)(targetValue);
        }
      }
    );
  }, [targetValue, duration, easing, onCountComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentValue = countAnim.value;
    return {
      // This will be handled by the text component that uses this
    };
  });

  return (
    <Animated.Text style={animatedStyle}>
      {formatter(countAnim.value)}
    </Animated.Text>
  );
};

/**
 * Combined Animation Component
 * Combines multiple animations for complex entrance effects
 */
export interface CombinedAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  fadeConfig?: AnimationConfig;
  scaleConfig?: SpringConfig;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const CombinedAnimation: React.FC<CombinedAnimationProps> = ({
  children,
  isVisible,
  fadeConfig = {},
  scaleConfig = {},
  style,
  onAnimationComplete,
}) => {
  return (
    <FadeAnimation
      isVisible={isVisible}
      config={fadeConfig}
      onAnimationComplete={onAnimationComplete}
    >
      <ScaleAnimation
        isVisible={isVisible}
        config={scaleConfig}
        style={style}
      >
        {children}
      </ScaleAnimation>
    </FadeAnimation>
  );
};

// Export all animation components
export default {
  FadeAnimation,
  ScaleAnimation,
  ProgressAnimation,
  PulseAnimation,
  NumberCountAnimation,
  CombinedAnimation,
};
