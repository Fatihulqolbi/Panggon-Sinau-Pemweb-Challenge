# Panggon Sinau 🎯

**Platform Produktivitas dengan Pomodoro Timer & Game Catur**

Panggon Sinau adalah platform web yang dirancang untuk meningkatkan produktivitas Anda dengan menggabungkan teknik Pomodoro dan game catur sebagai refreshment saat break.

## ✨ Fitur Utama

### 🕐 Pomodoro Timer
- Timer fokus 25 menit dan break 5 menit
- Progress circle yang interaktif dan animated
- Notifikasi browser saat timer selesai
- Mode switching yang smooth antara fokus dan break
- Visual indicator yang jelas untuk status timer

### 📝 To-Do List
- Tambah, edit, dan hapus task dengan mudah
- Checkbox untuk mark task sebagai selesai
- Progress bar visual untuk tracking penyelesaian
- Numbering otomatis untuk setiap task
- Hover effects yang smooth

### 🎵 Music Player (Spotify-style)
- Playlist study music yang menenangkan
- Play/pause controls yang intuitif
- Volume slider
- Now playing indicator dengan animasi
- Multiple study playlist

### ♟️ Game Catur
- Chess game lengkap dengan semua aturan standar
- Validasi move otomatis
- Deteksi check, checkmate, dan stalemate
- History move dan captured pieces
- Perfect untuk refreshment saat break time

### 💭 Motivational Quotes
- Quote inspiratif dari berbagai anime
- Auto-rotate setiap 10 detik
- Manual navigation dengan dots indicator
- Smooth transitions

### 🎨 Design & UX
- Tema biru yang menenangkan dan profesional
- Responsive design untuk semua ukuran layar
- Smooth animations dan transitions
- Glass-morphism effects
- Hover interactions yang engaging
- 3-column layout untuk produktivitas maksimal

## 🚀 Cara Menggunakan

1. **Pilih Mode Fokus**
   - Klik tombol "Mode Fokus" untuk memulai sesi produktivitas

2. **Mulai Pomodoro Timer**
   - Tekan tombol play dan fokus bekerja selama 25 menit
   - Timer akan countdown otomatis
   - Matikan notifikasi untuk fokus maksimal

3. **Nikmati Break Time**
   - Setelah 25 menit, timer akan beralih ke mode break (5 menit)
   - Klik "Mode Break" untuk bermain catur
   - Refresh pikiran Anda dengan strategi catur

4. **Ulangi Siklus**
   - Lakukan 4 siklus Pomodoro
   - Istirahat panjang 15-30 menit setelah 4 siklus

## 🛠️ Teknologi

- **Framework**: Next.js 15.2.4
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 📦 Instalasi

```bash
# Clone repository
git clone [repository-url]

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎯 Teknik Pomodoro

Teknik Pomodoro adalah metode manajemen waktu yang terbukti efektif:

- **25 menit fokus**: Periode kerja intensif tanpa gangguan
- **5 menit break**: Istirahat singkat untuk refresh
- **4 siklus**: Setelah 4 Pomodoro, ambil break lebih panjang
- **Produktivitas maksimal**: Mengurangi burnout dan meningkatkan fokus

## 🎮 Manfaat Game Catur

Bermain catur saat break memberikan manfaat:

- Melatih kemampuan berpikir strategis
- Meningkatkan konsentrasi dan fokus
- Refreshment yang produktif dan edukatif
- Melatih problem-solving skills

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🔔 Notifikasi

Website ini menggunakan browser notification untuk memberi tahu Anda saat:
- Waktu fokus selesai
- Waktu break selesai

Pastikan Anda memberikan permission untuk notifikasi.

## 🎨 Customization

Anda dapat mengubah durasi timer di file `components/pomodoro-timer.tsx`:

```typescript
// Focus time (default: 25 minutes)
setTime(25 * 60)

// Break time (default: 5 minutes)
setTime(5 * 60)
```

## 📝 License

© 2025 Panggon Sinau. All rights reserved.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips Produktivitas

1. **Persiapan**: Buat to-do list sebelum memulai Pomodoro
2. **Eliminasi distraksi**: Matikan notifikasi HP dan media sosial
3. **Jangan skip break**: Otak butuh istirahat untuk performa optimal
4. **Track progress**: Catat jumlah Pomodoro yang diselesaikan
5. **Konsisten**: Jadikan Pomodoro sebagai kebiasaan harian

---

**Selamat belajar dan bekerja produktif! 🚀**

*"Panggon Sinau - Tempat belajar yang produktif dan menyenangkan"*
