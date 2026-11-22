"""Smoke tests: python tests.py"""
import os
import re
import tempfile
import unittest

from app import create_app


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
        for url in ["/", "/discover", "/experiment/EXP-001", "/reflection/EXP-001",
                    "/journal", "/about", "/feedback", "/privacy"]:
            html = self.c.get(url).get_data(as_text=True)
            for ref in set(re.findall(r'(?:href|src)="(/[^"#?]*)', html)):
                resp = self.c.get(ref)
                self.assertEqual(resp.status_code, 200, f"{url} -> {ref}")
                resp.close()

    def test_about_team(self):
        html = self.c.get("/about").get_data(as_text=True)
        for n in ["12024002034008", "12024002034012", "12024002034059",
                  "12024002034004", "12024002034024"]:
            self.assertIn(n, html)

    def test_legacy_reflection_api_is_disabled(self):
        self.assertEqual(self.c.get("/api/reflections").status_code, 410)
        self.assertEqual(self.c.post("/api/reflections", json={"experience": "private"}).status_code, 410)
        self.assertEqual(self.c.delete("/api/reflections/abc12345-def").status_code, 410)

    def test_feedback(self):
        self.assertEqual(self.c.post("/api/feedback", json={"message": "Great site", "rating": 4}).status_code, 201)
        self.assertEqual(self.c.post("/api/feedback", json={"message": "Great"}).status_code, 201)
        self.assertEqual(self.c.post("/api/feedback", json={"message": ""}).status_code, 400)
        self.assertEqual(self.c.post("/api/feedback", json={"message": "ok ok", "rating": 9}).status_code, 400)


if __name__ == "__main__":
    unittest.main(verbosity=1)
