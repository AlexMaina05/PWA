# Installation Instructions

This PWA (Progressive Web App) password manager requires JavaScript libraries to function properly.

## Required Libraries

The application needs the following libraries in the `./libs/` directory:

- `dexie.min.js` - IndexedDB wrapper for local storage
- `argon2.min.js` - Argon2 password hashing library
- `argon2.wasm` - WebAssembly module for Argon2
- `zxcvbn.js` - Password strength estimation

## Setup Steps

### Option 1: Using the download script (Recommended)

1. Make the script executable:
   ```bash
   chmod +x download_libs.sh
   ```

2. Run the script to download all required libraries:
   ```bash
   ./download_libs.sh
   ```

3. Verify the files were downloaded:
   ```bash
   ls -la libs/
   ```

### Option 2: Manual download

If you can't use the script, download these files manually:

1. **Dexie.js** (v3.2.2):
   - URL: https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.min.js
   - Save to: `./libs/dexie.min.js`

2. **Argon2 JS** (latest):
   - URL: https://cdn.jsdelivr.net/npm/argon2-browser/dist/argon2.min.js
   - Save to: `./libs/argon2.min.js`

3. **Argon2 WASM** (latest):
   - URL: https://cdn.jsdelivr.net/npm/argon2-browser/dist/argon2.wasm
   - Save to: `./libs/argon2.wasm`

4. **zxcvbn** (v4.4.2):
   - URL: https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js
   - Save to: `./libs/zxcvbn.js`

## Deployment

After downloading the libraries:

1. **For GitHub Pages**:
   - Commit the `libs/` folder to your repository
   - Enable GitHub Pages in repository settings
   - Set source to main branch, root directory

2. **For local testing**:
   - Start a local web server (HTTPS required for full PWA features):
     ```bash
     python3 -m http.server 8080
     ```
   - Open http://localhost:8080 in your browser

3. **For production**:
   - Ensure all files are served over HTTPS
   - The Service Worker will cache files for offline use
   - Update `CACHE_NAME` in `sw.js` when updating libraries

## Security Notes

- Keep libraries up to date for security patches
- Verify library integrity before deployment
- Never expose sensitive data or API keys
- Test thoroughly before production use

## Troubleshooting

**CSS not loading?**
- Check that `styles.css` exists and is accessible
- Verify no browser console errors
- Clear browser cache and reload

**JavaScript errors?**
- Verify all library files are in `./libs/` directory
- Check browser console for specific errors
- Ensure libraries are the correct versions

**PWA not installing?**
- HTTPS is required (except localhost)
- Check manifest.json is valid
- Verify service worker is registered
- Check browser DevTools > Application tab
