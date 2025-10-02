# Data Source Configuration Guide

## Cara Mengubah Data Source

### 1. **Mengubah di config.ts (Recommended)**

Buka `src/config.ts` dan ubah nilai `current` pada kategori yang diinginkan:

```typescript
dataSource: {
  gaming: {
    current: "evos.json",        // Ganti dari "rrq_hoshi.json" ke "evos.json"
    available: [
      "rrq_hoshi.json",
      "evos.json", 
      "onic.json",
      "alter_ego.json"
    ]
  }
}
```

### 2. **Mengubah dari Component Props**

```typescript
// Gunakan data gaming (default)
<CardList />

// Gunakan data YouTube
<CardList dataCategory="youtube" />

// Gunakan data Instagram  
<CardList dataCategory="instagram" />
```

### 3. **Menggunakan Helper Functions**

```typescript
import { setDataSource, getAvailableDataSources } from './config';

// Ubah data source programmatically
setDataSource('gaming', 'evos.json');

// Lihat data yang tersedia
console.log(getAvailableDataSources('gaming'));
```

## Available Data Sources

### Gaming Data (`gaming/`)
- `rrq_hoshi.json` (default)
- `evos.json`
- `onic.json` 
- `alter_ego.json`

### YouTube Data (`youtube/`)
- `global.json` (default)
- `india.json`
- `usa.json`
- `indonesia.json`
- `bangladesh.json`
- `brazil.json`
- `egypt.json`
- `japan.json`
- `nigeria.json`
- `mexico.json`
- `pakistan.json`
- `philipins.json`
- `russia.json`
- `vietnam.json`

### Instagram Data (`instagram/`)
- `ig-global_updated.json` (default)
- `ig-bd_updated.json`
- `ig-br_updated.json`
- `ig-eg_updated.json`
- `ig-in_updated.json`
- `ig-jp_updated.json`
- `ig-id_updated.json`
- `ig-mx_updated.json`
- `ig-ng_updated.json`
- `ig-ph_updated.json`
- `ig-pk_updated.json`
- `ig-ru_updated.json`
- `ig-usa_updated.json`

## Quick Examples

### Switch to EVOS Data
```typescript
// Di config.ts
current: "evos.json"
```

### Switch to YouTube Global Data
```typescript
// Di CardList component
<CardList dataCategory="youtube" />
```

### Switch to Instagram Indonesia Data
```typescript
// Di config.ts
instagram: {
  current: "ig-id_updated.json"
}
```

## Notes
- Data akan di-reload otomatis ketika dataCategory berubah
- Console akan menampilkan path data yang sedang dimuat
- Pastikan file JSON ada di folder `public/` dengan struktur yang benar

