#!/usr/bin/env python3
"""
Prepare photos for the Photos app.

    pip install pillow pillow-heif
    python3 tools/add-photos.py

Reads every image in photos-src/ (HEIC, JPG, PNG, WebP), and writes:
  - src/assets/photos/<name>.webp         full image, longest side 1800 px
  - src/assets/photos/thumbs/<name>.webp  square thumbnail for the grid, 480 px
  - src/data/photos.json                  date, size and caption per photo, newest last

Dates come from EXIF (DateTimeOriginal). Photos without EXIF (e.g. sent through a messenger) keep
the date already in photos.json, so you can fix it by hand; new ones fall back to the file's mtime.
Captions you add to photos.json by hand are kept on the next run.
Originals in photos-src/ are git-ignored; only the web versions are committed.
"""
import json
import re
import sys
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps

try:
    import pillow_heif

    pillow_heif.register_heif_opener()
except ImportError:
    pass

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-src"
OUT = ROOT / "src/assets/photos"
THUMBS = OUT / "thumbs"
META = ROOT / "src/data/photos.json"
EXTS = {".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp"}


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def exif_date(img: Image.Image) -> str | None:
    exif = img.getexif()
    raw = exif.get_ifd(0x8769).get(36867) or exif.get(306)
    if raw:
        try:
            return datetime.strptime(str(raw).strip(), "%Y:%m:%d %H:%M:%S").isoformat()
        except ValueError:
            pass
    return None


def file_date(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime).replace(microsecond=0).isoformat()


def main() -> int:
    if not SRC.is_dir():
        print(f"Put photos into {SRC.relative_to(ROOT)}/ first.")
        return 1
    OUT.mkdir(parents=True, exist_ok=True)
    THUMBS.mkdir(parents=True, exist_ok=True)

    old = {p["name"]: p for p in json.loads(META.read_text())} if META.exists() else {}
    photos = []

    for path in sorted(SRC.iterdir()):
        if path.suffix.lower() not in EXTS:
            continue
        name = slug(path.stem)
        raw = Image.open(path)
        date = exif_date(raw) or old.get(name, {}).get("date") or file_date(path)
        img = ImageOps.exif_transpose(raw).convert("RGB")

        full = img.copy()
        full.thumbnail((1800, 1800), Image.LANCZOS)
        full.save(OUT / f"{name}.webp", quality=82, method=6)

        side = min(img.size)
        left, top = (img.width - side) // 2, (img.height - side) // 2
        img.crop((left, top, left + side, top + side)).resize((480, 480), Image.LANCZOS).save(
            THUMBS / f"{name}.webp", quality=78, method=6
        )

        photos.append(
            {
                "name": name,
                "date": date,
                "width": full.width,
                "height": full.height,
                "caption": old.get(name, {}).get("caption", ""),
            }
        )
        print(f"✓ {path.name} → {name}  ({date[:10]}, {full.width}×{full.height})")

    photos.sort(key=lambda p: p["date"])
    META.write_text(json.dumps(photos, indent=2, ensure_ascii=False) + "\n")
    print(f"\n{len(photos)} photos written to {META.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
