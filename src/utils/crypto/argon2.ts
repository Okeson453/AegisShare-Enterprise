import { argon2id } from 'argon2-browser'

export async function deriveKeyArgon2(
    password: string,
    salt: Uint8Array
): Promise<Uint8Array> {
    const result = await argon2id({
        pass: password,
        salt: salt,
        mem: 64 * 1024, // 64MB
        time: 3,
        parallelism: 4,
        hashLen: 32,
        type: argon2id.ArgonType.Argon2id,
    })

    return new Uint8Array(result.hash)
}
