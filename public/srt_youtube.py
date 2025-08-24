import json
import os
from datetime import datetime, timedelta
import re

# Configuration
JSON_FOLDER = "youtube"
SRT_FOLDER = "srt_output"

# Video settings
FPS = 60
WIDTH = 2560
HEIGHT = 1440

# Timing settings
INTRO_DELAY_FRAMES = 120  # 2 seconds delay
ENDING_DURATION = 5       # 5 seconds ending duration
DURASI_PER_CARD_DETIK = 6 # 6 seconds per card

# Convert frame delays to seconds
INTRO_DELAY_SECONDS = INTRO_DELAY_FRAMES / FPS

os.makedirs(SRT_FOLDER, exist_ok=True)

# Helper functions to format numbers
def format_number(num):
    if num >= 1_000_000_000:
        return f"{num/1_000_000_000:.1f}B"
    elif num >= 1_000_000:
        return f"{num/1_000_000:.1f}M"
    elif num >= 1_000:
        return f"{num/1_000:.1f}K"
    return str(num)

def parse_date(date_str):
    try:
        return datetime.strptime(date_str.split("T")[0], "%Y-%m-%d")
    except (ValueError, AttributeError):
        return datetime(1900, 1, 1)
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
    "heros": ["heros", "heroes", "hero"]
}

def get_field(data, key, default=""):
    for alias in FIELD_ALIASES.get(key, [key]):
        if alias in data and data[alias]:
            return data[alias]
    return default

def validate_and_sort_players(raw_players):
    """
    Validates player data and sorts by date (oldest first), following schema.ts (rawDataSchema).
    Returns validated and sorted player list matching TypeScript logic.
    """
    def validate_player(player):
        """Ensure player has required fields with defaults if missing, following schema.ts, dan gunakan mapping alias."""
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
        # Clean roles and heros array
        if isinstance(roles, list):
            roles = [clean_text(role) for role in roles if role and clean_text(role) != "no data"]
        else:
            roles = [clean_text(roles)] if roles and clean_text(roles) != "no data" else []
        if isinstance(heros, list):
            heros = [clean_text(hero) for hero in heros if hero and clean_text(hero) != "no data"]
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
            "heros": heros
        }
    # Validate each player and filter out invalid ones
    validated_players = []
    for player in raw_players:
        if isinstance(player, dict) and (get_field(player, "name") or get_field(player, "full_name")):
            validated_player = validate_player(player)
            if validated_player["name"] != "" and validated_player["name"] != "no data":
                validated_players.append(validated_player)
    # Sort by date (oldest first) - matching TypeScript logic
    validated_players.sort(
        key=lambda x: parse_date(x["date"]) if x.get("date") else datetime(1900, 1, 1)
    )
    # Reverse: date paling lama paling terakhir
    validated_players.reverse()
    return validated_players

def format_time(seconds):
    td = timedelta(seconds=round(seconds, 3))
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int(td.microseconds / 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def clean_text(text):
    if not isinstance(text, str):
        return str(text)
    # Remove extra whitespace and normalize quotes
    text = re.sub(r"\s+", " ", text)
    text = text.replace("'", "'").replace(""", '"').replace(""", '"')
    # Remove "no data" and similar placeholder text
    text = text.replace("no data", "").strip()
    return text.strip()

# Perluas parse_date agar lebih fleksibel
import dateparser

def parse_date(date_str):
    if not isinstance(date_str, str):
        return datetime(1900, 1, 1)
    # Handle various date formats
    date_formats = [
        "%Y-%m-%d",
        "%d.%m.%Y", 
        "%d/%m/%Y",
        "%Y/%m/%d"
    ]
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    # Coba parsing otomatis (termasuk bulan Indonesia)
    dt = dateparser.parse(date_str, languages=['id', 'en'])
    if dt:
        return dt
    # If no format matches, return default date
    return datetime(1900, 1, 1)

def calculate_total_duration(cards_to_show):
    """Calculate total duration matching config.ts getTotalDuration() function"""
    return FPS * DURASI_PER_CARD_DETIK * cards_to_show

def calculate_total_video_duration(cards_to_show):
    """Calculate total video duration matching config.ts getTotalVideoDuration() function"""
    total_duration = calculate_total_duration(cards_to_show)
    ending_duration_frames = ENDING_DURATION * FPS
    return INTRO_DELAY_FRAMES + total_duration + ending_duration_frames

def get_duration_in_seconds(frames):
    """Convert frames to seconds matching config.ts getDurationInSeconds() function"""
    return frames / FPS

def generate_srt_flexible(json_file):
    """
    Generate SRT with configuration matching config.ts.
    Automatically reads total cards from JSON file.
    """
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            channels = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"❌ ERROR: Failed to load {json_file}: {e}")
        return

    if not channels:
        print(f"⚠ WARNING: No channels found in {json_file}")
        return
    
    # Sort channels exactly like CardList.tsx:
    # 1. followers_count (ascending - terbanyak di akhir)
    # 2. date (terlama di atas) if followers equal
    # 3. name as final tiebreaker
    channels.sort(key=lambda x: (
        x.get("followers_count", 0),  # followers count first
        parse_date(x.get("date", "")) if x.get("date") else datetime(1900, 1, 1),  # date second (oldest first)
        x.get("name", "").lower()  # name last
    ))
    
    cards_to_show = len(channels)
    country_name = os.path.basename(json_file).replace(".json", "").capitalize()
    srt_filename = os.path.join(SRT_FOLDER, f"{country_name}_flexible.srt")

    # Calculate durations matching config.ts functions
    total_duration_frames = calculate_total_duration(cards_to_show)
    total_video_duration_frames = calculate_total_video_duration(cards_to_show)
    total_duration_seconds = get_duration_in_seconds(total_duration_frames)
    total_video_duration_seconds = get_duration_in_seconds(total_video_duration_frames)

    print(f"📊 Processing {json_file}:")
    print(f"   - Total channels: {len(channels)}")
    print(f"   - Cards to show: {cards_to_show}")
    print(f"   - Duration per card: {DURASI_PER_CARD_DETIK} seconds")
    print(f"   - Intro delay: {INTRO_DELAY_SECONDS} seconds")
    print(f"   - Total content duration: {total_duration_seconds:.1f} seconds")
    print(f"   - Total video duration: {total_video_duration_seconds:.1f} seconds")

    with open(srt_filename, "w", encoding="utf-8") as srt_file:
        index = 1
        
        # Opening title
        srt_file.write(
            f"{index}\n"
            f"00:00:00,000 --> {format_time(INTRO_DELAY_SECONDS)}\n"
            f"100 Most Subscribed YouTube Channels - {country_name}\n\n"
        )
        index += 1

        # Channel entries
        for i, channel in enumerate(channels):
            start_seconds = INTRO_DELAY_SECONDS + i * DURASI_PER_CARD_DETIK
            end_seconds = INTRO_DELAY_SECONDS + (i + 1) * DURASI_PER_CARD_DETIK

            if end_seconds <= start_seconds:
                print(f"⚠ WARNING: Invalid duration at entry {index}")
                continue

            # Format channel data
            name = channel.get("name", "")
            full_name = channel.get("full_name", "")
            followers = format_number(channel.get("followers_count", 0))
            views = format_number(channel.get("views_count", 0))
            videos = format_number(channel.get("videos_count", 0))
            join_date = channel.get("date", "")

            if join_date:
                parsed_date = parse_date(join_date)
                formatted_date = parsed_date.strftime("%d %B %Y") if parsed_date.year > 1900 else ""
            else:
                formatted_date = ""

            # Compose subtitle entry lines
            lines = []
            
            # First line: Channel name and full name
            if name and full_name and name.lower() != full_name.lower():
                lines.append(f"{name} - {full_name}")
            else:
                lines.append(name or full_name)

            # Second line: Stats
            stats = []
            if followers:
                stats.append(f"Subscribers: {followers}")
            if views:
                stats.append(f"Views: {views}")
            if videos:
                stats.append(f"Videos: {videos}")
            if stats:
                lines.append(" | ".join(stats))

            # Third line: Join date
            if formatted_date:
                lines.append(f"Joined youtube at: {formatted_date}")

            srt_file.write(
                f"{index}\n"
                f"{format_time(start_seconds)} --> {format_time(end_seconds)}\n"
                + "\n".join(lines) + "\n\n"
            )
            index += 1

        # Ending subtitle
        ending_start = INTRO_DELAY_SECONDS + cards_to_show * DURASI_PER_CARD_DETIK
        ending_end = ending_start + ENDING_DURATION
        srt_file.write(
            f"{index}\n"
            f"{format_time(ending_start)} --> {format_time(ending_end)}\n"
            f"Thanks for watching!\n\n"
        )

    print(f"✅ Generated: {srt_filename} with {cards_to_show} channels")
    print(f"   - Content duration: {total_duration_seconds:.1f} seconds")
    print(f"   - Total video duration: {total_video_duration_seconds:.1f} seconds")
    return srt_filename

def main():
    print("🚀 Starting YouTube Channel SRT generation...")
    print(f"📋 Configuration:")
    print(f"   - FPS: {FPS}")
    print(f"   - Duration per card: {DURASI_PER_CARD_DETIK} seconds")
    print(f"   - Intro delay: {INTRO_DELAY_SECONDS} seconds")
    print(f"   - Ending duration: {ENDING_DURATION} seconds")
    
    # Only process the top-level JSON files (exclude the 100 subfolder)
    json_files = [f for f in os.listdir(JSON_FOLDER) if f.endswith(".json") and not os.path.isdir(os.path.join(JSON_FOLDER, f))]
    print(f"\n📁 Found {len(json_files)} country JSON files to process")
    
    for file in json_files:
        print(f"\n{'='*50}")
        json_path = os.path.join(JSON_FOLDER, file)
        generate_srt_flexible(json_path)
    
    print(f"\n{'='*50}")
    print(f"🎉 SRT generation completed!")

if __name__ == "__main__":
    main()