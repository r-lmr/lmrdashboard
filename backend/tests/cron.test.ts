import { scheduleDailyEvent } from "../utils/cron";

describe('cron scheduling daily events (only the first trigger is checked)', () => {
  test('trigger function is called at the specified time and day', async () => {
    const mockCallback = jest.fn(() => console.log('callback called'));

    const date = new Date();
    scheduleDailyEvent(
      `${date.getHours()}:${date.getMinutes()}`,
      mockCallback,
      date.getDay());

    await new Promise((r) => setTimeout(r, 1000));
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('trigger function is not called if the day is wrong', async () => {
    const mockCallback = jest.fn(() => console.log('callback called'));

    const date = new Date();
    scheduleDailyEvent(
      `${date.getHours()}:${date.getMinutes()}`,
      mockCallback,
      date.getDay() + 1);

    await new Promise((r) => setTimeout(r, 1000));
    expect(mockCallback.mock.calls.length).toBe(0);
  });
});
