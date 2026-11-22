# The 5-Minute Experiment

**Five Minutes. One New Experience. A Different You.**  
A Flask + SQLite + vanilla JavaScript project created by **DARINGMATES**.

The app contains 48 experiments, a countdown timer, reflections, a journal, a wheel, mystery mode, streaks and weekly goals.

## Run locally (Windows / VS Code)

1. Install Python 3.10 or newer.
2. Open this project folder in VS Code.
3. Open **Terminal → New Terminal** and run:

```powershell
py -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process Bypass` and activate again.

Open http://127.0.0.1:5000. Stop the server with `Ctrl+C`.

## Project structure

- `app.py` — Flask routes and API
- `database.py` — SQLite database helpers
- `templates/` — Jinja/HTML pages
- `static/js/` — JavaScript files
- `static/css/` — stylesheets
- `static/images/` — logo and favicon
- `instance/` — local SQLite database (created automatically)

## Data storage

- Journal, favourites and goals use browser local storage.
- Reflections and feedback are also stored in `instance/app.db`.

## Tests

Run `python tests.py`.

## Deployment

For a production deployment, use a persistent disk for `instance/app.db` if you want SQLite data to survive redeployments. Configure a production WSGI server (such as Gunicorn) and a suitable start command on your hosting provider. Do not use Flask's development server in production.
