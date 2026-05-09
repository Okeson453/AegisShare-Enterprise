import { box, randomBytes } from 'tweetnacl'

export function generateEciesKeyPair() {
    return box.keyPair()
}

export async function wrapDekEcies(
    dek: Uint8Array,
    recipientPublicKey: Uint8Array
): Promise<Uint8Array> {
    const ephemeralKeyPair = box.keyPair()
    const nonce = randomBytes(box.nonceLength)

    const encrypted = box(dek, nonce, recipientPublicKey, ephemeralKeyPair.secretKey)

    const wrapped = new Uint8Array(
        ephemeralKeyPair.publicKey.length + nonce.length + encrypted.length
    )
    wrapped.set(ephemeralKeyPair.publicKey)
    wrapped.set(nonce, ephemeralKeyPair.publicKey.length)
    wrapped.set(encrypted, ephemeralKeyPair.publicKey.length + nonce.length)

    return wrapped
}

export async function unwrapDekEcies(
    wrapped: Uint8Array,
    recipientPrivateKey: Uint8Array
): Promise<Uint8Array> {
    const ephemeralPublicKey = wrapped.slice(0, 32)
    const nonce = wrapped.slice(32, 32 + box.nonceLength)
    const encrypted = wrapped.slice(32 + box.nonceLength)

    const dek = box.open(encrypted, nonce, ephemeralPublicKey, recipientPrivateKey)
    if (!dek) throw new Error('Failed to decrypt DEK')

    return dek
}
