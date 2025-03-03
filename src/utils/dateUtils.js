// src/utils/dateUtils.js
import { CalendarDate } from '@internationalized/date'

export const parseToCalendarDate = (isoDateString) => {
  if (!isoDateString) return null
  const [year, month, day] = isoDateString.split('T')[0].split('-')
  return new CalendarDate(Number(year), Number(month), Number(day))
}

export const formatDateForBackend = (calendarDate) => {
  if (!calendarDate) return null
  const year = calendarDate.year
  const month = String(calendarDate.month).padStart(2, '0')
  const day = String(calendarDate.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}
