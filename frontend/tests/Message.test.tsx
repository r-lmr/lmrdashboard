import React from 'react';
import renderer from 'react-test-renderer';
import { expect } from '@jest/globals';

import Message from '../components/Message';
import { FormatUtils } from '../util/FormatUtils';
import { link } from 'fs';

test('message without links does not have special formatting', () => {
  const linkSpy = jest.spyOn(FormatUtils, 'formatLink');
  const boldSpy = jest.spyOn(FormatUtils, 'formatBold');

  const component = renderer.create(
    <Message
      nick={'Linus'}
      message={'This is a message without links.'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(linkSpy).toHaveBeenCalledTimes(0);
  expect(boldSpy).toHaveBeenCalledTimes(0);
  expect(tree).toMatchSnapshot();
});

test('message that contains an "r" but no links does not trigger link rendering', () => {
  const spy = jest.spyOn(FormatUtils, 'formatLink');

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
  const spy = jest.spyOn(FormatUtils, 'formatLink');

  const component = renderer.create(
    <Message
      nick={'RMS'}
      message={'This is a message with: http://reddit.com, also https://reddit.com/r/linuxmasterrace'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});

test('message with subreddits has them rendered as links', () => {
  const spy = jest.spyOn(FormatUtils, 'formatLink');

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
  const spy = jest.spyOn(FormatUtils, 'formatLink');
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

test('message with asterisks has bold formatting', () => {
  const spy = jest.spyOn(FormatUtils, 'formatBold');
  const component = renderer.create(
    <Message
      nick={'BoldMoveCotton'}
      message={'This is a *message* with asterisk *bolded* words, *right*?'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(spy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});


test('message with asterisks and links has both formatting', () => {
  const linkSpy = jest.spyOn(FormatUtils, 'formatLink');
  const boldSpy = jest.spyOn(FormatUtils, 'formatBold');

  const component = renderer.create(
    <Message
      nick={'BoldMoveCotton'}
      message={'This is a message with asterisk *bolded* words and links: https://reddit.com'}
      dateCreated={'2021-01-01'}
    />
  );

  const tree = component.toJSON();
  expect(linkSpy).toHaveBeenCalled();
  expect(boldSpy).toHaveBeenCalled();
  expect(tree).toMatchSnapshot();
});
