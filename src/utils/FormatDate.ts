export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString)

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }) // Saturday
  const month = date.toLocaleDateString('en-US', { month: 'long' })     // June
  const day = date.getDate().toString()                                 // 14
  const year = date.getFullYear()                                       // 2025

  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) // 09:39

  return `${weekday}, ${month} ${day} ${year}. ${time}`
}
