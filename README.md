# Vibe-Coding Backend App

Aplikasi backend yang menyediakan layanan otentikasi API yang aman, responsif, dan konsisten. Dibangun sepenuhnya menggunakan runtime modern Bun dan kerangka kerja spesifik ElysiaJS untuk optimasi kecepatan maksimal.

## 🛠 Technology Stack

- **Runtime:** [Bun](https://bun.sh/) (Engine utama & package manager)
- **Framework:** [ElysiaJS](https://elysiajs.com/) (Web framework TypeScript)
- **Database:** MySQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Keamanan:** `bcrypt` (Password hashing)
- **Testing:** `bun:test`

## 📂 Struktur Folder dan Arsitektur

Aplikasi diatur dengan pola pemisahan tanggung jawab (*Separation of Concerns*) yang ketat:

```text
belajar-vibe-coding/
├── src/
│   ├── index.ts              # Entry point utama & penanganan Global Error (Elysia instance)
│   ├── db/
│   │   ├── index.ts          # Konfigurasi koneksi database MySQL
│   │   └── schema.ts         # Deklarasi tabel database menggunakan spesifikasi Drizzle
│   ├── routes/
│   │   └── users-route.ts    # File rute HTTP dan tipe data validasi melalui TypeBox
│   └── services/
│       └── users-service.ts  # Layer logika bisnis & pengolah algoritma database
├── test/
│   └── users.test.ts         # Blok pengujian unit testing murni end-to-end
├── .env                      # Penyimpanan credential Environment rahasia
└── drizzle.config.ts         # Konfigurasi bundler eksekutor Drizzle
```

## 📊 Skema Database

Sistem memanfaatkan Drizzle ORM mendesain dua arsitektur skema tabel inti:

1. **`users`**
   Tabel repositori individu pengguna aplikasi.
   - `id`: *Serial / BIGINT* (Primary Key)
   - `name`: *VARCHAR(255)* (Wajib)
   - `email`: *VARCHAR(255)* (Wajib & Unik)
   - `password`: *VARCHAR(255)* (Enkripsi hash bcrypt tersandi)
   - `created_at`: *TIMESTAMP* (Otomatis)

2. **`sessions`**
   Tabel repositori status kepemilikan izin login saat ini.
   - `id`: *Serial / BIGINT* (Primary Key)
   - `token`: *VARCHAR(255)* (UUID Token Sesi acak)
   - `user_id`: *BIGINT* (Foreign Key bertautan konstan ke tabel *users.id*)
   - `created_at`: *TIMESTAMP* (Otomatis)

## 📡 API Endpoints (Rest API)

Seluruh blok API ditangani via lintasan awalan basis `/api`.
Asumsi beban data pengiriman menggunakan standar *Content-Type: application/json*.

| Method | Endpoint                 | Fungsi                       | Autorisasi / Header |
|--------|--------------------------|------------------------------|---------------------|
| POST   | `/api/users`             | Registrasi Akun Baru         | -               |
| POST   | `/api/users/login`       | Akses Otentikasi & Token     | -               |
| GET    | `/api/users/current`     | Mengintip Profil Saat ini    | `Bearer <token>`|
| DELETE | `/api/users/logout`      | Membuang Riwayat Sesi (Keluar)| `Bearer <token>`|

> ⚠️ Standarisasi validasi (misal, pengecekan email & minimal *password* 6 karakter) dipasang erat pada HTTP Controller rute. Apabila salah, sistem menangkal memakai JSON HTTP Status 400.

---

## 💻 Panduan Instalasi dan Pengaturan (Setup)

### 1. Kloning dan Instalasi
Pastikan sistem komputer Anda sudah ditanami program [Bun](https://bun.sh/).
Masuk ke terminal folder projek Anda, kemudian instal paket esensial:
```bash
bun install
```

### 2. Setup Lingkungan Database (`.env`)
Salin atau susun berkas `.env` menyesuaikan titik server MySQL terpasang milik Anda:
```env
DB_HOST="localhost"
DB_PORT=3308
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="belajar_vibe_coding"
```

### 3. Migrasi Skema Basis Data 
Sebarkan dan lebur struktur skema tabel TypeScript langsung tersalin menjadi realita arsitektur ke terminal MySQL tersebut lewat *Drizzle Kit*:
```bash
bunx drizzle-kit push
```

---

## 🚀 Menjalankan Aplikasi (Run)

Biarkan server bernapas lalu berjalan otomatis melayani lalu-lintas jaringan lokal (`localhost:3000`) dengan membunyikan script berikut:
```bash
bun run src/index.ts
```

## 🧪 Menguji Efektivitas Aplikasi (Testing)

Pengecekan kualitas dan anti-*regression* kode dibalut mulus secara total oleh test runner ekslusif `bun:test`:
```bash
bun test
```
*Note: Tes sangat aman dipakai sebab selalu mencuci rekam jejak tabel MySQL secara berkala demi menjamin integritas simulasi.*
