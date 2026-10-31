#!/usr/bin/env python3
"""
Brightloop Subscription Management System - Database Reset Script
Safely drops all database tables for local development / testing reset.

SAFETY CONSTRAINTS:
1. STRICTLY REFUSES to run in production environments (ENV=production).
2. Requires explicit command-line confirmation flag: --confirm-reset.

Usage:
    python reset_db.py --confirm-reset
"""
import sys
import argparse
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base


def reset_database(force: bool = False):
    print("=" * 70)
    print("  BRIGHTLOOP DATABASE RESET UTILITY")
    print("=" * 70)

    # 1. Production safety check
    if settings.is_production:
        print("[CRITICAL ERROR] Execution blocked!")
        print("[!] Cannot reset database in PRODUCTION environment (ENV=production).")
        print("[!] Aborting immediately to prevent catastrophic data loss.")
        sys.exit(1)

    # 2. Explicit confirmation verification
    if not force:
        print("[!] Missing required confirmation flag: --confirm-reset")
        print("Usage: python reset_db.py --confirm-reset")
        sys.exit(1)

    print(f"Target Database URL: {settings.get_normalized_database_url()}")
    confirmation = input("Type 'RESET_BRIGHTLOOP' to confirm complete schema wipe: ").strip()
    if confirmation != "RESET_BRIGHTLOOP":
        print("[!] Confirmation text did not match. Reset cancelled.")
        sys.exit(0)

    print("--> Dropping all tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("[OK] All database tables successfully dropped.")
        print("[INFO] You can now re-initialize using: python init_db.py --seed")
    except Exception as e:
        print(f"[!] Error during database reset: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Reset database schema (development only)")
    parser.add_argument(
        "--confirm-reset",
        action="store_true",
        help="Explicit confirmation flag required to execute table drop",
    )
    args = parser.parse_args()

    reset_database(force=args.confirm_reset)


if __name__ == "__main__":
    main()
