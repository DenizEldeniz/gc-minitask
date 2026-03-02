export function getAuthErrorMessage(err: unknown): string {
  if (typeof err !== 'object' || err === null) return 'Bir hata oluştu.'
  const code = (err as { code?: string }).code
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/operation-not-allowed': 'Bu giriş yöntemi etkin değil.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
    'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
    'auth/user-not-found': 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password': 'Hatalı şifre.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/too-many-requests': 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
  }
  return messages[code ?? ''] ?? (err as Error).message ?? 'Bir hata oluştu.'
}
