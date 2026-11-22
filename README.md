# The 5-Minute Experiment

A Flask-powered experiment and reflection platform created by DARINGMATES.

## Tech stack
- Python + Flask
- SQLite
- HTML, CSS and vanilla JavaScript

## Run locally

1. Create and activate a virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the app: `python app.py`
4. Open `http://127.0.0.1:5000`.

The app creates its SQLite database at `instance/app.db` automatically.

## Deploy

The repository includes a `Procfile` for platforms that support Procfile-based deployment:

```bash
gunicorn app:app
```

Set the service's build command to `pip install -r requirements.txt` and its start command to `gunicorn app:app` if your host asks for them separately.

**Database note:** SQLite data is stored in `instance/app.db`. Use a host with persistent disk storage mounted at the application instance directory, or migrate to a managed database such as PostgreSQL, before relying on data across deploys/restarts. Do not commit a live database file.

## Tests

Run the smoke tests with:

```bash
python tests.py
```

## Project layout

- `app.py` — Flask routes and API
- `database.py` — SQLite schema and connection helpers
- `templates/` — Jinja templates
- `static/css/` — stylesheets
- `static/js/` — browser-side functionality
- `static/images/` — logo and favicon
- `tests.py` — automated smoke tests

## Team

DARINGMATES — Clement R Pal, Abhijeet Kumar, Amrit Kalash, Anuj China and Ayush Jaiswal.
