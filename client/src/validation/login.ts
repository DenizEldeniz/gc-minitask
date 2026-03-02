export type LoginFormData = {
    email: string
    password: string
}

export type LoginValidationResult = {
    valid: boolean
    errors: Partial<Record<keyof LoginFormData, string>>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(data: LoginFormData): LoginValidationResult {
    const errors: Partial<Record<keyof LoginFormData, string>> = {}

    const trimmedEmail = data.email.trim()
    if (!trimmedEmail) {
        errors.email = 'E-posta gerekli'
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!data.password) {
        errors.password = 'Şifre gerekli'
    } else if (data.password.length < 6) {
        errors.password = 'Şifre en az 6 karakter olmalı'
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    }
}
