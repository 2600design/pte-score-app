#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-8000}"
UVICORN_BIN="${UVICORN_BIN:-./.venv/bin/uvicorn}"