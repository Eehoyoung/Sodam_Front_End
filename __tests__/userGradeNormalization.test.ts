import { normalizeUserGrade } from '../src/features/auth/utils/grade';

describe('normalizeUserGrade', () => {
  test('maps ROLE_* values correctly', () => {
    expect(normalizeUserGrade('ROLE_MASTER')).toBe('MASTER');
    expect(normalizeUserGrade('ROLE_EMPLOYEE')).toBe('EMPLOYEE');
    expect(normalizeUserGrade('ROLE_USER')).toBe('NORMAL');
  });

  test('maps plain values correctly', () => {
    expect(normalizeUserGrade('MASTER')).toBe('MASTER');
    expect(normalizeUserGrade('EMPLOYEE')).toBe('EMPLOYEE');
    expect(normalizeUserGrade('NORMAL')).toBe('NORMAL');
  });

  test('handles Personal/USER synonyms', () => {
    expect(normalizeUserGrade('Personal')).toBe('NORMAL');
    expect(normalizeUserGrade('USER')).toBe('NORMAL');
  });

  test('fallbacks unknown to NORMAL', () => {
    expect(normalizeUserGrade('SOMETHING_ELSE')).toBe('NORMAL');
    expect(normalizeUserGrade(undefined)).toBe('NORMAL');
    expect(normalizeUserGrade(null as any)).toBe('NORMAL');
  });
});
