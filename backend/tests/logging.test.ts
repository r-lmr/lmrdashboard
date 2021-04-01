import fs from 'fs';
import path from 'path';
import { LogWrapper } from '../utils/logging/LogWrapper';

describe('logging examples', () => {
  const log = new LogWrapper(module.id);
  const levels = ['error', 'warn', 'info', 'debug'];

  const getLogAsJson = (logName: string): any[] => {
    return fs.readFileSync(path.join('logs', `lmrd-${logName}.log`), 'utf8').split('\n')
      .filter(it => it)
      .map(it => JSON.parse(it));

  }

  test('logging with different levels', async () => {
    log.error('message for error');
    log.warn('message for warn');
    log.info('message for info');
    log.debug('message for debug');

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const combinedLogs = getLogAsJson('combined').slice(-4);
    const errorLogs = getLogAsJson('error').slice(-1);

    levels.forEach((level, idx) => {
      expect(combinedLogs[idx]['level']).toBe(level);
      expect(combinedLogs[idx]['message']).toBe(`message for ${level}`);
    })

    expect(errorLogs[0]['level']).toBe('error');
    expect(errorLogs[0]['message']).toBe('message for error');
  });

  test('logging with additional properties', async () => {
    const msg = 'message with additional properties';
    const additionalProps = { foo: 'bar' }
    log.info(msg, additionalProps);

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const combinedLogs = getLogAsJson('combined').slice(-1);
    expect(combinedLogs[0]['level']).toBe('info');
    expect(combinedLogs[0]['message']).toBe(msg);
    expect(combinedLogs[0]['additionalProperties']).toStrictEqual(additionalProps);
  });

  test('logging a message and error at once', async () => {
    const msg = 'some message';
    const error = new Error('some error');
    log.error(msg, error);

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const errorLogs = getLogAsJson('error').slice(-1);
    expect(errorLogs[0]['level']).toBe('error');
    expect(errorLogs[0]['message']).toBe(`${msg} ${error.message}`);
    expect(errorLogs[0]['stack']).not.toBeNull();
  });
});
