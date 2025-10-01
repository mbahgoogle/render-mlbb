import json
import instaloader

L = instaloader.Instaloader()

# login dengan sessionid
SESSIONID = "44340378805%3A929cMiwTjGRmwp%3A4%3AAYdsejl1meu_4VMIsBY-19Miifqpj43aVC2gOcYsuo0"
L.context._session.cookies.set("sessionid", SESSIONID)

with open("ig-id.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for user in data:
    try:
        profile = instaloader.Profile.from_username(L.context, user["name"])
        user["image"] = str(profile.profile_pic_url)
        print(f"Updated {user['name']}: {user['image']}")
    except Exception as e:
        print(f"Error {user['name']}: {e}")

with open("ig-id_updated.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Selesai update foto profil HD")
