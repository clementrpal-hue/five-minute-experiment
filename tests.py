"""Smoke tests: python tests.py"""
import os
import re
import tempfile
import unittest

from app import create_app

GOOD = {
    "uid": "abc12345-def", "experiment_id": "EXP-001", "experiment_title": "The Colour Hunt",
    "category": "observation", "completed_date": "2026-11-22", "duration_seconds": 300,
    "experience": "Saw a lot of blue", "surprise": "", "learned": "", "feeling": "",
    "rating": 5, "tags": ["enjoyable"], "again": "yes", "suggestion": "",
}


class AppTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.dir.name, "t.db")
        self.app = create_app({"DATABASE": self.path, "TESTING": True})
        self.c = self.app.test_client()

    def tearDown(self):
        self.dir.cleanup()

    def test_pages(self):
        for url in ["/", "/discover", "/experiment/EXP-001", "/reflection/EXP-048",
                    "/journal", "/about", "/feedback", "/privacy"]:
            r = self.c.get(url)
            self.assertEqual(r.status_code, 200, url)
        self.assertEqual(self.c.get("/experiment/bad").status_code, 404)
        self.assertEqual(self.c.get("/nope").status_code, 404)

    def test_static_and_links(self):
        html = ""
        for url in ["/", "/discover", "/experiment/EXP-001", "/reflection/EXP-001",
                    "/journal", "/about", "/feedback", "/privacy"]:
            html = self.c.get(url).get_data(as_text=True)
            for ref in set(re.findall(r'(?:href|src)="(/[^"#?]*)', html)):
                resp = self.c.get(ref); self.assertEqual(resp.status_code, 200, f"{url} -> {ref}"); resp.close()

    def test_about_team(self):
        html = self.c.get("/about").get_data(as_text=True)
        for n in ["12024002034008", "12024002034012", "12024002034059", "12024002034004", "12024002034024"]:
            self.assertIn(n, html)

    def test_reflection_roundtrip_and_persistence(self):
        r = self.c.post("/api/reflections", json=GOOD)
        self.assertEqual(r.status_code, 201)
        self.assertEqual(self.c.post("/api/reflections", json=GOOD).status_code, 200)  # idempotent
        app2 = create_app({"DATABASE": self.path, "TESTING": True})  # simulated restart
        rows = app2.test_client().get("/api/reflections").get_json()["reflections"]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["tags"], ["enjoyable"])
        self.assertEqual(self.c.delete("/api/reflections/abc12345-def").status_code, 200)
        self.assertEqual(self.c.delete("/api/reflections/abc12345-def").status_code, 404)
        self.assertEqual(self.c.get("/api/reflections").get_json()["reflections"], [])

    def test_validation(self):
        for bad in [{**GOOD, "rating": 6}, {**GOOD, "rating": True}, {**GOOD, "experiment_id": "x"},
                    {**GOOD, "category": "zzz"}, {**GOOD, "experience": ""}, {**GOOD, "tags": ["nope"]},
                    {**GOOD, "completed_date": "22/11/2026"}, {**GOOD, "duration_seconds": -1},
                    {**GOOD, "again": "later"}, {**GOOD, "uid": "bad uid!"}]:
            self.assertEqual(self.c.post("/api/reflections", json=bad).status_code, 400, bad)
        self.assertEqual(self.c.post("/api/reflections", data="x").status_code, 400)

    def test_script_text_is_stored_as_text(self):
        self.c.post("/api/reflections", json={**GOOD, "experience": "<script>alert(1)</script>"})
        row = self.c.get("/api/reflections").get_json()["reflections"][0]
        self.assertEqual(row["experience"], "<script>alert(1)</script>")  # escaped at render time in JS

    def test_feedback(self):
        self.assertEqual(self.c.post("/api/feedback", json={"message": "Great site", "rating": 4}).status_code, 201)
        self.assertEqual(self.c.post("/api/feedback", json={"message": "Great"}).status_code, 201)
        self.assertEqual(self.c.post("/api/feedback", json={"message": ""}).status_code, 400)
        self.assertEqual(self.c.post("/api/feedback", json={"message": "ok ok", "rating": 9}).status_code, 400)


if __name__ == "__main__":
    unittest.main(verbosity=1)
