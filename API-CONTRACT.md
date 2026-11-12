# Kontrak API Publik HIMTI Education

Status: **kontrak frontend siap diimplementasikan backend, bukan bukti bahwa layanan telah tersedia**. Dokumen ini menggantikan usulan endpoint dan seed lama di `todoBackend.md`. Tidak ada data contoh akademik, akun mahasiswa, endpoint tulis, atau autentikasi publik.

## 1. Transport dan konfigurasi

- Base URL default: `/api/public` pada origin website. Override saat build dengan `VITE_PUBLIC_API_BASE_URL` (prefix lengkap, tanpa trailing slash). Variabel `VITE_*` bersifat publik, jangan berisi secret/token.
- Production wajib HTTPS. Jika beda origin, backend mengizinkan origin frontend melalui CORS; request frontend memakai `credentials: omit`, tanpa cookie atau Authorization.
- Semua respons sukses/error: `Content-Type: application/json; charset=utf-8`.
- GET saja. Frontend memberi `Accept: application/json`, timeout 15 detik, cancellation ketika query tidak lagi diperlukan, maksimal satu retry untuk network/server error. 4xx dan schema tidak valid tidak di-retry otomatis.
- Semua ID: string stabil, unik dalam jenis entitasnya, pola `[A-Za-z0-9_-]{1,128}`. Tidak menggunakan nama sebagai foreign key.
- Nilai wajib tidak boleh `null`. Array kosong memakai `[]`. Field opsional yang tidak tersedia **dihilangkan**, bukan `null`, `""`, atau URL placeholder.
- Perubahan breaking pada field, enum, dokumen, atau pagination harus disepakati sebelum deployment frontend/backend. Field tambahan dapat ditambahkan tanpa mengubah arti field lama.

## 2. Endpoint yang dipanggil frontend

| Method/path | Respons sukses | Fungsi |
| --- | --- | --- |
| `GET /catalog` | `200 Catalog` | Semua matkul publik, metadata materi, dan sesi publik, tanpa dokumen materi |
| `GET /summaries/{id}` | `200 Summary` | Satu dokumen Responsi publik lengkap |

Paths di tabel relatif terhadap base URL. Tidak ada POST/PATCH/DELETE, login, atau API Internal di frontend ini.

### GET /catalog

```ts
type Catalog = {
  courses: Course[];
  summaries: SummaryMetadata[];
  events: AcademicEvent[];
};
```

Respons sah ketika belum ada konten publik:

```json
{ "courses": [], "summaries": [], "events": [] }
```

- Katalog adalah **snapshot lengkap dan konsisten**, bukan halaman pertama hasil paginasi. Frontend saat ini memfilter/search lokal. Jangan memotong hasil diam-diam atau mengirim `nextCursor` yang tidak dikonsumsi.
- `courses` termasuk matkul yang belum memiliki materi/jadwal. Urutan array adalah urutan kurasi backend; lima pertama dipakai sebagai rekomendasi query kosong, bukan klaim terbaru/terpopuler.
- `summaries` hanya metadata. **Jangan mengirim `content`** di katalog. Dokumen diminta hanya ketika Reader dibuka.
- `events` memuat sesi Study Club dan Responsi yang boleh ditampilkan, termasuk rekaman sesi lampau yang masih publik. Backend menetapkan retensi, bukan tanggal hardcoded frontend.
- Setiap `courseId` pada materi/sesi harus ada dalam `courses`. Semester materi harus sama dengan semester matkul.
- ID tidak boleh duplikat; kode matkul unik case-insensitive; contributor dalam satu materi tidak boleh duplikat.
- Daftar kosong dengan `200` berbeda dari kegagalan API. Jangan mengubah error server menjadi snapshot kosong.
- Jika katalog membutuhkan pagination/server-side search di masa depan, sepakati kontrak dan implementasi frontend bersama. Dokumen ini tidak mengklaim dukungan pagination saat ini.

### GET /summaries/{id}

```ts
type Summary = SummaryMetadata & { content: TiptapDocument };
```

- `id` respons wajib sama dengan ID request.
- `404` jika ID tidak ada, draft, ditarik, diarsipkan tanpa akses publik, atau tidak boleh dilihat. Respons tidak membocorkan alasan internal.
- Frontend menampilkan not-found hanya untuk `404`; error network, 403, 429, 5xx, HTML fallback, atau payload rusak menampilkan error/retry.
- Metadata/contributor harus konsisten dengan katalog. Perubahan publikasi harus memperbarui/invalidate keduanya.

## 3. Model data

### Course

| Field | Tipe | Aturan |
| --- | --- | --- |
| `id` | string | ID stabil sesuai pola di atas |
| `name` | string | Nama publik, tidak kosong |
| `code` | string | Kode publik, tidak kosong dan unik case-insensitive |
| `semester` | integer > 0 | Semester kurikulum matkul, bukan semester berjalan pengguna |
| `icon` | enum | `code`, `database`, `math`, `box`, `network`, `terminal` |
| `description` | string | Deskripsi plain text; boleh kosong jika belum tersedia |

### Contributor

| Field | Tipe | Aturan |
| --- | --- | --- |
| `id` | string | ID kredit publik, bukan NIM/email |
| `displayName` | string | Nama yang disetujui untuk publik, tidak kosong |

Urutan `contributors` adalah urutan kredit yang disetujui. `[]` berarti belum ada kredit publik. Jangan mengarang identitas dan jangan mengirim email, NIM, role, atau metadata akun Internal. Author record tidak otomatis menjadi contributor.

### SummaryMetadata

| Field | Tipe | Aturan |
| --- | --- | --- |
| `id` | string | ID materi publik |
| `title` | string | Judul plain text, tidak kosong |
| `courseId` | string | Foreign key ke Course |
| `academicPeriod` | string | Label periode akademik dari backend, bukan nilai frontend hardcoded |
| `semester` | integer > 0 | Sama dengan Course.semester |
| `examType` | enum | `Mid Exam`, `Final Exam` |
| `contributors` | Contributor[] | Wajib array, boleh kosong, terurut |

### AcademicEvent

| Field | Tipe | Aturan |
| --- | --- | --- |
| `id` | string | ID sesi publik |
| `title` | string | Tidak kosong, plain text |
| `type` | enum | `Study Club`, `Responsi` |
| `courseId` | string | Foreign key ke Course |
| `startsAt` | ISO 8601 string | Wajib timezone `Z` atau offset `±HH:MM` |
| `endsAt` | ISO 8601 string | Wajib timezone dan lebih besar dari startsAt |
| `location` | string | Lokasi/informasi daring publik; boleh kosong |
| `description` | string | Plain text, boleh kosong |
| `meetingUrl` | HTTPS URL, opsional | Hanya jika boleh dipublikasikan |
| `registrationUrl` | HTTPS URL, opsional | Hanya jika registrasi tersedia |
| `recordingUrl` | HTTPS URL, opsional | YouTube publik yang valid |
| `quota` | integer ≥ 0, opsional | Informasional, bukan sistem booking frontend |

Tampilan waktu, tanggal, filter bulan/hari memakai **Asia/Jakarta (WIB)**, termasuk timestamp UTC yang berganti tanggal setelah dikonversi. URL tidak boleh memuat kredensial. YouTube yang didukung: host `youtu.be`, `youtube.com`, `www.youtube.com`, `m.youtube.com`; path watch (`v=`), embed, atau shorts dengan video ID 11 karakter. Embed memakai `youtube-nocookie.com`. Tidak ada URL rekaman rekaan atau iframe arbitrary.

## 4. Dokumen Reader

- Hanya JSON Tiptap 3 read-only, bukan HTML atau Markdown. Root `{ type: "doc", content: [...] }`; `content: []` sah.
- Nodes yang didukung: `paragraph`, `text`, `heading` level 2/3, `blockquote`, `bulletList`, `orderedList`, `listItem`, `horizontalRule`, `hardBreak`, `codeBlock`, `image`, `table`, `tableRow`, `tableHeader`, `tableCell`, `inlineMath`, `blockMath`.
- Marks: `bold`, `italic`, `strike`, `code`, `link`, `underline`.
- `text` wajib string; rumus wajib `attrs.latex: string`. Heading wajib `attrs.level: 2 | 3`. Code block memakai `attrs.language`; highlighting cpp/sql/javascript/python tersedia. Tabel mengikuti schema Tiptap Table, bukan HTML mentah.
- Gambar: `attrs.src` URL HTTPS publik, `attrs.alt` teks alternatif; jangan pakai blob/data/javascript URL atau URL storage privat/token sementara. Link: `attrs.href` HTTPS publik. Semua URL harus divalidasi backend saat publikasi; frontend juga membatasi link/gambar yang dirender.
- Backend wajib melakukan schema validation, sanitasi atribut/link, pembatasan payload/kompleksitas rumus, dan memastikan konten berhak dipublikasikan. Frontend membatasi traversal maksimum 20.000 node dan kedalaman 40, menolak unknown nodes/marks dan payload struktural tidak sah. Guard frontend bukan pengganti validasi publikasi/backend.
- Schema/extension Internal harus cocok dengan Reader; jangan kirim node authoring/collaboration yang belum didukung. Upload, editor, kolaborasi, dan save tidak ada di website publik.

## 5. Search, filter, dan navigasi

- Pencarian lokal case-insensitive, trim awal/akhir. Course cocok pada `name`/`code`; materi pada `title`, bukan body dokumen. Query kosong merekomendasikan maksimal lima Course pertama.
- Home semester filter dibentuk dari angka semester unik katalog dan diurutkan menaik. Pilih Course memunculkan Responsi/Study Club; frontend meneruskan ID/semester sebagai filter URL.
- Route `/courses/{id}`, `/responsi/{id}`, `/study-clubs/{id}` adalah **route frontend**, bukan endpoint backend.
- `/responsi?q=&course=&semester=`; `/study-clubs?type=&course=&semester=&month=YYYY-MM`; `/videos?course=&event=`. Tidak ada user-specific data/login.
- Frontend hanya menampilkan optional action jika URL sah tersedia. Data kosong tidak diisi konten palsu.

## 6. Error, cache, dan keamanan

Format error backend:

```ts
type ApiError = { error: { code: string; message: string; requestId?: string } };
```

Pesan harus aman untuk publik, tanpa stack trace, SQL, identitas internal, atau secret. Frontend menentukan UI dari status dan menampilkan pesan generik, tidak mencetak body error backend ke UI.

| Status | Arti |
| --- | --- |
| `200` | Payload sesuai schema, termasuk array kosong |
| `400` | Request/ID tidak valid |
| `404` | Resource tidak ditemukan/tidak publik |
| `429` | Rate limit; kirim `Retry-After` |
| `500`, `502`, `503`, `504` | Gangguan backend, bukan empty state |

- Terapkan public-only visibility di seluruh katalog, detail, asset dan embed. Mengetahui ID tidak boleh membuka draft/arsip privat.
- Jangan redirect API ke halaman HTML SPA/login. API tetap memberikan status HTTP dan JSON yang benar.
- Frontend menggunakan cache metadata/detail stale setelah 60 detik; refresh query stale ketika mount atau window kembali fokus. Kegagalan tidak pernah membaca seed lokal. Tidak ada polling realtime; perubahan pada tab yang terus terbuka dapat memerlukan refresh.
- Backend menetapkan cache/ETag sesuai kebijakan publikasi; invalidate katalog/detail/CDN saat publish/unpublish/kredit berubah. Respons not-public dan error jangan dicache sebagai materi publik. Jangan menjanjikan penarikan instan pada data yang sudah diunduh browser.
- Rate limit dan batas ukuran request/response ditetapkan server. Gunakan CORS allowlist, HTTPS, header keamanan dan policy asset yang sesuai hosting.

## 7. Deployment dan acceptance backend

- [ ] Kedua endpoint tersedia dengan HTTPS dan JSON; base URL/CORS benar.
- [ ] Snapshot kosong memberi `200`, bukan data seed. Tidak ada fixture/test data di database publik.
- [ ] Matkul tanpa materi, metadata tanpa body, dokumen detail, contributor kosong/banyak, jadwal lintas timezone, optional links, dan rekaman valid diuji.
- [ ] Draft, unpublish, relasi tidak valid, duplicate ID, ID salah, rate limit dan 5xx tidak membocorkan data.
- [ ] Hosting melayani route SPA langsung ke `index.html`, **kecuali** `/api/*`, dan menyediakan MIME type yang benar.
- [ ] `index.html` revalidasi/no-cache; aset hashed Vite dapat `public, max-age=31536000, immutable`. Atur kompresi dan header keamanan di server; sesuaikan CSP untuk font, API, gambar publik dan YouTube nocookie.
- [ ] URL/kontrak aktual disetujui sebelum go-live; lakukan smoke test dengan backend asli. Build frontend lulus bukan bukti backend telah siap.

Implementasi frontend: `src/api/education/client.ts`, `src/api/education/queries.ts`, `src/data/education.ts`. Data sintetis hanya ada pada `src/test/fixtures` dan test, tidak diimpor kode aplikasi produksi.
