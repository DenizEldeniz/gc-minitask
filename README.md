# GC-TodoList

Kullanıcıya özel todo listesi uygulaması. **React + TypeScript + Tailwind CSS** (frontend), **Firebase** (Authentication + Firestore).

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Stil | Tailwind CSS |
| Auth | Firebase Authentication (e-posta/şifre) |
| Veritabanı | Firebase Firestore |
| Routing | React Router v6 |
| Sürükleme | @hello-pangea/dnd |

## Özellikler

- **Kayıt / Giriş** — Firebase Authentication ile güvenli oturum yönetimi
- **Form validasyonu** — Kayıt ve giriş formlarında client-side validasyon (boş alan, e-posta formatı, şifre uzunluğu, şifre eşleşme kontrolü)
- **Todo CRUD** — Ekleme, tamamlandı işaretleme, silme
- **Başlık sınırı** — Maksimum 100 karakter, anlık sayaç göstergesi
- **Açıklama & Deadline** — Opsiyonel açıklama ve son tarih alanı; geçmiş / bugün / bu hafta renk kodlaması
- **Drag & Drop sıralama** — Bekleyen görevler sürükle-bırak ile sıralanabilir
- **Kullanıcıya özel veri** — Her kullanıcı yalnızca kendi todolarını görür (Firestore güvenlik kuralları)
- **Responsive** — Masaüstü (sidebar) ve mobil (header) düzenler

## Proje yapısı

```
client/
├── src/
│   ├── components/       # TodoForm, TodoList, TodoItemRow
│   ├── contexts/         # AuthContext (Firebase Auth)
│   ├── pages/            # Login, Register, TodoPage
│   ├── services/         # Firestore işlemleri (todos.ts)
│   ├── utils/            # Firebase hata mesajları
│   ├── validation/       # Form validasyon fonksiyonları
│   ├── firebase.ts       # Firebase başlatma
│   └── App.tsx           # Router & route koruması
├── .env                  # Firebase config (gizli)
└── ...
```

## Gereksinimler

- Node.js 18+
- Firebase projesi (ücretsiz — [console.firebase.google.com](https://console.firebase.google.com))

## Firebase kurulumu

1. [Firebase Console](https://console.firebase.google.com) üzerinden proje oluşturun.
2. **Authentication → Sign-in method → Email/Password** etkinleştirin.
3. **Firestore Database** oluşturun ve aşağıdaki güvenlik kurallarını uygulayın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Proje Ayarları → Uygulamalarınız → Web** üzerinden config bilgilerini alın.
5. `client/.env` dosyası oluşturup değerleri girin:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Çalıştırma

```bash
cd client
npm install
npm run dev
```

→ **http://localhost:5173**

## Canlıya alma (Vercel)

1. Projeyi GitHub'a yükleyin.
2. Vercel'de **Import** → **Root Directory:** `client`
3. **Environment Variables** bölümüne `VITE_FIREBASE_*` değişkenlerini ekleyin.
4. Firebase Console → **Authentication → Settings → Authorized domains** bölümüne Vercel domaininizi ekleyin.
