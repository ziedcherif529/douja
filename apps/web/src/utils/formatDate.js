import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};