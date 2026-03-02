export type RegisterFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
}

export type RegisterValidationResult = {
  valid: boolean
  errors: Partial<Record<keyof RegisterFormData, string>>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegisterForm(data: RegisterFormData): RegisterValidationResult {
  const errors: Partial<Record<keyof RegisterFormData, string>> = {}

  const trimmedFirstName = data.firstName.trim()
  if (!trimmedFirstName) {
    errors.firstName = 'Ad gerekli'
  } else if (trimmedFirstName.length < 2) {
    errors.firstName = 'Ad en az 2 karakter olmalı'
  }

  const trimmedLastName = data.lastName.trim()
  if (!trimmedLastName) {
    errors.lastName = 'Soyad gerekli'
  } else if (trimmedLastName.length < 2) {
    errors.lastName = 'Soyad en az 2 karakter olmalı'
  }

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

  if (!data.passwordConfirm) {
    errors.passwordConfirm = 'Şifre tekrarı gerekli'
  } else if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = 'Şifreler eşleşmiyor'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
