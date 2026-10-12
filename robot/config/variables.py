"""Read the local test account; keep passwords out of Robot variable logs."""
import json
import os
from pathlib import Path

ACCOUNT_FILE = Path(__file__).with_name("account.local.json")
DEFAULT_BASE_URL = "https://share-ed.online/"


def _read_account():
    if not ACCOUNT_FILE.exists():
        return {}
    try:
        account = json.loads(ACCOUNT_FILE.read_text(encoding="utf-8-sig"))
    except (json.JSONDecodeError, UnicodeError):
        raise ValueError("robot/config/account.local.json ต้องเป็น JSON ที่ถูกต้อง") from None
    if not isinstance(account, dict):
        raise ValueError("robot/config/account.local.json ต้องเป็น JSON object")
    for field in ("email", "password", "base_url"):
        if field in account and not isinstance(account[field], str):
            raise ValueError(f"ฟิลด์ {field} ใน robot/config/account.local.json ต้องเป็นข้อความ")
    return account


def get_variables():
    use_local_file = ACCOUNT_FILE.exists()
    account = _read_account()
    if use_local_file:
        # A saved account is authoritative; stale CMD values must not replace it.
        email = account.get("email", "")
        password = account.get("password", "")
        base_url = account.get("base_url") or DEFAULT_BASE_URL
    else:
        email = os.environ.get("TEST_EMAIL", "")
        password = os.environ.get("TEST_PASSWORD", "")
        base_url = os.environ.get("BASE_URL") or DEFAULT_BASE_URL
    if password:
        # Fill Secret reads this environment variable without exposing its value.
        os.environ["TEST_PASSWORD"] = password
    else:
        os.environ.pop("TEST_PASSWORD", None)
    return {"TEST_EMAIL": email, "BASE_URL": base_url}
