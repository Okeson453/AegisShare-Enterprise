export async function encryptAesGcm(
    plaintext: Uint8Array,
    dek: CryptoKey
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array; authTag: Uint8Array }> {
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        dek,
        plaintext as BufferSource
    )

    const view = new DataView(encrypted)
    const ciphertext = new Uint8Array(encrypted, 0, encrypted.byteLength - 16)
    const authTag = new Uint8Array(encrypted, encrypted.byteLength - 16)

    return { ciphertext, iv, authTag }
}

export async function decryptAesGcm(
    ciphertext: Uint8Array,
    iv: Uint8Array,
    authTag: Uint8Array,
    dek: CryptoKey
): Promise<Uint8Array> {
    const data = new Uint8Array(ciphertext.length + authTag.length)
    data.set(ciphertext)
    data.set(authTag, ciphertext.length)

    const plaintext = await crypto.subtle.decrypt(
        // @ts-ignore - Uint8Array buffer type compatibility issue with crypto.subtle
        { name: 'AES-GCM', iv },
        dek,
        data as BufferSource
    )

    return new Uint8Array(plaintext)
}
