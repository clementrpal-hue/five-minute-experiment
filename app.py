"""The 5-Minute Experiment - Flask backend. Created by DARINGMATES."""
import os
import re
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request

import database as db

CATEGORY_IDS = {"observation", "creativity", "memory", "social",
                "productivity", "mindful", "logic", "imagination"}
TAGS = {"very-interesting", "enjoyable", "challenging", "boring", "difficult"}
AGAIN = {"yes", "maybe", "no"}
EXP_ID = re.compile(r"^EXP-\d{3}$")
UID = re.compile(r"^[A-Za-z0-9-]{8,64}$")

TEAM = [
    ("Clement R Pal", "12024002034008"),
    ("Abhijeet Kumar", "12024002034012"),
    ("Amrit Kalash", "12024002034059"),
    ("Anuj China", "12024002034004"),
    ("Ayush Jaiswal", "12024002034024"),
]


def text(value, limit):
    return value.strip()[:limit] if isinstance(value, str) else ""


def is_int(value):
    return isinstance(value, int) and not isinstance(value, bool)


def reflection_to_dict(row):
    d = dict(row)
    d.pop("id", None)
    d["tags"] = [t for t in d["tags"].split(",") if t]
    return d


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)
    app.config["DATABASE"] = os.path.join(app.instance_path, "app.db")
    if test_config:
        app.config.update(test_config)
    db.init_app(app)

    team = [{"name": n, "enrollment": e,
             "initials": "".join(p[0] for p in n.split()[:2]).upper()}
            for n, e in TEAM]

    # ---------------------------------------------------------- pages
    @app.get("/")
    def index():
        return render_template("index.html")

    @app.get("/discover")
    def discover():
        return render_template("discover.html")

    @app.get("/experiment/<exp_id>")
    def experiment(exp_id):
        if not EXP_ID.match(exp_id):
            return render_template("404.html"), 404
        return render_template("experiment.html", exp_id=exp_id)

    @app.get("/reflection/<exp_id>")
    def reflection(exp_id):
        if not EXP_ID.match(exp_id):
            return render_template("404.html"), 404
        return render_template("reflection.html", exp_id=exp_id)

    @app.get("/journal")
    def journal():
        return render_template("journal.html")

    @app.get("/about")
    def about():
        return render_template("about.html", team=team)

    @app.get("/feedback")
    def feedback():
        return render_template("feedback.html")

    @app.get("/privacy")
    def privacy():
        return render_template("privacy.html")

    # ------------------------------------------------------------ API
    @app.get("/api/reflections")
    def api_list_reflections():
        rows = db.get_db().execute(
            "SELECT * FROM reflections ORDER BY created_at DESC, id DESC").fetchall()
        return jsonify(reflections=[reflection_to_dict(r) for r in rows])

    @app.post("/api/reflections")
    def api_add_reflection():
        d = request.get_json(silent=True)
        if not isinstance(d, dict):
            return jsonify(error="Send a JSON body."), 400
        errors = []
        uid = d.get("uid")
        if not isinstance(uid, str) or not UID.match(uid):
            errors.append("uid is missing or invalid")
        exp_id = d.get("experiment_id")
        if not isinstance(exp_id, str) or not EXP_ID.match(exp_id):
            errors.append("experiment_id is missing or invalid")
        title = text(d.get("experiment_title"), 120)
        if not title:
            errors.append("experiment_title is required")
        if d.get("category") not in CATEGORY_IDS:
            errors.append("category is invalid")
        date = d.get("completed_date")
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except (TypeError, ValueError):
            errors.append("completed_date must be YYYY-MM-DD")
        seconds = d.get("duration_seconds", 0)
        if not is_int(seconds) or not 0 <= seconds <= 7200:
            errors.append("duration_seconds must be 0-7200")
        rating = d.get("rating")
        if not is_int(rating) or not 1 <= rating <= 5:
            errors.append("rating must be 1-5")
        experience = text(d.get("experience"), 2000)
        if len(experience) < 3:
            errors.append("experience is required")
        tags = d.get("tags", [])
        if not isinstance(tags, list) or any(t not in TAGS for t in tags):
            errors.append("tags contain an unknown option")
        again = d.get("again", "") or ""
        if again not in AGAIN | {""}:
            errors.append("again must be yes, maybe or no")
        if errors:
            return jsonify(error="; ".join(errors), errors=errors), 400

        conn = db.get_db()
        existing = conn.execute("SELECT * FROM reflections WHERE uid = ?", (uid,)).fetchone()
        if existing:
            return jsonify(reflection=reflection_to_dict(existing), created=False), 200
        created_at = text(d.get("created_at"), 40) or datetime.now(timezone.utc).isoformat()
        conn.execute(
            """INSERT INTO reflections (uid, experiment_id, experiment_title, category,
               completed_date, duration_seconds, experience, surprise, learned, feeling,
               rating, tags, again, suggestion, created_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (uid, exp_id, title, d["category"], date, seconds, experience,
             text(d.get("surprise"), 2000), text(d.get("learned"), 2000),
             text(d.get("feeling"), 2000), rating, ",".join(tags), again,
             text(d.get("suggestion"), 2000), created_at))
        conn.commit()
        row = conn.execute("SELECT * FROM reflections WHERE uid = ?", (uid,)).fetchone()
        return jsonify(reflection=reflection_to_dict(row), created=True), 201

    @app.delete("/api/reflections/<uid>")
    def api_delete_reflection(uid):
        if not UID.match(uid):
            return jsonify(error="Invalid id."), 400
        conn = db.get_db()
        cur = conn.execute("DELETE FROM reflections WHERE uid = ?", (uid,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify(error="Entry not found."), 404
        return jsonify(deleted=True)

    @app.post("/api/feedback")
    def api_add_feedback():
        d = request.get_json(silent=True)
        if not isinstance(d, dict):
            return jsonify(error="Send a JSON body."), 400
        message = text(d.get("message"), 2000)
        rating = d.get("rating")
        errors = []
        if len(message) < 3:
            errors.append("Please write a short message.")
        if rating is not None and (not is_int(rating) or not 1 <= rating <= 5):
            errors.append("rating must be 1-5")
        if errors:
            return jsonify(error=" ".join(errors), errors=errors), 400
        conn = db.get_db()
        conn.execute(
            "INSERT INTO feedback (name, rating, message, created_at) VALUES (?,?,?,?)",
            (text(d.get("name"), 60), rating, message,
             datetime.now(timezone.utc).isoformat()))
        conn.commit()
        return jsonify(saved=True), 201

    # --------------------------------------------------------- errors
    def wants_json():
        return request.path.startswith("/api/")

    @app.errorhandler(404)
    def not_found(_e):
        if wants_json():
            return jsonify(error="Not found."), 404
        return render_template("404.html"), 404

    @app.errorhandler(405)
    def not_allowed(_e):
        if wants_json():
            return jsonify(error="Method not allowed."), 405
        return render_template("404.html"), 405

    @app.errorhandler(500)
    def server_error(_e):
        if wants_json():
            return jsonify(error="Something went wrong on the server."), 500
        return render_template("404.html"), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
