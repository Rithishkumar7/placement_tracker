const { differenceInDays, differenceInCalendarDays } = require('date-fns');

const startDate = new Date('2026-07-01');
const todayUTC = new Date('2026-07-16T18:32:33.000Z'); // 00:02 IST on July 17th

console.log('diff UTC:', differenceInDays(todayUTC, startDate) + 1);
console.log('diff Calendar:', differenceInCalendarDays(todayUTC, startDate) + 1);
