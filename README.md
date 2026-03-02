# GC-TodoList

Yapay zekayı projenin temelini oluşturmak ve istediğim işlevleri eklemek için kullandım. Ardından Firebase bağlantısını yapay zekadan öğrenerek manuel olarak kendim kurdum.
Yapay zekadan aldığım kodlarda şu değişiklikleri yaptım: validation eklettim, register ve login arayüzlerini geliştirdim, error handling ekledim. Bunların yanı sıra görevlere deadline özelliği ve sürükle-bırak (DnD) özelliği de benim tarafımdan talep edilerek eklendi.
"Tamamen size ait" kısmından kasıt sıfırdan kod yazmaksa, dürüstçe söylemem gerekir ki böyle bir kısım yok. Ancak hangi özelliklerin ekleneceğine, nasıl çalışacağına ve yapay zekadan gelen çözümlerin nasıl şekillendirileceğine dair kararlar bana ait.
Son olarak şunu belirtmek isterim: daha önce frontend alanında çalışmadığım için ve bu projede backend ile veritabanı kısmını büyük ölçüde Firebase üstlendiği için yapay zekadan normalden daha fazla yardım aldım. Frontend kodunu bağımsız olarak denetleyecek kadar bilgim henüz olmadığını da dürüstçe ifade etmek istedim.

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



