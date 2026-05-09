export function toBase64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
}

export function fromBase64(str: string): Uint8Array {
    const binary = atob(str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

export function toBase64Url(buffer: Uint8Array): string {
    return toBase64(buffer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function fromBase64Url(str: string): Uint8Array {
    const padded = str + '='.repeat((4 - (str.length % 4)) % 4)
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
    return fromBase64(base64)
}
