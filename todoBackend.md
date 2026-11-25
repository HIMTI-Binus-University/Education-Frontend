# Integrasi backend publik

Kontrak aktif: [API-CONTRACT.md](API-CONTRACT.md). Dokumen itu menggantikan seluruh proposal/seed sebelumnya.

- [x] Implementasikan `GET /api/public/catalog` lengkap tanpa body dokumen dan `GET /api/public/summaries/{id}`.
- [x] Sediakan hanya konten publik: matkul aktif dengan kode dan semester, materi `PUBLISHED`, serta sesi non-demo dengan `isPublic: true`. Jadwal lama tetap privat.
- [x] Kembalikan JSON dan status sesuai kontrak, gunakan rate limit backend dan `Cache-Control: no-store` untuk API publik.
- [ ] Konfigurasi HTTPS dan reverse proxy produksi (atau allowlist origin bila lintas origin).
- [x] Hubungkan development frontend lewat proxy same-origin dan uji kedua endpoint melalui Docker dengan PostgreSQL lokal.
- [ ] Atur `VITE_PUBLIC_API_BASE_URL` saat build jika produksi tidak memakai prefix same-origin default; ulangi smoke test pada URL deployment.

Frontend tidak punya fallback demo. API gagal menampilkan error/retry; katalog kosong menampilkan empty state. Fixture regresi tidak masuk bundle produksi.

Untuk review lokal, jalankan Compose backend dan frontend. Vite meneruskan `/api/public` ke backend lokal. Isi `semester` matkul lewat API admin Course Groups; kode dan semester tidak ditebak untuk data lama. Untuk membuka jadwal, kirim `isPublic: true` lewat API admin Study Clubs setelah meninjau judul, deskripsi, dan lokasi. Tautan meeting/registrasi tidak dikirim ke publik. Materi tetap disimpan sebagai Markdown dan dikonversi ke Tiptap JSON untuk Reader; PIC internal tidak dipakai sebagai kredit publik.
