import {
  formatDuration as _formatDuration,
  defaultDurationFormat,
  differenceInSeconds,
  Duration,
  eachMinuteOfInterval,
  FormatDurationOptions,
  Interval,
  intervalToDuration,
} from "date-fns";

export const formatDuration = (
  duration: Duration,
  options?: FormatDurationOptions,
) => {
  const {
    format = defaultDurationFormat,
    delimiter = " ",
    zero,
  } = options ?? {};

  const durationSegments = format.reduce((acc, format) => {
    const formatted = _formatDuration(duration, {
      ...options,
      zero: zero || format === "seconds",
      format: [format],
    });

    if (!!formatted) {
      acc.push(formatted.replace(/\s+/, " "));
    }

    return acc;
  }, [] as string[]);

  const lastElement = durationSegments.pop();

  if (!lastElement) return durationSegments.join(delimiter);
  if (durationSegments.length === 0) return lastElement;

  return durationSegments.join(delimiter) + " i " + lastElement;
};

export const formatDurationFromInterval = (
  interval: Interval,
  options?: FormatDurationOptions,
) => {
  const duration = intervalToDuration(interval);
  if (differenceInSeconds(interval.end, interval.start) < 60) {
    duration.seconds = duration.seconds ?? 0;
  }

  return formatDuration(duration, {
    ...options,
    delimiter: options?.delimiter ? options.delimiter : ", ",
  });
};
