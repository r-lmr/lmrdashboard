import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { LogWrapper } from '../utils/logging/LogWrapper';

describe('logging examples', () => {
  const log = new LogWrapper(module.id);
  const levels = ['error', 'warn', 'info', 'debug'];
  /**
   * Necessary to differentiate log messages from other tests that run
   */
  let nonce: string;

  const getLogAsJson = (logName: string) => {
    return fs
      .readFileSync(path.join('logs', `lmrd-${logName}.log`), 'utf8')
      .split('\n')
      .filter((it) => it)
      .map((it) => JSON.parse(it));
  };

  const findByAttribute = (array: Record<string, unknown>[], value: string, attr?: string) => {
    const attribute = attr || 'message';
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][attribute] === value) {
        return i;
      }
    }
    return -1;
  };

  beforeEach(() => {
    nonce = uuidv4();
  });

  test('logging with different levels', async () => {
    log.error(`message for error ${nonce}`);
    log.warn(`message for warn ${nonce}`);
    log.info(`message for info ${nonce}`);
    log.debug(`message for debug ${nonce}`);

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const combinedLogs = getLogAsJson('combined');
    const indexOfFirstLog = findByAttribute(combinedLogs, `message for error ${nonce}`);
    const combinedLogsFiltered = combinedLogs.slice(indexOfFirstLog, indexOfFirstLog + 4);

    const errorLogs = getLogAsJson('error');
    const indexOfFirstErrorLog = findByAttribute(errorLogs, `message for error ${nonce}`);
    const errorLogsFiltered = errorLogs.slice(indexOfFirstErrorLog, indexOfFirstErrorLog + 1);

    levels.forEach((level, idx) => {
      expect(combinedLogsFiltered[idx]['level']).toBe(level);
      expect(combinedLogsFiltered[idx]['message']).toBe(`message for ${level} ${nonce}`);
    });

    expect(errorLogsFiltered[0]['level']).toBe('error');
    expect(errorLogsFiltered[0]['message']).toBe(`message for error ${nonce}`);
  });

  test('logging with additional properties', async () => {
    const msg = `message with additional properties ${nonce}`;
    const additionalProps = { foo: 'bar' };
    log.info(msg, additionalProps);

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const combinedLogs = getLogAsJson('combined');
    const indexOfFirstLog = findByAttribute(combinedLogs, msg);
    const combinedLogsFiltered = combinedLogs.slice(indexOfFirstLog, indexOfFirstLog + 1);

    expect(combinedLogsFiltered[0]['level']).toBe('info');
    expect(combinedLogsFiltered[0]['message']).toBe(msg);
    expect(combinedLogsFiltered[0]['additionalProperties']).toStrictEqual(additionalProps);
  });

  test('logging a message and error at once', async () => {
    const msg = `some message ${nonce}`;
    const error = new Error('some error');
    log.error(msg, error);

    // Need to wait for files to be written
    await new Promise((r) => setTimeout(r, 1000));

    const errorLogs = getLogAsJson('error');
    const indexOfFirstErrorLog = findByAttribute(errorLogs, `${msg} ${error.message}`);
    const errorLogsFiltered = errorLogs.slice(indexOfFirstErrorLog, indexOfFirstErrorLog + 1);

    expect(errorLogsFiltered[0]['level']).toBe('error');
    expect(errorLogsFiltered[0]['message']).toBe(`${msg} ${error.message}`);
    expect(errorLogsFiltered[0]['stack']).not.toBeNull();
  });
});
