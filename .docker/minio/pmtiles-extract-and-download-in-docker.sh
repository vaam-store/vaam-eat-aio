#!/usr/bin/env bash
#
# extract_pmtiles.sh ─ Slice global .pmtiles basemap into city‑level extracts.
#
# This script runs as the container *entrypoint* and is designed to be as
# predictable as possible:
#   • No implicit package installs at runtime
#   • Coloured, timestamped logging
#   • Caching of the go‑pmtiles CLI between runs
#   • Robust error handling while still printing a helpful stack‑trace
#
# ──────────────────────────────── CONFIG VIA ENV ────────────────────────────────
#   GO_PMTILES_VERSION – SemVer tag of go-pmtiles to download      (default 1.28.0)
#   BASEMAP_URL        – Source .pmtiles file                      (default 2025‑06‑15 build)
#   PMTILES_DATA_DIR   – Target directory for extracted tiles      (default /pmtiles-data)
#   BBOXES             – New‑line separated "name:minLon,minLat,maxLon,maxLat"
#   SKIP_EXISTING      – true → skip if target exists              (default false)
#   PMTILES_CACHE_DIR  – Directory to cache the CLI binary         (default /tmp/pmtiles-cache)
# ────────────────────────────────────────────────────────────────────────────────

set -Eeuo pipefail
shopt -s inherit_errexit 2> /dev/null || true # Bash <5.0 compatibility
IFS=$'\n\t'

#─── logging helpers ─────────────────────────────────────────────────────────────
log() { printf "\033[1;34m[%(%H:%M:%S)T INFO]\033[0m %s\n" -1 "$*"; }
err() { printf "\033[1;31m[%(%H:%M:%S)T ERRO]\033[0m %s\n" -1 "$*" >&2; }
trap 'err "Command \"${BASH_COMMAND}\" failed at line ${LINENO}."' ERR

#─── prerequisite binaries ───────────────────────────────────────────────────────
for bin in curl tar uname mktemp; do
  command -v "$bin" &> /dev/null || {
    err "Required command '$bin' not found"
    exit 1
  }
done

#─── user‑tweakable knobs ────────────────────────────────────────────────────────
GO_PMTILES_VERSION=${GO_PMTILES_VERSION:-1.28.0}
BASEMAP_URL=${BASEMAP_URL:-"https://build.protomaps.com/20250615.pmtiles"}
PMTILES_DATA_DIR=${PMTILES_DATA_DIR:-/pmtiles-data}
SKIP_EXISTING=${SKIP_EXISTING:-false}
CACHE_DIR=${PMTILES_CACHE_DIR:-/tmp/pmtiles-cache}

#─── default bbox list ───────────────────────────────────────────────────────────
read -r -d '' _DEFAULT_BBOXES || true # ignore the expected "read" non‑zero status
_DEFAULT_BBOXES="$(
  cat << 'EOF'
germany-baden-wuerttemberg-v1:7.456,47.530,10.472,49.808
germany-bavaria-v1:9.221,47.270,13.622,50.562
germany-berlin-v1:13.090,52.330,13.760,52.650
germany-brandenburg-v1:11.350,51.310,14.450,53.560
germany-bremen-v1:8.370,52.300,8.930,53.120
germany-hamburg-v1:9.650,53.280,10.350,53.750
germany-hessen-v1:7.900,49.170,10.240,51.650
germany-mecklenburg-vorpommern-v1:10.090,53.250,14.800,54.350
germany-niedersachsen-v1:6.020,51.270,11.120,53.720
germany-nordrhein-westfalen-v1:5.870,50.330,9.540,52.740
germany-rheinland-pfalz-v1:5.520,48.930,8.380,50.560
germany-saarland-v1:6.320,48.080,7.140,49.030
germany-sachsen-v1:11.795,50.160,15.042,51.705
germany-sachsen-anhalt-v1:10.513,50.900,13.368,53.071
germany-schleswig-holstein-v1:8.090,53.420,11.000,55.060
germany-thueringen-v1:9.640,50.200,12.170,51.730
cameroon-adamawa-v1:10.991,5.790,15.380,8.333
cameroon-centre-v1:10.044,2.910,13.408,6.440
cameroon-east-v1:12.260,1.390,16.430,6.246
cameroon-far-north-v1:13.065,9.800,15.895,13.240
cameroon-littoral-v1:9.190,3.123,11.190,5.440
cameroon-north-v1:12.039,6.780,15.800,10.452
cameroon-north-west-v1:9.455,5.570,11.330,7.275
cameroon-south-v1:9.540,2.000,13.820,3.820
cameroon-south-west-v1:8.305,3.643,10.250,6.685
cameroon-west-v1:9.712,4.722,11.444,6.396
EOF
)"
BBOXES=${BBOXES:-${_DEFAULT_BBOXES}}

#─── map kernel arch → release suffix ───────────────────────────────────────────
case "$(uname -m)" in
  x86_64 | amd64) GO_PMTILES_ARCH="Linux_x86_64" ;;
  aarch64 | arm64) GO_PMTILES_ARCH="Linux_arm64" ;;
  *)
    err "Unsupported architecture $(uname -m)"
    exit 1
    ;;
esac

mkdir -p "$CACHE_DIR"
CLI_PATH="$CACHE_DIR/pmtiles-${GO_PMTILES_VERSION}-$(uname -m)"

#─── download CLI if missing ─────────────────────────────────────────────────────
if [[ ! -x $CLI_PATH ]]; then
  RELEASE_URL="https://github.com/protomaps/go-pmtiles/releases/download/v${GO_PMTILES_VERSION}/go-pmtiles_${GO_PMTILES_VERSION}_${GO_PMTILES_ARCH}.tar.gz"
  TMP_DIR=$(mktemp -d)
  trap 'rm -rf "${TMP_DIR}"' RETURN
  log "Downloading go‑pmtiles v${GO_PMTILES_VERSION} (arch: $(uname -m))…"
  curl --fail --location --progress-bar "$RELEASE_URL" -o "${TMP_DIR}/pmtiles.tgz"
  tar -xzf "${TMP_DIR}/pmtiles.tgz" -C "$TMP_DIR"
  mv "${TMP_DIR}/pmtiles" "$CLI_PATH"
  chmod +x "$CLI_PATH"
else
  log "Using cached go‑pmtiles CLI → $CLI_PATH"
fi

mkdir -p "$PMTILES_DATA_DIR"

#─── extraction loop ─────────────────────────────────────────────────────────────
while IFS= read -r entry; do
  [[ -z $entry ]] && continue # skip empty lines
  IFS=':' read -r name bbox <<< "$entry"
  TARGET="${PMTILES_DATA_DIR}/${name}.pmtiles"

  if [[ $SKIP_EXISTING == true && -f $TARGET ]]; then
    log "Skipping $name (already exists)"
    continue
  fi

  log "Extracting '$name' → $TARGET"
  "$CLI_PATH" extract "$BASEMAP_URL" "$TARGET" --bbox="$bbox"
  log "✅  Finished $name"

done <<< "$BBOXES"

log "🎉  All extracts completed. Output in $PMTILES_DATA_DIR"
