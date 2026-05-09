import { expect, it, describe } from 'vitest'
import {
    isValidEmail,
    isStrongPassword,
    isValidPolicyId,
} from '@/utils/validators'

describe('Validators', () => {
    it('validates email correctly', () => {
        expect(isValidEmail('test@example.com')).toBe(true)
        expect(isValidEmail('invalid-email')).toBe(false)
    })

    it('validates password strength', () => {
        expect(isStrongPassword('WeakPass123')).toBe(false)
        expect(isStrongPassword('StrongPass123!@#')).toBe(true)
    })

    it('validates policy ID', () => {
        expect(isValidPolicyId('POLICY_001')).toBe(true)
        expect(isValidPolicyId('invalid-policy-001')).toBe(false)
    })
})
