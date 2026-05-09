export function truncateHash(hash: string, length: number = 8): string {
    if (hash.length <= length * 2) return hash
    return hash.slice(0, length) + '...' + hash.slice(-length)
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
        (acc, item) => {
            const groupKey = String(item[key])
            if (!acc[groupKey]) acc[groupKey] = []
            acc[groupKey].push(item)
            return acc
        },
        {} as Record<string, T[]>
    )
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return function executedFunction(...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
