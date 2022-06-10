import { Duration } from 'date-fns';
import format from 'date-fns/format';

export const formatTxTimestamp = (timestamp: number | Date) => format(timestamp, 'MMM d, yy | HH:mm');

export const toJSTimestamp = (timestamp: number) => timestamp * 1000;

export const formatShortDate = (date: Date | number) => format(date, 'MMM d, yyyy');
export const formatShortDateWithTime = (date: Date | number) => format(date, 'MMM d, yyyy | HH:mm');

export const formattedDuration = (
    duration: Duration,
    dateTimeTranslationMap: any,
    showSeconds = true,
    delimiter = ' ',
    firstTwo = false
) => {
    const formatted = [];
    if (duration.years) {
        return `${duration.years} ${
            duration.years > 1 ? dateTimeTranslationMap['years'] : dateTimeTranslationMap['year']
        }`;
    }
    if (duration.months) {
        return `${duration.months} ${
            duration.months > 1 ? dateTimeTranslationMap['months'] : dateTimeTranslationMap['month']
        }`;
    }
    if (duration.days) {
        if (duration.days === 1 && duration.hours === 0) {
            return `24 ${dateTimeTranslationMap['hours']}`;
        }

        return `${duration.days} ${
            duration.days > 1 ? dateTimeTranslationMap['days'] : dateTimeTranslationMap['day']
        } ${
            duration.hours
                ? `${duration.hours} ${
                      duration.hours > 1 ? dateTimeTranslationMap['hours'] : dateTimeTranslationMap['hour']
                  }`
                : ''
        }`;
    }
    if (duration.hours) {
        return `${duration.hours} ${
            duration.hours > 1 ? dateTimeTranslationMap['hours'] : dateTimeTranslationMap['hour']
        } ${
            duration.minutes
                ? `${duration.minutes} ${
                      duration.minutes > 1 ? dateTimeTranslationMap['minutes'] : dateTimeTranslationMap['minute']
                  }`
                : ''
        }`;
    }
    if (duration.minutes) {
        if (duration.minutes > 9 || !showSeconds) {
            return `${duration.minutes} ${
                duration.minutes > 1 ? dateTimeTranslationMap['minutes'] : dateTimeTranslationMap['minute']
            }`;
        }
        formatted.push(`${duration.minutes}${dateTimeTranslationMap['minutes-short']}`);
    }
    if (duration.seconds != null) {
        formatted.push(`${duration.seconds}${dateTimeTranslationMap['seconds-short']}`);
    }
    return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const formattedDurationFull = (
    duration: Duration,
    dateTimeTranslationMap: any,
    delimiter = ' ',
    firstTwo = false
) => {
    const formatted = [];
    formatted.push(`${duration.days}${dateTimeTranslationMap['days-short']}`);
    formatted.push(`${duration.hours}${dateTimeTranslationMap['hours-short']}`);
    formatted.push(`${duration.minutes}${dateTimeTranslationMap['minutes-short']}`);
    return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const convertUTCToLocalDate = (date: Date) => {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
    );
};

export const convertLocalToUTCDate = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
};

export const setDateTimeToUtcNoon = (date: Date) => {
    date.setUTCHours(12, 0, 0, 0);
    return date;
};

export const formatShareDateWithTime = (date: Date | number) => format(date, 'yyyy-MM-dd_HH_mm_ss');
