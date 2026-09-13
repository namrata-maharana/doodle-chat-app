export function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate)

  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })

  return `${datePart} ${timePart}`
}
