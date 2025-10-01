import os
import json
from django.http import HttpResponse
from django.conf import settings
from django.urls import path
from django.core.management import execute_from_command_line

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, "instagram")

# Konfigurasi Django minimal
settings.configure(
    DEBUG=True,
    ROOT_URLCONF=__name__,
    SECRET_KEY="abc123",
    ALLOWED_HOSTS=["*"],
    TEMPLATES=[{
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
    }],
)

def index(request):
    files = [f for f in os.listdir(DATA_FOLDER) if f.endswith(".json")]
    selected_file = request.GET.get("file")
    data, error = None, None

    if selected_file:
        file_path = os.path.join(DATA_FOLDER, selected_file)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            error = str(e)

    html = f"""
    <h1>📂 JSON Viewer</h1>
    <form method="get">
        <label>Pilih File JSON:</label>
        <select name="file" onchange="this.form.submit()">
            <option value="">-- pilih file --</option>
            {''.join(
                f'<option value="{f}" {"selected" if f == selected_file else ""}>{f}</option>'
                for f in files
            )}
        </select>
    </form>
    {render_table(data, error)}
    """
    return HttpResponse(html)

def render_table(data, error):
    if error:
        return f"<p style='color:red;'>❌ Error: {error}</p>"
    if not data:
        return ""
    if isinstance(data, list) and isinstance(data[0], dict):
        # Header
        header = "".join(f"<th>{h}</th>" for h in data[0].keys())
        rows = ""
        for row in data:
            cells = ""
            for key, val in row.items():
                if key == "image" and isinstance(val, str):
                    cells += f"<td><img src='https://ce880219c.cloudimg.io/v7/{val}' width='150' height='150'></td>"
                else:
                    cells += f"<td>{val}</td>"
            rows += f"<tr>{cells}</tr>"
        return f"<p>✅ File valid JSON</p><table border='1' cellspacing='0' cellpadding='5'><tr>{header}</tr>{rows}</table>"
    return f"<pre>{json.dumps(data, indent=2, ensure_ascii=False)}</pre>"

urlpatterns = [path("", index)]

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", __name__)
    execute_from_command_line()
