# The 5-Minute Experiment

**Five Minutes. One New Experience. A Different You.**

A Flask + SQLite + vanilla JavaScript project featuring 48 original experiments, a countdown timer, reflections, a journal, a random experiment wheel, mystery mode, streaks, and weekly goals.

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

4. Open http://127.0.0.1:5000 in your browser. Stop the server with `Ctrl+C`.

## Data storage

- Journal, favourites, and goals use browser local storage.
- Reflections and feedback are also saved to `instance/app.db`, which is created automatically.

## Tests

Run `python tests.py` after installing the requirements.

## Project structure

- `app.py` — Flask routes and API
- `database.py` — SQLite helpers
- `templates/` — HTML templates
- `static/css/` — styles
- `static/js/` — experiment data, timer, journal, reflection, and shared frontend logic
- `static/images/` — logo and favicon

> **Source upload status:** This repository currently contains the README only. The application source files from the project ZIP still need to be added.
