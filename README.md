# ARIF-LAB INVENTORY (LabChem Search)

A high-performance, lightweight, client-side static web application for searching laboratory chemicals, glassware, and equipment.

---

## Features

- 🔬 **Intelligent Search**: Instant multi-term search across chemical names, formulas (e.g. `NaCl`, `AgNO3`, `AlCl3`), item numbers, storage blocks, grades, and notes.
- 📦 **Complete Inventory**: Verified database of all 301 chemical, glassware, and equipment records across Storage Blocks 1–8 and Cupboards.
- 🏷️ **Categorization & Filtering**: Filter by Category (Chemicals, Glassware, Equipment, Other), Storage Block, and Grade (AR, Extra Pure, GR, Pure, Practical, Polymer, Metal, Borosilicate, Class A).
- 📊 **Metric Dashboard**: Real-time stats showing total database count, storage locations, high-purity AR grade reagents, and bottles with specified stock.
- 🗂️ **Dual View Modes**: Switch seamlessly between interactive Card Grid view and Dense Table view.
- 📋 **Item Details & Safety**: Comprehensive modal with molecular formula copy, PubChem chemical search link, storage rules, and hazard handling guidance.
- 💾 **Data Export**: Export filtered or full catalog to CSV spreadsheet, JSON, or print-ready laboratory slips.
- 🌓 **Dark / Light Mode**: Persistent theme toggle respecting system preferences.
- 🚀 **Zero Dependency Static Architecture**: Works straight in the browser with no build tools, Node servers, or backend databases required.

---

## Project Structure

```
labchem-search/
│
├── index.html          # Main application entry point
├── style.css           # Laboratory UI styling & dark mode
├── app.js              # Pure vanilla JavaScript client engine
│
├── data/
│   ├── inventory.js    # Browser-loaded inventory (assigns window.LAB_INVENTORY)
│   └── inventory.json  # Portable JSON database
│
├── wrangler.toml       # Cloudflare Wrangler deployment configuration
├── wrangler.json       # Cloudflare JSON configuration
├── START_LOCAL.bat     # 1-click Windows local runner
└── README.md           # Documentation
```

---

## Local Development & Testing

### Option 1: Double-click / Open directly
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari). `data/inventory.js` is loaded via standard `<script>` tag, so no web server is strictly required.

### Option 2: Windows 1-Click Launch
Double-click `START_LOCAL.bat`. It will start a local HTTP server on `http://localhost:8000` if Python is installed, or launch `index.html` directly in your default browser.

### Option 3: Python Local Server
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## Cloudflare Deployment

This application is 100% static and requires **no build step**.

### Method 1: Cloudflare Pages (Recommended via GitHub)

1. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository.
3. Configure the Build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave blank or `npm run build`)*
   - **Build output directory**: `.` (or `/`)
4. Click **Save and Deploy**.

### Method 2: Cloudflare Workers / Wrangler CLI

Deploy directly using Wrangler:
```bash
npx wrangler deploy
```
Or for Cloudflare Pages direct upload:
```bash
npx wrangler pages deploy . --project-name=labchem-search
```

---

## License

Internal Laboratory Inventory Management System.
