#!/bin/bash

set -Eeuo pipefail
shopt -s nullglob inherit_errexit 2> /dev/null || true
IFS=$'\n\t'

#─── logging helpers ─────────────────────────────────────────────────────────────
log() { printf "\033[1;34m[%(%H:%M:%S)T INFO]\033[0m %s\n" -1 "$*"; }
err() { printf "\033[1;31m[%(%H:%M:%S)T ERRO]\033[0m %s\n" -1 "$*" >&2; }
trap 'err "Command \"${BASH_COMMAND}\" failed at line ${LINENO}."' ERR

#─── prerequisite binaries ───────────────────────────────────────────────────────
for bin in mc; do
  command -v "$bin" &> /dev/null || {
    err "Required command '$bin' not found"
    exit 1
  }
done

# ────────────────────────────── CONFIG VIA ENV ────────────────────────────────
PMTILES_DIR=${PMTILES_DIR:-/pmtiles-data}
MINIO_ALIAS=${MINIO_ALIAS:-bucketer}
MINIO_ENDPOINT=${MINIO_ENDPOINT:-http://minio:9000}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-minio}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-minio123}
MINIO_BUCKET=${MINIO_BUCKET:-vaam-eat}
DEST_PREFIX=${DEST_PREFIX:-maps}
CACHE_CONTROL=${CACHE_CONTROL:-public,max-age=31536000,immutable}
SKIP_EXISTING=${SKIP_EXISTING:-false}

# ───────────────────────────────────────────────────────────────────────────────
log "Configuring mc alias '$MINIO_ALIAS' → $MINIO_ENDPOINT"
mc alias set "$MINIO_ALIAS" "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" --quiet

log "Waiting for bucket '$MINIO_BUCKET' on $MINIO_ALIAS…"
until mc ls "$MINIO_ALIAS/$MINIO_BUCKET" > /dev/null 2>&1; do sleep 1; done
log "Bucket '$MINIO_BUCKET' is ready."

files=("$PMTILES_DIR"/*.pmtiles)
if ((${#files[@]} == 0)); then
  log "No .pmtiles files found in $PMTILES_DIR — nothing to upload."
  exit 0
fi

for filepath in "${files[@]}"; do
  filename=$(basename "$filepath")
  dest="$MINIO_ALIAS/$MINIO_BUCKET/$DEST_PREFIX/$filename"

  if [[ $SKIP_EXISTING == true ]] && mc stat "$dest" > /dev/null 2>&1; then
    log "Skipping $filename (already in bucket)"
    continue
  fi

  log "Uploading $filename → $dest"
  mc cp --attr "Cache-Control=$CACHE_CONTROL" "$filepath" "$dest"
  log "✅  Uploaded $filename"
done

log "🎉  All uploads completed."
