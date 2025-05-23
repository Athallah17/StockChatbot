export function getAccessToken() {
    const token = localStorage.getItem('accessToken')
    const timestamp = localStorage.getItem('tokenTimestamp')

    if (!token || !timestamp) return null

    const now = Date.now()
    const elapsed = now - parseInt(timestamp, 10)
    const thirtyMinutes = 30 * 60 * 1000

    if (elapsed > thirtyMinutes) {
        localStorage.clear()
        return null
    }

    return token
}
