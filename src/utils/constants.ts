export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'

export const CRYPTO_PARAMS = {
    AES_KEY_LENGTH: 256,
    ARGON2_MEMORY: 65536, // 64MB
    ARGON2_TIME: 3,
    ARGON2_PARALLELISM: 4,
    IV_LENGTH: 12,
    AUTH_TAG_LENGTH: 128,
    SALT_LENGTH: 16,
}

export const ALLOWED_REGIONS = ['eu-west-1', 'us-east-1', 'asia-southeast-1']

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',
    VAULT: '/vault',
    COMPLIANCE: '/compliance',
    POLICY: '/policy',
    AUDIT: '/audit',
    THREAT: '/threat',
    KEYS: '/keys',
    ACCESS: '/access',
    SETTINGS: '/settings',
}

export const HTTP_STATUS = {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
}
