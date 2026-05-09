export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: ApiError
    timestamp: string
}

export interface ApiError {
    code: string
    message: string
    details?: object
}

export interface Paginated<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

export interface RequestConfig {
    headers?: Record<string, string>
    params?: Record<string, any>
    timeout?: number
}
