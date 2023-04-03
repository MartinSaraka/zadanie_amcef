import moment from 'moment'

export function useFormatDate (date: Date | undefined): string {
  // const date = new Date(Date.parse(isoString));
  if (!date) {
    return 'Invalid Date'
  } else {
    return moment(date).format('DD.MM.YYYY HH:mm:ss')
  }
}
export function useFormatDateByFormatString (
  date: Date | undefined,
  format: string
): string {
  // const date = new Date(Date.parse(isoString));
  if (!date) {
    return 'Pick Date'
  } else {
    return moment(date).format(format)
  }
}
