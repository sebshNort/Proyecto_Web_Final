//Para evitar un bug que hace que la fecha sea mayor a la fecha del cierre

export const formatearFecha = (f) =>
  f
    ? new Date(f).toLocaleString('en-GB', { timeZone: 'UTC', hourCycle: 'h23' }) + ' UTC'
    : '-';