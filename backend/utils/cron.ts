/**
 * A poor man's cron
 * https://stackoverflow.com/a/50386867/4644044
 * @param time Hour and minute in the format of hh:mm
 * @param triggerThis callback function
 */
export function scheduleDailyEvent(time: string | undefined, triggerThis: () => void) {
  if (time === undefined || !time.match(/^\d\d:\d\d$/)) {
    console.warn('Please specify a time string in the format of hh:mm');
    return;
  }
  // get hour and minute from hour:minute param received, ex.: '16:00'
  const hour = Number(time.split(':')[0]);
  const minute = Number(time.split(':')[1]);

  // create a Date object at the desired timepoint
  const startTime = new Date();
  startTime.setHours(hour, minute);
  const now = new Date();

  // increase timepoint by 24 hours if in the past
  if (startTime.getTime() < now.getTime()) {
    startTime.setHours(startTime.getHours() + 24);
  }

  // get the interval in ms from now to the timepoint when to trigger the alarm
  const firstTriggerAfterMs = startTime.getTime() - now.getTime();

  // trigger the function triggerThis() at the timepoint
  // create setInterval when the timepoint is reached to trigger it every day at this timepoint
  setTimeout(function () {
    triggerThis();
    setInterval(triggerThis, 24 * 60 * 60 * 1000);
  }, firstTriggerAfterMs);
}
