## 📁 Struktur Folder

```
auth-project/
├── backend/       # Express + MongoDB API
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
|
└── frontend/      # React (Vite) SPA
    ├── public/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Pengaturan Backend (Express & MongoDB)

1. **Buat folder proyek**:

   ```bash
   mkdir auth-project && cd auth-project
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Pasang dependensi**:

   ```bash
   npm install express mongoose dotenv bcryptjs jsonwebtoken cors
   npm install --save-dev nodemon
   ```

3. **Konfigurasi server** (`server.js`):
   - Import paket, aktifkan `express.json()` dan `cors()`.
   - Sambungkan ke MongoDB dengan `mongoose.connect(process.env.MONGO_URI)`.
   - Daftarkan rute untuk `/api/auth` dan `/api/user`.
   - Contoh `.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
     JWT_SECRET=supersecretkey
     ```

4. **Definisikan model** (`models/User.js`):

   ```js
   import mongoose from 'mongoose';
   const userSchema = new mongoose.Schema({ ... });
   export default mongoose.model('User', userSchema);
   ```

5. **Buat rute autentikasi** (`routes/authRoutes.js`):
   - `POST /register` mengenkripsi password dan menyimpan pengguna.
   - `POST /login` memeriksa kredensial dan menghasilkan JWT.

6. **Lindungi rute** dengan middleware (`middleware/authMiddleware.js`)
   yang memverifikasi header `Authorization: Bearer <token>`.

7. **Daftar pengguna dengan paginasi** (`routes/userRoutes.js`):
   - `GET /profile` mengembalikan data pengguna yang ter-decode.
   - `GET /list?page=1&amp;limit=10` mengembalikan username dan info paginasi.

8. **Jalankan server**:
   ```bash
   npm run dev
   ```

API Anda akan tersedia di `http://localhost:5000/api`.

---

## 🧪 Pengujian dengan Postman

1. **Daftarkan pengguna baru**:
   - `POST http://localhost:5000/api/auth/register`
   - Body (JSON): `{ "username": "alice", "password": "secret" }`

2. **Login**:
   - `POST http://localhost:5000/api/auth/login`
   - Body seperti di atas.
   - Respon berisi `{ token, user }`.

3. **Gunakan token** untuk endpoint yang dilindungi:
   - Set header `Authorization: Bearer <token>`.
   - `GET http://localhost:5000/api/user/profile`
   - `GET http://localhost:5000/api/user/list?page=1&limit=10`

4. **Ubah data user** (hanya diri sendiri). contoh langkah di Postman:
   1. Pastikan Anda sudah login melalui `POST /api/auth/login` dan
      mendapatkan nilai `token` serta `user.id` dari respons.
   2. Di Postman buat request baru `PUT http://localhost:5000/api/user/ID`
      ganti `ID` (tanpa tanda `{}`) dengan `user.id` yang Anda terima saat login.
      Contoh: `PUT http://localhost:5000/api/user/699ea29449d1bfbcb8b7aa9bf`.
   3. Pada tab Headers tambahkan
      `Key: Authorization` dan `Value: Bearer <token>` (paste token login).
   4. Pada tab Body pilih `raw` → `JSON` dan masukkan data yang diubah, misal:

      ```json
      { "username": "baru123", "password": "rahasia" }
      ```

   5. Klik Send. Jika token cocok dengan id, Anda akan menerima objek
      pengguna yang telah diperbarui. Jika tidak, server mengembalikan 403.

   > langkah yang sama dapat diulang jika ingin mengubah password saja atau
   > username saja; cukup kirimkan field yang diperlukan di body.

5. **Hapus user** (hanya diri sendiri):
   - `DELETE http://localhost:5000/api/user/ID` (ganti `ID` sama
     seperti di atas, tanpa kurung kurawal)
   - Header `Authorization: Bearer <token>`

---

## 🚀 Pengaturan Frontend (React + Vite)

1. **Buat folder frontend**:

   ```bash
   cd ..
   mkdir frontend && cd frontend
   npm init vite@latest . -- --template react
   npm install
   ```

2. **Pasang tambahan**:

   ```bash
   npm install react-router-dom axios
   ```

3. **Konfigurasikan routing** di `src/App.jsx` menggunakan `BrowserRouter` dan halaman.

4. **Pembungkus API** (`src/api.jsx`):

   ```js
   import axios from "axios";
   export const API = axios.create({ baseURL: "http://localhost:5000/api" });
   ```

5. **Halaman**:
   - `Login.jsx` / `Register.jsx`: formulir memanggil API dan menyimpan token.
   - `Dashboard.jsx`: menampilkan pesan selamat datang dan tabel pengguna dengan paginasi.
   - Komponen menggunakan CSS inline sederhana atau style block.

6. **Jalankan frontend**:
   ```bash
   npm run dev
   ```

Kunjungi `http://localhost:5173` (atau port yang ditampilkan Vite).

---

## 🛠 Alur Kerja Penuh

1. Jalankan MongoDB (Atlas atau lokal).
2. Di folder `backend`:
   ```bash
   npm run dev
   ```
3. Di folder `frontend`:
   ```bash
   npm run dev
   ```
4. Gunakan Postman atau browser untuk mendaftar/login dan menjelajahi dashboard.
5. Token disimpan di `localStorage`, digunakan untuk panggilan berikutnya.
