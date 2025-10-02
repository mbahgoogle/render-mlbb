# Cara Mengubah Data Source

## 🎯 **Cara Paling Mudah - Seperti Import rawTopData**

Buka file `src/config.ts` dan ubah sesuai keinginan:

### **1. Gaming Data (Default)**
```typescript
DATA_SOURCE: {
  // Gaming Data - Uncomment salah satu untuk menggunakan
  gaming: "gaming/rrq_hoshi.json",      // ✅ AKTIF - RRQ Hoshi
  // gaming: "gaming/evos.json",           // ❌ Comment - EVOS data
  // gaming: "gaming/onic.json",              // ❌ Comment - ONIC data
  // gaming: "gaming/alter_ego.json",      // ❌ Comment - Alter Ego data
}
```

### **2. YouTube Data**
```typescript
DATA_SOURCE: {
  // YouTube Data - Uncomment salah satu untuk menggunakan
  // youtube: "youtube/global.json",       // ❌ Comment - Global YouTube
  youtube: "youtube/indonesia.json",    // ✅ AKTIF - Indonesia YouTube
  // youtube: "youtube/usa.json",          // ❌ Comment - USA YouTube
}
```

### **3. Instagram Data**
```typescript
DATA_SOURCE: {
  // Instagram Data - Uncomment salah satu untuk menggunakan
  // instagram: "instagram/ig-global_updated.json",  // ❌ Comment - Global
  instagram: "instagram/ig-id_updated.json",      // ✅ AKTIF - Indonesia
  // instagram: "instagram/ig-usa_updated.json",     // ❌ Comment - USA
}
```

## 📋 **Daftar Lengkap Data yang Tersedia**

### **Gaming Data:**
- `gaming/rrq_hoshi.json` - RRQ Hoshi players
- `gaming/evos.json` - EVOS players  
- `gaming/onic.json` - ONIC players
- `gaming/alter_ego.json` - Alter Ego players

### **YouTube Data:**
- `youtube/global.json` - Global YouTube creators
- `youtube/india.json` - India YouTube creators
- `youtube/usa.json` - USA YouTube creators
- `youtube/indonesia.json` - Indonesia YouTube creators
- `youtube/bangladesh.json` - Bangladesh YouTube creators
- `youtube/brazil.json` - Brazil YouTube creators
- `youtube/egypt.json` - Egypt YouTube creators
- `youtube/japan.json` - Japan YouTube creators
- `youtube/nigeria.json` - Nigeria YouTube creators
- `youtube/mexico.json` - Mexico YouTube creators
- `youtube/pakistan.json` - Pakistan YouTube creators
- `youtube/philipins.json` - Philippines YouTube creators
- `youtube/russia.json` - Russia YouTube creators
- `youtube/vietnam.json` - Vietnam YouTube creators

### **Instagram Data:**
- `instagram/ig-global_updated.json` - Global Instagram
- `instagram/ig-bd_updated.json` - Bangladesh Instagram
- `instagram/ig-br_updated.json` - Brazil Instagram
- `instagram/ig-eg_updated.json` - Egypt Instagram
- `instagram/ig-in_updated.json` - India Instagram
- `instagram/ig-jp_updated.json` - Japan Instagram
- `instagram/ig-id_updated.json` - Indonesia Instagram
- `instagram/ig-mx_updated.json` - Mexico Instagram
- `instagram/ig-ng_updated.json` - Nigeria Instagram
- `instagram/ig-ph_updated.json` - Philippines Instagram
- `instagram/ig-pk_updated.json` - Pakistan Instagram
- `instagram/ig-ru_updated.json` - Russia Instagram
- `instagram/ig-usa_updated.json` - USA Instagram

## ⚡ **Quick Examples**

### **Ubah ke EVOS:**
1. Buka `src/config.ts`
2. Comment line: `// gaming: "gaming/rrq_hoshi.json",`
3. Uncomment line: `gaming: "gaming/evos.json",`
4. Refresh browser

### **Ubah ke YouTube Indonesia:**
1. Buka `src/config.ts`
2. Comment semua gaming: `// gaming: "gaming/..."`
3. Uncomment: `youtube: "youtube/indonesia.json",`
4. Refresh browser

### **Ubah ke Instagram USA:**
1. Buka `src/config.ts`
2. Comment semua gaming & youtube
3. Uncomment: `instagram: "instagram/ig-usa_updated.json",`
4. Refresh browser

## 🔍 **Cara Cek Data yang Sedang Dimuat**

1. Buka browser Developer Tools (F12)
2. Lihat Console tab
3. Akan muncul: `Loading data from: gaming/onic.json` (contoh)

## ⚠️ **Tips:**
- Hanya **1 data source** yang bisa aktif dalam satu waktu
- **Prioritas**: gaming > youtube > instagram
- Jika tidak ada yang aktif, akan fallback ke `gaming/rrq_hoshi.json`
- Refresh browser setelah mengubah data source

