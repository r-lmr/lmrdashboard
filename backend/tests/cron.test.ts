import { scheduleDailyEvent } from "../utils/cron";

describe('cron scheduling daily events (only the first trigger is checked)', () => {
  /**
   * @returns a string in the format of hh:mm, as needed by scheduleDailyEvent
   */
  function getTimeString(date: Date): string {
    const hours = date.getHours();
    const hoursString = ('0' + hours).slice(-2);
    const minutes = date.getMinutes();
    const minutesString = ('0' + minutes).slice(-2);
    return `${hoursString}:${minutesString}`
  }

  test('trigger function is called at the specified time and day', async () => {
    const mockCallback = jest.fn(() => console.log('callback called'));

    const date = new Date();
    console.log('getTimeString(date)', getTimeString(date))
    scheduleDailyEvent(
      getTimeString(date),
      mockCallback,
      date.getDay());

    await new Promise((r) => setTimeout(r, 1000));
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('trigger function is not called if the day is wrong', async () => {
    const mockCallback = jest.fn(() => console.log('callback called'));

    const date = new Date();
    scheduleDailyEvent(
      getTimeString(date),
      mockCallback,
      date.getDay() + 1);

    await new Promise((r) => setTimeout(r, 1000));
    expect(mockCallback.mock.calls.length).toBe(0);
  });
});
