import React from 'react';

// Simple JSX smoke test to assert Babel automatic runtime is working
const Foo: React.FC = () => <></>;

describe('Babel JSX automatic runtime smoke', () => {
  it('creates a JSX element without duplicate __self transform errors', () => {
    const element = <Foo />;
    expect(element).toBeTruthy();
  });
});
