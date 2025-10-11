import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import SectionCard from '../../src/common/components/sections/SectionCard';
import SectionHeader from '../../src/common/components/sections/SectionHeader';
import PrimaryButton from '../../src/common/components/buttons/PrimaryButton';

describe('UI Section Components', () => {
  test('SectionCard renders children', () => {
    const tree = ReactTestRenderer.create(
      <SectionCard testID="card">
        <></>
      </SectionCard>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  test('SectionHeader renders title and action', () => {
    const onPress = jest.fn();
    const renderer = ReactTestRenderer.create(
      <SectionHeader title="정부 지원 정책" actionLabel="더보기" onPressAction={onPress} testID="hdr" />
    );
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  test('PrimaryButton triggers onPress', () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(
        <PrimaryButton title="확인" onPress={onPress} testID="btn" />
      );
    });
    const root = (renderer as any).root;
    const btn = root.findByProps({ testID: 'btn' });
    act(() => btn.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
