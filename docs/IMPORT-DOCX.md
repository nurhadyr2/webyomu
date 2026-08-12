# Import teks cerita dari DOCX

Nama file DOCX harus sama dengan `slug` cerita di `src/data/stories/catalog.js`.
Contoh: `raja-ampat.docx`, `danau-toba.docx`, dan `roro-jonggrang.docx`.

Dokumen harus memakai format berikut:

```text
slide 1

むかし、東(ひがし)ジャワの 北(きた)に、サメが いました。

slide 2

二(ふた)人(り)は ばしょを わけました。
```

Importer mengubahnya menjadi:

```text
むかし、東[ひがし]ジャワの 北[きた]に、サメが いました。
二[ふた]人[り]は ばしょを わけました。
```

Tampilan website merender `東[ひがし]` sebagai kanji 東 dengan ひがし kecil di atasnya.

## Menjalankan

Validasi satu dokumen tanpa menyimpan:

```powershell
npm run import:stories -- ".\dokumen\raja-ampat.docx" --check
```

Impor satu dokumen:

```powershell
npm run import:stories -- ".\dokumen\raja-ampat.docx"
```

Impor seluruh DOCX dalam satu folder sekaligus:

```powershell
npm run import:stories -- ".\dokumen"
```

Seluruh dokumen divalidasi lebih dahulu. Data baru hanya ditulis jika semuanya valid.

## Aturan validasi

- Heading harus berurutan: `slide 1`, `slide 2`, dan seterusnya.
- Setiap slide wajib mempunyai teks.
- Jumlah slide harus sama dengan jumlah ilustrasi cerita.
- Furigana harus langsung mengikuti kanji: `東(ひがし)`.
- Tanda kurung biasa maupun tanda kurung Jepang didukung: `東(ひがし)` dan `東（ひがし）`.
- Nama DOCX harus cocok dengan slug katalog.
- File sementara Word seperti `~$raja-ampat.docx` otomatis diabaikan.

Setelah impor, jalankan `npm run build` untuk pemeriksaan terakhir.
