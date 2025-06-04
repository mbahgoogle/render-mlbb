import os
import json
import re
from datetime import datetime, timedelta

# Folder tempat file JSON disimpan
JSON_FOLDER = "data"
SRT_FOLDER = "srt_output"
VIDEO_DURATION = 240  # Total durasi video dalam detik
OPENING_DURATION = 2  # Durasi opening dalam detik
TOTAL_ENTRIES = 42  # Jumlah pemain dalam satu video
CONTENT_DURATION = VIDEO_DURATION - OPENING_DURATION  # Durasi tanpa opening

# Pastikan folder output ada
os.makedirs(SRT_FOLDER, exist_ok=True)

def format_time(seconds):
    """Format detik ke format SRT: HH:MM:SS,MMM"""
    td = timedelta(seconds=seconds)
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int(td.microseconds / 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def clean_text(text):
    """Membersihkan teks dari karakter tak terlihat atau simbol khusus"""
    text = re.sub(r"[^\x20-\x7E\u00C0-\u017F]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    return text.strip()

def parse_date(date_str):
    """Parse date dari format string ke datetime (format: YYYY-MM-DD atau DD.MM.YYYY)"""
    for fmt in ("%Y-%m-%d", "%d.%m.%Y"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def generate_srt(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        players = json.load(f)

    # Urutkan berdasarkan tanggal bergabung (terbaru ke terlama)
    players.sort(
    key=lambda x: (
        parse_date(x.get("date_of_join", "1900-01-01")) or datetime(1900, 1, 1),
        clean_text(x.get("name", ""))
    ),
    reverse=True
    )
    # Ambil nama tim dari pemain pertama
    team_name = clean_text(players[0]["team"]) if players else "Unknown Team"

    srt_filename = os.path.join(SRT_FOLDER, os.path.basename(json_file).replace(".json", ".srt"))
    duration_per_entry = CONTENT_DURATION / TOTAL_ENTRIES

    with open(srt_filename, "w", encoding="utf-8") as srt_file:
        index = 1

        # Opening
        srt_file.write(
            f"{index}\n"
            f"00:00:00,000 --> 00:00:02,000\n"
            f"{team_name} Riwayat Pemain RRQ Hoshi 2017-2025\n\n"
        )
        index += 1

        for i, player in enumerate(players[:TOTAL_ENTRIES]):
            start_seconds = OPENING_DURATION + i * duration_per_entry
            end_seconds = OPENING_DURATION + (i + 1) * duration_per_entry

            if end_seconds <= start_seconds:
                print(f"⚠ WARNING: Error di baris {index} - Timestamp tidak valid ({format_time(start_seconds)} --> {format_time(end_seconds)})")
                continue

            roles = player.get('roles', [])
            if isinstance(roles, list):
                roles_str = ", ".join(map(str, roles))
            else:
                roles_str = str(roles)
            srt_file.write(
                f"{index}\n"
                f"{format_time(start_seconds)} --> {format_time(end_seconds)}\n"
                f"{clean_text(player['name'])} ({clean_text(player['nation'])}) - Nama: {clean_text(player['full_name'])}\n"
                f"Tanggal masuk RRQ Hoshi: {player['date_of_join']} | Roles: [{roles_str}]\n\n"
            )
            index += 1

    print(f"✅ Generated: {srt_filename}")

# Jalankan semua file JSON di folder
for file in os.listdir(JSON_FOLDER):
    if file.endswith(".json"):
        generate_srt(os.path.join(JSON_FOLDER, file))
