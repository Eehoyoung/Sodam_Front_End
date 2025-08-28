import { stageAtLeast, STACK_RECOVERY_STAGE } from '../../navigation/config';

describe('navigation/config', () => {
  test('stageAtLeast respects STACK_RECOVERY_STAGE', () => {
    expect(STACK_RECOVERY_STAGE).toBeGreaterThanOrEqual(0);
    expect(stageAtLeast(1)).toBe(true);
    expect(stageAtLeast(20)).toBe(true);
    expect(stageAtLeast(STACK_RECOVERY_STAGE + 1)).toBe(false);
  });
});
