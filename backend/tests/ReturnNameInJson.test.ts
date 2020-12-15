import { returnNameInJsonFile } from '../ReturnNameInJsonFile';

jest.mock('fs');  // Required since fs is a core Node module

describe('index', () => {

  const MOCK_FILE_INFO = { 'test.json': JSON.stringify({ name: 'myname' }) };

  beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  it('returnNameInJsonFile', () => {
    const name: string = returnNameInJsonFile('test.json');
    expect(name).toBe('myname'); // 1.0.0 is installed and 2.0.0 is available
  });
});
