#!/usr/bin/env bash
# Package the Alarmo ext build:  tools/package.sh <version, e.g. 1.10.19+ext.5>
# Bumps the version in the 3 places, builds + checks the frontend, runs the tests,
# writes <repo>/release/alarmo-v<ver>.zip (version with + replaced by -), moves older ZIPs to archive/
# (not /shared/user: its root is kept free of build copies)
# and verifies the unzipped copy.
set -euo pipefail
VER="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CC="$ROOT/custom_components/alarmo"
FE="$CC/frontend"
ZIPNAME="alarmo-v${VER/+/-}.zip"
mkdir -p "$ROOT/release"
OUT="$ROOT/release/$ZIPNAME"
export UV_PROJECT_ENVIRONMENT="$HOME/.venvs/alarmo" TERM=dumb

python3 - "$VER" "$CC" <<'EOF'
import re, sys
ver, cc = sys.argv[1], sys.argv[2]
def sub(path, pattern, repl):
    s = open(path, newline="").read()
    s2, n = re.subn(pattern, repl, s, count=1, flags=re.M)
    assert n == 1, (path, pattern)
    open(path, "w", newline="").write(s2)
sub(f"{cc}/const.py", r'^VERSION = "[^"]+"', f'VERSION = "{ver}"')
sub(f"{cc}/manifest.json", r'"version": "[^"]+"', f'"version": "{ver}"')
sub(f"{cc}/frontend/src/const.ts", r"^export const VERSION = '[^']+';", f"export const VERSION = '{ver}';")
EOF

(cd "$FE" && npm run build > /tmp/build.log 2>&1)
if grep -q "TS[0-9]" /tmp/build.log; then grep "TS[0-9]" /tmp/build.log; echo "TypeScript warnings"; exit 1; fi
grep -q "$VER" "$FE/dist/alarm-panel.js"
node --check "$FE/dist/alarm-panel.js"
node /shared/user/code/_tests/probe.mjs "$FE/dist/alarm-panel.js" alarm-panel alarm-view-general \
  alarm-view-actions alarm-view-sensors alarm-view-sensor-table alarm-view-backup alarm-view-codes \
  alarm-view-panel alarm-view-house alarm-view-mirrors alarm-view-connections alarm-view-ha-zones | head -1
(cd "$FE" && npm test 2>&1 | grep -E "^ℹ (pass|fail)")
(cd "$ROOT" && uv run ruff check custom_components/alarmo tests tools | tail -1)
(cd "$ROOT" && uv run pytest -q -p no:cacheprovider 2>&1 | tail -1)

mkdir -p "$ROOT/archive"
for z in "$ROOT"/release/alarmo-v*.zip /shared/user/alarmo-v*.zip; do
  [ -e "$z" ] && [ "$z" != "$OUT" ] && mv "$z" "$ROOT/archive/"
done
find "$ROOT/custom_components" -name __pycache__ -type d -prune -exec rm -rf {} +
rm -f "$OUT"
EXTRA=""; [ -d "$ROOT/blueprints" ] && EXTRA="blueprints"
(cd "$ROOT" && zip -qr "$OUT" custom_components/alarmo CHANGELOG.md INSTALL-EXT.md HOUSE-MODES.md MIGRATION.md README.md LICENSE hacs.json $EXTRA \
  -x 'custom_components/alarmo/frontend/node_modules/*' -x 'custom_components/alarmo/frontend/test/*' \
  -x '*/__pycache__/*' -x '*.pyc' -x '*/package-lock.json' -x '*.DS_Store')
if unzip -l "$OUT" | grep -qE "node_modules|__pycache__|\.pyc|package-lock|/test/|tools/|PLAN-|ROADMAP|archive/|release/|configs/|logs/|_automations/"; then
  echo "unwanted files in ZIP"; exit 1
fi
TMP="$(mktemp -d)"
(cd "$TMP" && unzip -q "$OUT" && "$HOME/.venvs/alarmo/bin/python" -m py_compile custom_components/alarmo/*.py \
  && grep -q "\"version\": \"$VER\"" custom_components/alarmo/manifest.json \
  && grep -q "STORAGE_VERSION_MAJOR = 6" custom_components/alarmo/store.py \
  && cmp custom_components/alarmo/frontend/dist/alarm-panel.js "$FE/dist/alarm-panel.js")
rm -rf "$TMP"
echo "OK $OUT"
