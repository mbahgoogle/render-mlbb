import json
from datetime import datetime

# Fungsi untuk mengonversi string tanggal ke objek datetime
def parse_date(date_str):
    try:
        return datetime.fromisoformat(date_str)
    except (ValueError, TypeError):
        # Jika tanggal tidak valid, kembalikan nilai besar untuk diletakkan di akhir
        return datetime.max

# Membaca data dari file rrq_hoshi.json
try:
    with open('rrq_hoshi.json', 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: File 'rrq_hoshi.json' tidak ditemukan.")
    exit(1)
except json.JSONDecodeError:
    print("Error: Format JSON di 'rrq_hoshi.json' tidak valid.")
    exit(1)

# Mengurutkan data: hanya date_of_join (paling lama di atas)
sorted_data = sorted(data, key=lambda x: -parse_date(x.get('date_of_join', '')).timestamp())

# Menyimpan kembali ke file rrq_hoshi.json
with open('rrq_hoshi.json', 'w') as f:
    json.dump(sorted_data, f, indent=2)

# Menampilkan hasil (opsional)
print(json.dumps(sorted_data, indent=2))