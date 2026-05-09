export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export function isStrongPassword(password: string): boolean {
    return (
        password.length >= 12 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password)
    )
}

export function isValidPolicyId(id: string): boolean {
    return /^[A-Z0-9_-]+$/.test(id)
}

export function isValidFileType(type: string): boolean {
    const allowed = ['PDF', 'XLS', 'DOC', 'ZIP', 'DOCX', 'XLSX', 'JSON', 'TXT']
    return allowed.includes(type.toUpperCase())
}
