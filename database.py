"""SQLite helpers for The 5-Minute Experiment."""
import sqlite3

from flask import current_app, g

SCHEMA = """
CREATE TABLE IF NOT EXISTS reflections (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    uid              TEXT    NOT NULL UNIQUE,
    experiment_id    TEXT    NOT NULL,
    experiment_title TEXT    NOT NULL,
    category         TEXT    NOT NULL,
    completed_date   TEXT    NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    experience       TEXT    NOT NULL,
    surprise         TEXT    NOT NULL DEFAULT '',
    learned          TEXT    NOT NULL DEFAULT '',
    feeling          TEXT    NOT NULL DEFAULT '',
    rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    tags             TEXT    NOT NULL DEFAULT '',
    again            TEXT    NOT NULL DEFAULT '',
    suggestion       TEXT    NOT NULL DEFAULT '',
    created_at       TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reflections_date ON reflections (completed_date);

CREATE TABLE IF NOT EXISTS feedback (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL DEFAULT '',
    rating     INTEGER,
    message    TEXT    NOT NULL,
    created_at TEXT    NOT NULL
);
"""


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(_exc=None):
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()


def init_db():
    conn = get_db()
    conn.executescript(SCHEMA)
    conn.commit()


def init_app(app):
    app.teardown_appcontext(close_db)
    with app.app_context():
        init_db()
