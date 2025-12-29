# Game Fisika 🎮

Game edukasi fisika interaktif untuk belajar Gerak Lurus Beraturan (GLB), Gerak Lurus Berubah Beraturan (GLBB), dan Gerak Parabola.

## 🚀 Quick Start

Buka `index.html` di browser (tidak perlu server).

## 📁 Struktur Project

```
Game Fisika/
├── index.html              # Entry point
├── style.css               # Custom styles
├── js/
│   ├── main.js             # App entry point & coordination
│   │
│   ├── core/
│   │   ├── Engine.js       # Game loop & physics coordination
│   │   ├── Renderer.js     # Canvas rendering manager
│   │   ├── Environment.js  # Background, grid, axes
│   │   ├── Sprites.js      # Game entities (car, ball)
│   │   └── TrailManager.js # Trajectory visualization
│   │
│   ├── levels/
│   │   └── LevelManager.js # All level configurations & progress
│   │
│   ├── physics/
│   │   ├── PhysicsBase.js      # Base physics class
│   │   ├── GLBPhysics.js       # GLB calculations
│   │   ├── GLBBPhysics.js      # GLBB calculations
│   │   └── ParabolaPhysics.js  # Parabola calculations
│   │
│   ├── ui/
│   │   ├── QuestionPanel.js    # Question display
│   │   ├── InputPanel.js       # Input fields
│   │   └── FeedbackPanel.js    # Result feedback
│   │
│   └── utils/
│       ├── constants.js    # Game constants
│       ├── helpers.js      # Utility functions
│       └── storage.js      # LocalStorage for progress
```

## 📝 Menambah Level Baru

### 1. Buka file konfigurasi level:
- Edit `js/levels/LevelManager.js`
- Tambahkan objek level baru ke dalam array `levels`

### 2. Tambahkan konfigurasi level:

```javascript
{
    id: 15,                    // ID unik (increment dari yang terakhir)
    type: 'GLB',               // Tipe: GLB, GLBB, atau PARABOLA
    title: 'Judul Level',
    description: 'Deskripsi soal...',
    
    given: {                   // Data yang diberikan
        distance: { value: 100, unit: 'm', label: 'Jarak' },
        time: { value: 10, unit: 's', label: 'Waktu' }
    },
    
    find: ['velocity'],        // Apa yang dicari: velocity, distance, time, acceleration, angle
    
    inputs: [{                 // Input fields untuk user
        id: 'velocity',
        label: 'Kecepatan (v)',
        unit: 'm/s',
        type: 'number',
        placeholder: 'Masukkan kecepatan...'
    }],
    
    solution: { velocity: 10 }, // Jawaban yang benar
    tolerance: 0.1,            // Toleransi error (10%)
    
    hints: ['Hint 1', 'Hint 2'],
    formulas: ['v = s / t'],
    explanation: '<p>Penjelasan...</p>'
}
```

### 3. Update total level di menu (jika perlu)

Edit `index.html` pada bagian topic cards untuk update range level.

## 🎨 Customization

### Warna & Styling
- Edit `style.css` untuk custom styles
- Tailwind digunakan via CDN untuk utility classes

### Game Settings
- Edit `js/utils/constants.js` untuk:
  - Scoring values
  - Animation settings
  - Colors & Visual settings

## 🔧 Development

### Tech Stack
- Vanilla JavaScript (no framework)
- Tailwind CSS via CDN
- HTML5 Canvas untuk visualisasi

### Key Classes
- `Engine`: Game loop dan koordinasi physics
- `Renderer`: Menggambar ke canvas
- `LevelManager`: Mengelola level dan progress
- `GLBPhysics/GLBBPhysics/ParabolaPhysics`: Kalkulasi fisika

### Storage
Progress disimpan di `localStorage` dengan key `physics_game_progress`.

## 📄 License

MIT License - bebas digunakan untuk pembelajaran.
