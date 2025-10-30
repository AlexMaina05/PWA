#!/usr/bin/env bash
set -e
mkdir -p libs

echo "Downloading Dexie..."
curl -L -o libs/dexie.min.js https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.min.js

echo "Downloading argon2 JS..."
curl -L -o libs/argon2.min.js https://cdn.jsdelivr.net/npm/argon2-browser@1.18.0/dist/argon2.min.js

echo "Downloading argon2 WASM..."
curl -L -o libs/argon2.wasm https://cdn.jsdelivr.net/npm/argon2-browser@1.18.0/dist/argon2.wasm

echo "Downloading zxcvbn..."
curl -L -o libs/zxcvbn.js https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js

echo "All files downloaded to ./libs. Please inspect them and commit to your repo."
