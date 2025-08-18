// Theme color tokens (safe, no side effects)
// Keep minimal and tree-shakeable; avoid Platform or native calls here.

export const colors = {
  // Base
  background: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#666666',
  textTertiary: '#444444',

  // Brand
  brandPrimary: '#4F46E5', // indigo-600
  brandSecondary: '#6366F1', // indigo-500

  // Status
  success: '#16A34A', // green-600
  warning: '#F59E0B', // amber-500
  error: '#DC2626',   // red-600
  info: '#0EA5E9',    // sky-500

  // UI
  border: '#E5E7EB',
  muted: '#F3F4F6',
};

export type Colors = typeof colors;
export default colors;
