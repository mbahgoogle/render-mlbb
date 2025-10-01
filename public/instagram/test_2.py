import json
import instaloader

L = instaloader.Instaloader()

# login dengan sessionid
SESSIONID = "67012367837%3AZTBAUsdxcObhMu%3A2%3AAYdEKkT_J_58B1OzdzjFMmrOeEZPh0EL_xyBGiXwfA"
L.context._session.cookies.set("sessionid", SESSIONID)

with open("ig-vn.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for user in data:
    try:
        profile = instaloader.Profile.from_username(L.context, user["name"])
        user["image"] = str(profile.profile_pic_url)
        print(f"Updated {user['name']}: {user['image']}")
    except Exception as e:
        print(f"Error {user['name']}: {e}")

with open("ig-vn_updated.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Selesai update foto profil HD")
