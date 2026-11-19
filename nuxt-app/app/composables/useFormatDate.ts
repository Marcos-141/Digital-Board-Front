import { formatDateToColombian } from '~/utils/date'

export function useFormatDate() {
  function formatDate(dateStr: string | null | undefined): string {
    return formatDateToColombian(dateStr)
  }

  return {
    formatDate,
  }
}
