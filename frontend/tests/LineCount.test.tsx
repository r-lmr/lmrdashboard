import React from 'react';
import renderer from 'react-test-renderer';
import { expect } from '@jest/globals';
import LineCount from '../components/LineCount';

test('LineCount Component has 50% bot messages', () => {
  const component = renderer.create(
    <LineCount
      key={'key'}
      lineCount={24}
      botLines={12}
      date={'2021-01-01'}
      message={'foo'}
    />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('LineCount Component has 100% bot messages', () => {
  const component = renderer.create(
    <LineCount
      key={'key'}
      lineCount={24}
      botLines={24}
      date={'2021-01-01'}
      message={'foo'}
    />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
