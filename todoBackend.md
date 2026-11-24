# Integrasi backend publik

Kontrak aktif: [API-CONTRACT.md](API-CONTRACT.md). Dokumen itu menggantikan seluruh proposal/seed sebelumnya.

- [ ] Implementasikan `GET /api/public/catalog` lengkap tanpa body dokumen dan `GET /api/public/summaries/{id}`.
- [ ] Sediakan hanya konten yang benar-benar publik, dengan relasi dan schema Tiptap yang valid.
- [ ] Terapkan status JSON/404, visibility, rate limit, cache invalidation, HTTPS dan CORS sesuai kontrak.
- [ ] Atur `VITE_PUBLIC_API_BASE_URL` saat build jika tidak memakai prefix same-origin default.
- [ ] Jalankan uji integrasi frontend terhadap backend asli sebelum go-live.

Frontend tidak lagi memiliki fallback demo. API gagal menampilkan error/retry; katalog kosong menampilkan empty state. Fixture regresi terisolasi di folder test dan tidak masuk bundle produksi. Tidak ada implementasi backend atau Internal dalam pekerjaan ini.
