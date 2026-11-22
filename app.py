"""The 5-Minute Experiment - Flask backend. Created by DARINGMATES."""
import os
import re
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request

import database as db

EXP_ID = re.compile(r"^EXP-\d{3}$")

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
    # Personal reflections are browser-local. These legacy endpoints are
    # deliberately disabled so old clients cannot expose shared journal data.
    @app.route("/api/reflections", methods=["GET", "POST"])
    def api_reflections_disabled():
        return jsonify(error="Personal reflections are stored only in your browser."), 410

    @app.delete("/api/reflections/<uid>")
    def api_delete_reflection_disabled(uid):
        return jsonify(error="Personal reflections are stored only in your browser."), 410

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
