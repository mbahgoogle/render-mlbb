import json
import os
import re
from datetime import datetime, timedelta

# Configuration (mirrors src/config.ts defaults)
JSON_FOLDER = "gaming"
SRT_FOLDER = "srt_output"

# Video/timing settings
FPS = 60
INTRO_DELAY_FRAMES = 120  # 2s
ENDING_DURATION = 5       # seconds
DURASI_PER_CARD_DETIK = 6 # seconds per card

INTRO_DELAY_SECONDS = INTRO_DELAY_FRAMES / FPS

os.makedirs(SRT_FOLDER, exist_ok=True)

# Flexible field aliases (for robustness across datasets)
FIELD_ALIASES = {
    "name": ["name", "nama", "player_name"],
    "full_name": ["full_name", "nama_lengkap", "fullname"],
    "nation": ["nation", "negara", "country"],
    "nation_code": ["nation_code", "kode_negara", "country_code"],
    "date": ["date", "date_of_join", "join_date", "tanggal_masuk"],
    "date_of_birth": ["date_of_birth", "dob", "tanggal_lahir"],
    "team": ["team", "tim", "club"],
    "roles": ["roles", "role", "posisi"],
    "image": ["image", "img", "foto"],
    "description": ["description", "deskripsi", "desc"],
    "league": ["league", "liga"],
    "logo_league": ["logo_league", "logo_liga"],
    "tier": ["tier", "tingkatan"],
    "heros": ["heros", "heroes", "hero"],
}

def get_field(data, key, default=""):
    for alias in FIELD_ALIASES.get(key, [key]):
        if alias in data and data[alias]:
            return data[alias]
    return default

def clean_text(text):
    if not isinstance(text, str):
        return str(text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("'", "'").replace(""", '"').replace(""", '"')
    text = text.replace("no data", "").strip()
    return text.strip()

# Flexible date parsing
import dateparser

def parse_date(date_str):
    if not isinstance(date_str, str):
        return datetime(1900, 1, 1)
    date_formats = [
        "%Y-%m-%d",
        "%d.%m.%Y",
        "%d/%m/%Y",
        "%Y/%m/%d",
    ]
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    dt = dateparser.parse(date_str, languages=["id", "en"])  # supports Indonesian month names
    if dt:
        return dt
    return datetime(1900, 1, 1)

def validate_and_sort_players(raw_players):
    def validate_player(player):
        name = clean_text(get_field(player, "name", ""))
        full_name = clean_text(get_field(player, "full_name", ""))
        nation = clean_text(get_field(player, "nation", ""))
        nation_code = clean_text(get_field(player, "nation_code", ""))
        date = get_field(player, "date", "")
        date_of_birth = get_field(player, "date_of_birth", "")
        team = clean_text(get_field(player, "team", ""))
        roles = get_field(player, "roles", [])
        image = clean_text(get_field(player, "image", ""))
        description = clean_text(get_field(player, "description", ""))
        league = clean_text(get_field(player, "league", ""))
        logo_league = clean_text(get_field(player, "logo_league", ""))
        tier = clean_text(get_field(player, "tier", ""))
        heros = get_field(player, "heros", [])

        if isinstance(roles, list):
            roles = [clean_text(r) for r in roles if r and clean_text(r) != "no data"]
        else:
            roles = [clean_text(roles)] if roles and clean_text(roles) != "no data" else []
        if isinstance(heros, list):
            heros = [clean_text(h) for h in heros if h and clean_text(h) != "no data"]
        else:
            heros = [clean_text(heros)] if heros and clean_text(heros) != "no data" else []

        return {
            "name": name,
            "full_name": full_name,
            "nation": nation,
            "nation_code": nation_code,
            "date": date,
            "date_of_birth": date_of_birth,
            "team": team,
            "roles": roles,
            "image": image,
            "description": description,
            "league": league,
            "logo_league": logo_league,
            "tier": tier,
            "heros": heros,
        }

    validated = []
    for p in raw_players:
        if isinstance(p, dict) and (get_field(p, "name") or get_field(p, "full_name")):
            vp = validate_player(p)
            if vp["name"] != "" and vp["name"] != "no data":
                validated.append(vp)

    # Sorting to match CardList.tsx for gaming (no followers_count used):
    # 1) Entries with date first, then without
    # 2) date descending (newest first)
    # 3) name as tiebreaker
    def sort_key(x):
        has_date = 0 if x.get("date") else 1  # 0 comes first (has date)
        if x.get("date"):
            dt = parse_date(x.get("date"))
            # Use negative timestamp to get descending order via ascending sort
            try:
                ts = -dt.timestamp()
            except Exception:
                ts = float('inf')
        else:
            ts = float('inf')  # items without date go last
        name_val = (x.get("name") or "").lower()
        return (has_date, ts, name_val)

    validated.sort(key=sort_key)
    return validated

def format_time(seconds):
    td = timedelta(seconds=round(seconds, 3))
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int(td.microseconds / 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def calculate_total_duration(cards_to_show):
    return FPS * DURASI_PER_CARD_DETIK * cards_to_show

def calculate_total_video_duration(cards_to_show):
    total_duration = calculate_total_duration(cards_to_show)
    ending_duration_frames = ENDING_DURATION * FPS
    return INTRO_DELAY_FRAMES + total_duration + ending_duration_frames

def get_duration_in_seconds(frames):
    return frames / FPS

def generate_srt_for_team(json_file):
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            raw_players = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"❌ ERROR: Failed to load {json_file}: {e}")
        return

    if not raw_players:
        print(f"⚠ WARNING: No players found in {json_file}")
        return

    players = validate_and_sort_players(raw_players)
    if not players:
        print(f"⚠ WARNING: No valid players found in {json_file}")
        return

    cards_to_show = len(players)
    team_name = players[0]["team"] if players else os.path.basename(json_file).replace(".json", "")
    out_name = os.path.join(SRT_FOLDER, os.path.basename(json_file).replace(".json", "_flexible.srt"))

    total_duration_frames = calculate_total_duration(cards_to_show)
    total_video_duration_frames = calculate_total_video_duration(cards_to_show)
    total_duration_seconds = get_duration_in_seconds(total_duration_frames)
    total_video_duration_seconds = get_duration_in_seconds(total_video_duration_frames)

    print(f"📊 Processing {json_file}:")
    print(f"   - Valid players: {len(players)}")
    print(f"   - Cards to show: {cards_to_show}")
    print(f"   - Duration/card: {DURASI_PER_CARD_DETIK}s | Intro: {INTRO_DELAY_SECONDS}s | Ending: {ENDING_DURATION}s")

    with open(out_name, "w", encoding="utf-8") as srt_file:
        index = 1
        # Opening
        srt_file.write(
            f"{index}\n"
            f"00:00:00,000 --> {format_time(INTRO_DELAY_SECONDS)}\n"
            f"Riwayat Pemain {team_name} 2017-2025\n\n"
        )
        index += 1

        # Entries
        for i, p in enumerate(players):
            start_seconds = INTRO_DELAY_SECONDS + i * DURASI_PER_CARD_DETIK
            end_seconds = INTRO_DELAY_SECONDS + (i + 1) * DURASI_PER_CARD_DETIK
            if end_seconds <= start_seconds:
                print(f"⚠ WARNING: Invalid duration at entry {index}")
                continue

            roles = p.get("roles", [])
            roles_str = ", ".join(clean_text(r) for r in roles) if isinstance(roles, list) else clean_text(str(roles))
            heros = p.get("heros", [])
            heros_str = ", ".join(clean_text(h) for h in heros) if isinstance(heros, list) else clean_text(str(heros))

            join_date = p.get("date", "")
            if join_date and join_date not in ("1900-01-01", "no data"):
                try:
                    pd = parse_date(join_date)
                    formatted_date = pd.strftime("%d %B %Y") if pd.year > 1900 else join_date
                except Exception:
                    formatted_date = join_date
            else:
                formatted_date = ""

            lines = []
            name = p.get("name", "")
            nation = p.get("nation", "")
            league = p.get("league", "")
            if name:
                if nation:
                    lines.append(f"{name} ({nation})")
                    if league:
                        lines.append(f"({league})")
                else:
                    lines.append(name)

            info_parts = []
            if p.get("full_name"):
                info_parts.append(f"Name: {p['full_name']}")
            if formatted_date:
                info_parts.append(f"Bergabung: {formatted_date}")
            if roles_str:
                info_parts.append(f"Roles: [{roles_str}]")
            if heros_str:
                info_parts.append(f"Heros: [{heros_str}]")
            if info_parts:
                lines.append(" | ".join(info_parts))

            srt_file.write(
                f"{index}\n"
                f"{format_time(start_seconds)} --> {format_time(end_seconds)}\n"
                + "\n".join(lines) + "\n\n"
            )
            index += 1

        # Ending
        ending_start = INTRO_DELAY_SECONDS + cards_to_show * DURASI_PER_CARD_DETIK
        ending_end = ending_start + ENDING_DURATION
        srt_file.write(
            f"{index}\n"
            f"{format_time(ending_start)} --> {format_time(ending_end)}\n"
            f"Terima kasih sudah menonton!\n\n"
        )

    print(f"✅ Generated: {out_name} with {cards_to_show} players")
    print(f"   - Content duration: {total_duration_seconds:.1f}s | Total video: {total_video_duration_seconds:.1f}s")
    return out_name

def main():
    print("🚀 Starting Gaming SRT generation...")
    target = os.path.join(JSON_FOLDER, "rrq_hoshi.json")  # default target per request
    if os.path.exists(target):
        generate_srt_for_team(target)
    else:
        print(f"❌ Not found: {target}")

if __name__ == "__main__":
    main()


