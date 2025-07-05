import json
from datetime import datetime

# Fungsi untuk mengonversi string tanggal ke objek datetime
def parse_date(date_str):
    return datetime.fromisoformat(date_str)

# Membaca data dari file rrq_hoshi.json
with open('rrq_hoshi.json', 'r') as f:
    data = json.load(f)

# Mengurutkan data berdasarkan date_of_join (terlama di bawah) dan name
sorted_data = sorted(data, key=lambda x: (parse_date(x['date_of_join']), x['name']))

# Menyimpan kembali ke file rrq_hoshi.json
with open('rrq_hoshi.json', 'w') as f:
    json.dump(sorted_data, f, indent=2)

# Menampilkan hasil (opsional)
print(json.dumps(sorted_data, indent=2))