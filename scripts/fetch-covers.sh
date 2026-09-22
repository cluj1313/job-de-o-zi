#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/public/covers"
ASSETS="$ROOT/public/assets"
mkdir -p "$DIR" "$ASSETS"
UA="Mozilla/5.0 job-de-o-zi-build"
fetch() {
  local out="$1" url="$2"
  echo "fetch $out"
  curl -fsSL -A "$UA" -o "$DIR/$out" "$url"
}
decode_b64() {
  local src="$1" dest="$2"
  if [[ -f "$src" ]]; then
    echo "decode $(basename "$src") → $dest"
    tr -d '\n\r \t' < "$src" | base64 -d > "$dest"
  fi
}
decode_b64 "$ROOT/scripts/pitch-thumb.b64" "$ASSETS/pitch-thumb.jpg"
decode_b64 "$ROOT/scripts/produse-hub.b64" "$ASSETS/produse-hub.jpg"

# Assemble pocket-watch collage from r00-r15 (strip whitespace; validate JPEG)
if [[ -f "$ROOT/scripts/home.b64.r00" && -f "$ROOT/scripts/home.b64.r15" ]]; then
  echo "assemble home.jpg from pocket-watch collage r-parts"
  if ! ROOT="$ROOT" DIR="$DIR" python3 - <<'PY'
import base64, os, pathlib, sys
root = pathlib.Path(os.environ["ROOT"])
out = pathlib.Path(os.environ["DIR"]) / "home.jpg"
parts = []
for i in range(16):
    p = root / "scripts" / f"home.b64.r{i:02d}"
    if not p.is_file():
        print(f"missing {p}", file=sys.stderr)
        sys.exit(2)
    parts.append("".join(p.read_text().split()))
try:
    data = base64.b64decode("".join(parts), validate=True)
except Exception as e:
    print(f"base64 decode failed: {e}", file=sys.stderr)
    sys.exit(3)
if data[:3] != b"\xff\xd8\xff":
    print("decoded home.jpg is not JPEG", file=sys.stderr)
    sys.exit(4)
out.write_bytes(data)
print(f"wrote {out} ({len(data)} bytes)")
PY
  then
    if [[ -f "$DIR/home.jpg" && $(wc -c < "$DIR/home.jpg") -gt 10000 ]]; then
      echo "WARN: r-parts failed; keeping committed public/covers/home.jpg"
    elif [[ -f "$ASSETS/cover-home.jpg" && $(wc -c < "$ASSETS/cover-home.jpg") -gt 10000 ]]; then
      echo "WARN: r-parts failed; using assets/cover-home.jpg"
      cp "$ASSETS/cover-home.jpg" "$DIR/home.jpg"
    else
      echo "ERROR: missing pocket-watch collage" >&2
      exit 1
    fi
  fi
elif [[ -f "$DIR/home.jpg" && $(wc -c < "$DIR/home.jpg") -gt 10000 ]]; then
  echo "keep committed public/covers/home.jpg"
elif [[ -f "$ASSETS/cover-home.jpg" && $(wc -c < "$ASSETS/cover-home.jpg") -gt 10000 ]]; then
  cp "$ASSETS/cover-home.jpg" "$DIR/home.jpg"
else
  echo "ERROR: missing pocket-watch collage" >&2
  exit 1
fi
cp "$DIR/home.jpg" "$ASSETS/cover-home.jpg"
fetch construction.jpg "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
fetch catering.jpg "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
fetch warehouse.jpg "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"
fetch painting.jpg "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80"
fetch moving.jpg "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80"
fetch care.jpg "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80"
fetch cleaning.jpg "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
fetch hostess.jpg "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
fetch gardening.jpg "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80"
ls -la "$DIR" "$ASSETS"
