"""Check local account priority, environment fallback and invalid settings."""
import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "account_variables", Path(__file__).resolve().parents[1] / "config" / "variables.py"
)
config = importlib.util.module_from_spec(spec)
spec.loader.exec_module(config)


class AccountConfigTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.account_file = Path(temp.name) / "account.local.json"
        account_patch = patch.object(config, "ACCOUNT_FILE", self.account_file)
        account_patch.start()
        self.addCleanup(account_patch.stop)
        env_patch = patch.dict(os.environ, {}, clear=True)
        env_patch.start()
        self.addCleanup(env_patch.stop)

    def test_local_file_loads_without_cmd_settings_and_keeps_password_out_of_variables(self):
        self.account_file.write_text(json.dumps({
            "email": "local@example.test", "password": "local-secret",
            "base_url": "https://local.example.test/",
        }), encoding="utf-8-sig")
        result = config.get_variables()
        self.assertEqual(result, {
            "TEST_EMAIL": "local@example.test", "BASE_URL": "https://local.example.test/",
        })
        self.assertEqual(os.environ["TEST_PASSWORD"], "local-secret")
        self.assertNotIn("TEST_PASSWORD", result)

    def test_local_file_overrides_stale_cmd_account_and_url(self):
        self.account_file.write_text(json.dumps({
            "email": "local@example.test", "password": "local-secret",
        }), encoding="utf-8")
        os.environ.update(TEST_EMAIL="env@example.test", TEST_PASSWORD="env-secret",
                          BASE_URL="https://env.example.test/")
        self.assertEqual(config.get_variables(), {
            "TEST_EMAIL": "local@example.test", "BASE_URL": config.DEFAULT_BASE_URL,
        })
        self.assertEqual(os.environ["TEST_PASSWORD"], "local-secret")

    def test_incomplete_local_file_does_not_use_an_old_password(self):
        self.account_file.write_text('{"email":"local@example.test"}', encoding="utf-8")
        os.environ["TEST_PASSWORD"] = "stale-secret"
        config.get_variables()
        self.assertNotIn("TEST_PASSWORD", os.environ)

    def test_missing_file_allows_environment_account_and_default_url(self):
        os.environ.update(TEST_EMAIL="env@example.test", TEST_PASSWORD="env-secret")
        self.assertEqual(config.get_variables(), {
            "TEST_EMAIL": "env@example.test", "BASE_URL": config.DEFAULT_BASE_URL,
        })

    def test_invalid_file_reports_setting_error_without_echoing_its_secret(self):
        self.account_file.write_text('{"password":"hidden-secret",}', encoding="utf-8")
        with self.assertRaises(ValueError) as error:
            config.get_variables()
        self.assertNotIn("hidden-secret", str(error.exception))
        self.account_file.write_text('{"email":123}', encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "email"):
            config.get_variables()


if __name__ == "__main__":
    unittest.main()
