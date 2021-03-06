import React from 'react';
import renderer from 'react-test-renderer';
import { expect } from '@jest/globals';

import Message from '../components/Message';
import { LinkUtils } from '../util/LinkUtils';

test('message without links does not have links rendered', () => {
  const spy = jest.spyOn(LinkUtils, 'formatLink');

  const component = renderer.create(
    <Message
      nick={'Linus'}
      message={'This is a message without links.'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalledTimes(0);
  expect(tree).toMatchSnapshot();
});

test('message that contains an "r" but no links does not trigger link rendering', () => {
  const spy = jest.spyOn(LinkUtils, 'formatLink');

  const component = renderer.create(
    <Message
      nick={'Linus'}
      message={'This is a message without links, but it has an r.'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalledTimes(0);
  expect(tree).toMatchSnapshot();
});

test('message with URLs has links rendered', () => {
  const spy = jest.spyOn(LinkUtils, 'formatLink');

  const component = renderer.create(
    <Message
      nick={'RMS'}
      message={'This is a message with: https://reddit.com, also https://reddit.com/r/linuxmasterrace'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});

test('message with subreddits has them rendered as links', () => {
  const spy = jest.spyOn(LinkUtils, 'formatLink');

  const component = renderer.create(
    <Message
      nick={'Gnu'}
      message={'This is a message with: r/linuxmasterrace, also /r/linux'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});

test('message with mixed link types has them rendered', () => {
  const spy = jest.spyOn(LinkUtils, 'formatLink');
  const component = renderer.create(
    <Message
      nick={'Gnu'}
      message={'This is a message with: r/linuxmasterrace, which links to https://reddit.com/r/linuxmasterrace.'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});
