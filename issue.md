# Panduan Implementasi: Backend Setup (ElysiaJS + Drizzle + MySQL)

## Deskripsi
Dokumen ini berisi langkah-langkah *high-level* untuk menginisialisasi proyek *backend* baru menggunakan **Bun** di direktori ini. Proyek ini akan menggunakan **ElysiaJS** sebagai *web framework*, dan **Drizzle ORM** untuk berinteraksi dengan database **MySQL**.

## Langkah-langkah Implementasi

### 1. Inisialisasi Proyek
- Buat proyek Bun awal (misalnya menggunakan perintah `bun init` atau pembuatan file manual) di direktori kerja saat ini.

### 2. Instalasi Dependensi
- **Core:** Instal `elysia`, `drizzle-orm`, serta konektor/driver MySQL (seperti `mysql2`).
- **Dev Tools:** Instal `drizzle-kit` sebagai bagian dari *devDependencies* untuk menangani pembuatan dan manajemen file migrasi database.

### 3. Konfigurasi Database (Drizzle & MySQL)
- Atur penghubung/koneksi ke MySQL dengan memanfaatkan *environment variable* (misalnya `DATABASE_URL` di dalam file `.env`).
- Buat file `drizzle.config.ts` (atau `.json`) untuk mengonfigurasi pengaturan Drizzle Kit (lokasi direktori skema dan letak hasil migrasi).
- Definisikan file skema awal (contoh: `schema.ts`) yang merepresentasikan tabel dasar database.

### 4. Setup Web Server (ElysiaJS)
- Siapkan *instance* utama dari aplikasi ElysiaJS.
- Hubungkan/injeksikan *instance* database Drizzle ke dalam aplikasi agar dapat dipanggil pada tiap *route handler*.
- Siapkan sebuah *endpoint* *health-check* (misal: `GET /`) untuk memvalidasi bahwa server berhasil menyala dan database bisa diakses.

### 5. Finalisasi Skrip Menjalankan Server
- Pastikan ada skrip di `package.json` atau instruksi yang sesuai untuk menjalankan *server* dalam mode pengembangan (misal, menggunakan `bun --watch`).
- Pastikan ada alur yang jelas untuk melakukan *generate* dan mengaplikasikan (*push*/*migrate*) skema database ke MySQL.
