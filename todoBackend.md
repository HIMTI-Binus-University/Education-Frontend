# TODO Backend: HIMTI Education publik

Status: **usulan kontrak, belum terhubung API**. Implementasi saat ini memakai fixture lokal. Endpoint di bawah belum dianggap tersedia. Tidak ada login atau endpoint tulis mahasiswa di website publik.

## Data yang diperlukan frontend

### Mata kuliah

`Course`: `id: string`, `name: string`, `code: string`, `semester: number`, `icon: "code" | "database" | "math" | "box" | "network" | "terminal"`, `description: string`.

- [ ] Sediakan daftar mata kuliah, termasuk mata kuliah yang belum mempunyai materi.
- [ ] Saat search Home fokus dengan query kosong, kirim/urutkan rekomendasi matkul (maksimal 5 pada dropdown). Frontend demo memakai urutan daftar yang tersedia, bukan mengklaim "latest". Jika memakai matkul terbaru, sepakati field tanggal/sort server terlebih dahulu; jangan menebak recency dari ID atau nama.
- [ ] Gunakan ID stabil dan unique course code; nama matkul jangan dipakai sebagai foreign key.
- [ ] Responsi dikelompokkan berdasarkan `courseId`, bukan judul materi. Halaman matkul berisi daftar materi.

### Contributor

`Contributor`: `id: string`, `displayName: string`.

- [ ] Sediakan relasi many-to-many materi–contributor, bukan satu string gabungan nama.
- [ ] Simpan urutan kredit (`position` pada relasi); kirim array dalam urutan yang disetujui.
- [ ] Tampilkan `displayName` yang memang disetujui untuk publik. Jangan kirim email, NIM, role internal, atau data autentikasi.
- [ ] Contributor ditampilkan sebagai pill berikon profil di samping metadata periode/semester pada header materi, membungkus bila ruang layar tidak cukup. Array kosong `[]` berarti kredit belum tersedia, bukan alasan untuk mengarang nama.
- [ ] Workflow publikasi Internal harus bisa menetapkan contributor; pembuat record dan contributor tidak otomatis orang yang sama.
- [ ] Jangan gunakan contributor placeholder di production. Semua nama dalam seed di bawah ditandai demo dan bukan identitas orang nyata.

### Materi/rangkuman

`Summary`: `id: string`, `title: string`, `courseId: string`, `academicPeriod: string`, `semester: number`, `examType: "Mid Exam" | "Final Exam"`, `contributors: Contributor[]`, `content: JSONContent`.

- [ ] Pastikan `courseId` dan seluruh contributor valid; hindari relasi ganda untuk contributor yang sama pada satu materi.
- [ ] Tentukan sumber semester: saat ini frontend memakai semester matkul, bukan semester berjalan mahasiswa.
- [ ] Metadata periode/ujian dan semester ditampilkan sebagai pill; backend tetap mengirim nilai terpisah, bukan HTML atau teks pill gabungan.
- [ ] Tetapkan periode/ujian aktif, aturan arsip/retensi, serta status `draft`, `published`, dan `archived` di server. Hanya materi yang boleh dipublikasikan yang masuk query publik.
- [ ] Reader menerima dokumen JSON Tiptap 3, bukan Markdown/HTML. Sepakati schema/version dengan Internal: paragraph, h2/h3, bold/italic/link, lists, blockquote, table/row/header/cell, image, codeBlock, inlineMath/blockMath. Rumus memakai `attrs.latex`.
- [ ] Validasi dokumen saat publikasi, termasuk node tidak dikenal dan URL gambar/link. Uji tabel, kode, rumus, gambar, contributor kosong/banyak, dan rangkuman panjang.

## Usulan endpoint publik

| Endpoint (belum tersedia) | Hasil yang dibutuhkan |
| --- | --- |
| `GET /api/public/courses?q=` | `{ "items": Course[] }`, cocokkan nama dan kode matkul, termasuk tanpa materi |
| `GET /api/public/courses/:id` | `Course`, 404 jika tidak ditemukan/tidak publik |
| `GET /api/public/summaries?courseId=&q=` | `{ "items": SummaryMetadata[] }`; metadata mencakup contributors, tanpa content dokumen |
| `GET /api/public/summaries/:id` | `Summary` lengkap dengan JSON Tiptap dan contributors |
| `GET /api/public/search?q=` | `{ "courses": Course[], "summaries": SummaryMetadata[] }` |

`SummaryMetadata = Summary` tanpa `content`. Frontend demo masih mengambil semua data lokal; pisahkan list/detail ketika API disepakati agar dokumen besar tidak ikut dimuat di Home.

- [ ] Search case-insensitive, trim spasi awal/akhir; matkul cocok pada `name` atau `code`, materi cocok pada `title`.
- [ ] Hasil matkul menuju `/courses/:id`; hasil materi langsung menuju `/responsi/:id`. Search tidak boleh kehilangan matkul yang belum punya materi.
- [ ] Hormati filter matkul bersama query materi/matkul; `q` kosong kembali ke daftar biasa. Tentukan limit dan pagination bersama frontend sebelum integrasi, jangan memotong hasil diam-diam.
- [ ] Terapkan visibility/retensi pada semua endpoint termasuk search, bukan hanya pada halaman detail. ID yang diketahui tidak boleh membuka draft.
- [ ] Sepakati format error/404, rate limit publik, dan aturan cache/invalidation ketika publikasi atau kredit diperbarui.

## Seed demo yang sudah dibuat di frontend

Sumber: `src/data/demo.ts` dan `src/data/summary-documents.ts`. Data ini hanya untuk development; bukan materi resmi atau akun/contributor nyata.

| Course ID | Nama matkul | Kode | Semester | Icon |
| --- | --- | --- | --- | --- |
| algorithm | Algorithm & Programming | ALGO | 1 | code |
| database | Database Systems | DB | 3 | database |
| calculus | Calculus | CALC | 1 | math |
| architecture | Computer Architecture | ARCH | 3 | box |
| networks | Computer Networks | NET | 5 | network |
| operating-systems | Operating Systems | OS | 3 | terminal |

Seluruh materi demo memakai `academicPeriod: "2026/2027"` dan `examType: "Mid Exam"`; JSON content lengkap tersedia di `summary-documents.ts`.

| Summary ID | Judul materi | Course ID | Contributor IDs, berurutan |
| --- | --- | --- | --- |
| dynamic-programming | Dynamic Programming | algorithm | demo-algorithm-contributor |
| database-normalization | Database Normalization | database | demo-database-contributor |
| architecture-basics | Computer Architecture Basics | architecture | demo-architecture-contributor |
| derivatives | Limits & Derivatives | calculus | demo-calculus-contributor, demo-calculus-reviewer |

### Seed contributor (development saja)

```json
[
  { "id": "demo-algorithm-contributor", "displayName": "[Contributor demo: Algorithm]" },
  { "id": "demo-database-contributor", "displayName": "[Contributor demo: Database]" },
  { "id": "demo-architecture-contributor", "displayName": "[Contributor demo: Architecture]" },
  { "id": "demo-calculus-contributor", "displayName": "[Contributor demo: Calculus]" },
  { "id": "demo-calculus-reviewer", "displayName": "[Contributor demo: Reviewer]" }
]
```

### Contoh response detail minimal (fixture demonstrasi)

```json
{
  "id": "dynamic-programming",
  "title": "Dynamic Programming",
  "courseId": "algorithm",
  "academicPeriod": "2026/2027",
  "semester": 1,
  "examType": "Mid Exam",
  "contributors": [
    { "id": "demo-algorithm-contributor", "displayName": "[Contributor demo: Algorithm]" }
  ],
  "content": {
    "type": "doc",
    "content": [
      { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Demo section" }] },
      { "type": "paragraph", "content": [{ "type": "text", "text": "Demonstration content only, not an official HIMTI resource." }] }
    ]
  }
}
```

## Data publik lainnya yang masih menunggu backend

- [ ] Jadwal: ID, judul, tipe Study Club/Responsi, `courseId`, waktu mulai/selesai beserta timezone, lokasi, deskripsi; meeting/registrasi/kuota hanya bila tersedia dan boleh publik.
- [ ] Rekaman: URL YouTube valid dan relasi event/matkul; tidak mengarang URL untuk mengisi halaman kosong.
- [ ] Uji integrasi setelah endpoint disepakati: matkul tanpa materi, pencarian nama/kode/judul, beberapa materi per matkul, contributor kosong/banyak, draft/arsip tidak bocor, ID hilang, loading/error/retry.

Frontend sengaja tidak membangun endpoint, database, akun contributor, atau workflow authoring Internal dalam perubahan ini.

## Bukti frontend untuk kontrak ini

Penyempurnaan visual berikutnya tidak mengubah kontrak data: contributor menjadi pill putih berikon profil di bawah metadata; tombol Back juga menjadi pill putih. Filter tetap memakai native select, dengan picker berwarna/beradius konsisten pada browser yang mendukung `appearance: base-select` dan fallback native pada browser lainnya. Tidak ada dependency dropdown baru. Pengujian browser mencakup keempat filter (Courses, Responsi, Schedule, Videos), klik opsi, Escape, reset lewat keyboard, serta navigasi Back pada 1440/390/320px.

- Build dan lint lulus; 29 tes komponen lulus, termasuk pencarian matkul tanpa materi, filter query, contributor kosong/banyak, serta navigasi materi.
- Browser diuji pada 1440/768/390/320px: metadata menjadi dua pill yang tidak meluber; kredit berada di bawah judul; saran matkul dibuka via keyboard/pointer; full search kode matkul dan judul materi menuju halaman yang benar. Tidak ada page error.
- Screenshot desktop/mobile ditinjau. Warna memakai token HIMTI yang sama, pill hanya mengelompokkan metadata, kredit berupa teks yang membungkus, dan tidak ada identitas nyata yang direkayasa. Belum ada pengujian terhadap API produksi.
