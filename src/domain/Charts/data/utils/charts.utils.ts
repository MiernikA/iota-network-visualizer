import { formatIota } from "../../../../shared/utils/formatters";

export function computeMedian(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
  }

  return sorted[middleIndex];
}

export function formatFeeValue(value: number) {
  return value <= 0 ? "0 IOTA" : `${formatIota(value, 6)} IOTA`;
}

export function formatHistoryWindow(durationMs: number) {
  const totalSeconds = Math.max(Math.round(durationMs / 1000), 0);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = totalSeconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(minutes >= 10 ? 0 : 1)} min`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(hours >= 10 ? 0 : 1)} h`;
  }

  const days = hours / 24;
  return `${days.toFixed(days >= 10 ? 0 : 1)} d`;
}

export function movingAverage(values: number[], windowSize: number) {
  if (values.length === 0 || windowSize <= 0) {
    return [];
  }

  const averages: number[] = [];
  let rollingSum = 0;

  values.forEach((value, index) => {
    rollingSum += value;

    if (index >= windowSize) {
      rollingSum -= values[index - windowSize];
    }

    const sampleSize = Math.min(index + 1, windowSize);
    averages.push(rollingSum / sampleSize);
  });

  return averages;
}

