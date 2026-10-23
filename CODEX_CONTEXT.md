# 📘 CODEX MASTER ARCHITECTURE & CONTEXT MANUAL
## PS Billing Desktop System — Complete Technical Reference

> **Target Audience:** OpenAI Codex, Cursor, Claude, Antigravity, GitHub Copilot, and human developers.  
> **Repository:** `ps-billing-system` (`c:\Users\tarun\Downloads\COLLEGE\projects\ps`)  
> **Production App Folder:** `tari/`  
> **Store Name:** Sri Perumal Stores (ஸ்ரீ முருகன் துணை)  
> **Primary Operator:** Father / Cashier (Terminal ID: `T` / Operator: `PS`)  
> **Target Environment:** Windows 10/11 x64, Desktop Resolution `1360 x 768`, TVS RP 3160 STAR 80mm Monochrome Thermal Receipt Printer.

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & System Goals](#1-executive-summary--system-goals)
2. [Complete Directory & File Structure](#2-complete-directory--file-structure)
3. [Technology Stack & Runtime Architecture](#3-technology-stack--runtime-architecture)
4. [Data Schemas & Type Specifications](#4-data-schemas--type-specifications)
5. [Rust Backend Engine (`tari/src-tauri/src/lib.rs`)](#5-rust-backend-engine)
6. [Tauri IPC Bridge (`tari/src/utils/tauriBridge.js`)](#6-tauri-ipc-bridge)
7. [Database Abstraction Layer (`tari/src/utils/db.js`)](#7-database-abstraction-layer)
8. [Data Normalization & Canonical Shapes (`tari/src/utils/normalize.js`)](#8-data-normalization--canonical-shapes)
9. [Product Search & Jump/Filter Engine (`tari/src/utils/productSearch.js`)](#9-product-search--jumpfilter-engine)
10. [Units, Measures & Dynamic Slab Pricing (`tari/src/utils/units.js`)](#10-units-measures--dynamic-slab-pricing)
11. [CSV Export Engine with UTF-8 BOM (`tari/src/utils/csv.js`)](#11-csv-export-engine-with-utf-8-bom)
12. [Application State & Lifecycle (`tari/src/App.jsx`)](#12-application-state--lifecycle)
13. [Login Screen & Animated Boot Loader (`tari/src/components/LoginScreen.jsx`)](#13-login-screen--animated-boot-loader)
14. [Billing Dashboard & Keyboard Engine (`tari/src/components/BillingDashboard.jsx`)](#14-billing-dashboard--keyboard-engine)
15. [Thermal Receipt Printing Pipeline (`tari/src/components/PrintReceiptModal.jsx`)](#15-thermal-receipt-printing-pipeline)
16. [Product Manager & Slab Navigation (`tari/src/components/ProductManager.jsx`)](#16-product-manager--slab-navigation)
17. [Sales History & Analytics Engine (`tari/src/components/SalesHistory.jsx`)](#17-sales-history--analytics-engine)
18. [Legacy FoxPro (SMS3) Data Migration (`import_old_data.py`)](#18-legacy-foxpro-sms3-data-migration)
19. [CSS Design System & High-DPI Styling (`tari/src/index.css`)](#19-css-design-system--high-dpi-styling)
20. [Comprehensive Keyboard Shortcuts Matrix](#20-comprehensive-keyboard-shortcuts-matrix)
21. [Historical Decisions, Bug Fixes & Lessons Learned](#21-historical-decisions-bug-fixes--lessons-learned)
22. [Build, Packaging & Verification Guide](#22-build-packaging--verification-guide)

---

## 1. Executive Summary & System Goals

The **PS Billing System** is an ultra-fast, offline-first desktop Point of Sale (POS) application built specifically for **Sri Perumal Stores**, a busy retail & wholesale grocery establishment in Tamil Nadu, India.

### Key Performance & Usability Goals
1. **100% Mouse-Free Keyboard Operation:** Cashiers can scan, search, add, edit, override rates, hold bills, settle, and print receipts without ever touching a mouse.
2. **Instant Performance:** Cold start in < 1 second; RAM footprint ~35MB (down from ~220MB in Electron); bundle size ~3MB (down from ~85MB).
3. **Thermal Receipt Legibility:** Direct silent printing to 80mm thermal printers with zero dithering, solid black typography, thick stroke burning, a 20px extra-bold total amount, and 50px of clean blank writing space for manual pen additions.
4. **Data Durability & Power-Cut Safety:** Atomic file replacement with OS cache flush (`sync_all()`), 7-day rolling daily backups, permanent monthly snapshots, and automatic corruption recovery.
5. **Native Tamil Localization:** Dual-column display (Tamil first, English second) on all billing grids, item lookups, management shelves, and receipt printing.
6. **Legacy Continuity:** Flawlessly migrated 1,803 products and 1,850 historical transactions from a 15-year-old FoxPro system (`Sms3`), preserving slab pricing and rupee rounding.

---

## 2. Complete Directory & File Structure

```text
c:\Users\tarun\Downloads\COLLEGE\projects\ps\
├── .gitignore                          # Root Git ignore rules
├── context.txt                         # Ongoing operational log & notes
├── CODEX_CONTEXT.md                    # THIS FILE: Master context manual for LLMs & Codex
├── database.json                       # Root database snapshot (1,803 products, transactions)
├── features_guide.md                   # Feature specifications summary
├── import_old_data.py                  # FoxPro DBF byte-level extractor with Bamini Tamil font decoder
├── ps-billing-system_latest_setup.exe  # Production NSIS installer (3.03 MB)
├── README.md                           # Quickstart guide
│
├── screenshots/                        # Verification artifacts
│   ├── clean_receipt_no_dotted_lines.png
│   ├── receipt_with_blank_writing_space.png
│   └── tight_demo_receipt.png
│
├── Old_sms/                            # Archived FoxPro SMS3 database files (PROD.DBF, BILL.DBF)
│
└── tari/                               # ACTIVE TAURI v2 PRODUCTION SUBPROJECT
    ├── package.json                    # Frontend dependencies (React 19, Lucide, Vite)
    ├── vite.config.js                  # Vite configuration (port 1420)
    ├── index.html                      # HTML root template with Outfit & JetBrains Mono fonts
    ├── public/                         # Static assets (shop logo, shop background image)
    │
    ├── src/                            # React 19 Frontend Source
    │   ├── main.jsx                    # React entrypoint
    │   ├── App.jsx                     # Root application container & page routing
    │   ├── App.css                     # App container layout rules
    │   ├── index.css                   # Master POS design system, light mode & @media print
    │   │
    │   ├── components/                 # Core UI Components
    │   │   ├── LoginScreen.jsx         # Terminal lock screen with 2.5s store loading animation
    │   │   ├── BillingDashboard.jsx    # Primary 100% keyboard billing grid & transaction engine
    │   │   ├── PrintReceiptModal.jsx   # Off-screen 72mm thermal receipt renderer & silent spooler
    │   │   ├── ProductManager.jsx      # Inventory shelf master with 4-way arrow slab editor
    │   │   └── SalesHistory.jsx        # Transaction logs, KPIs, visualizer charts & CSV export
    │   │
    │   └── utils/                      # Modular Business Logic & Hardware Bridges
    │       ├── tauriBridge.js          # Tauri IPC invoker with browser fallbacks
    │       ├── db.js                   # Database read/write abstraction & emergency localStorage copy
    │       ├── normalize.js            # Canonical transaction & line-item data normalizer
    │       ├── productSearch.js        # Jump-mode vs Filter-mode product search algorithm
    │       ├── units.js                # Unit options, measured units & unresolved unit resolvers
    │       └── csv.js                  # UTF-8 BOM CSV spreadsheet exporter
    │
    └── src-tauri/                      # Rust Native Backend
        ├── Cargo.toml                  # Rust crates: tauri v2, serde, serde_json, chrono
        ├── tauri.conf.json             # App manifest, window sizing (1360x768), bundle icons
        ├── build.rs                    # Tauri build hook
        ├── seed_database.json          # Bundled fallback database with full 1,803 products
        ├── capabilities/
        │   └── default.json            # Tauri v2 security capability grants
        └── src/
            ├── main.rs                 # Windows entrypoint (`#![cfg_attr(..., windows_subsystem = "windows")]`)
            └── lib.rs                  # Rust backend logic: atomic I/O, backups, 1MB log rotation, silent print
```

---

## 3. Technology Stack & Runtime Architecture

### Frontend
- **Framework:** React 19.x with functional components and React Hooks (`useState`, `useEffect`, `useRef`, `useMemo`).
- **Build Tool:** Vite 8.x compiling frontend client assets into `tari/dist`.
- **Icons:** `lucide-react` (feather-based lightweight SVGs).
- **Typography:** Google Fonts:
  - `Outfit`: High-contrast, clean sans-serif for Tamil and English headers, buttons, and navigation.
  - `JetBrains Mono`: Fixed-pitch monospace numerals for prices, quantities, and barcode alignment.
- **Styling Architecture:** Pure modular CSS (`tari/src/index.css`) with light-mode POS tokens matching classic Windows desktop aesthetics (`Zinc-200` background `#e4e4e7`, pure white cards `#ffffff`, high contrast text `#09090b`).

### Backend (Native Desktop)
- **Runtime:** Tauri v2 (`@tauri-apps/api/core`, `@tauri-apps/api/window`).
- **Language:** Rust 2021 edition.
- **Engine:** Microsoft WebView2 runtime with `--kiosk-printing` passed via `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`.
- **Data Storage:** Flat JSON database (`database.json`) stored in Windows AppData (`%APPDATA%\com.ps.billing\database.json`).

---

## 4. Data Schemas & Type Specifications

### 4.1 Product Schema (`database.products[]`)
```typescript
interface Slab {
  qtyLimit: number;   // Upper weight threshold in KG (e.g., 0.050 for 50g, 0.250 for 250g, 0.500 for 500g)
  offset: number;     // Price offset to add to sellingPrice (e.g., +20.00 Rs or -10.00 Rs)
}

interface Product {
  code: string;           // Primary unique alphanumeric code (e.g. "M03", "410", "D02")
  name: string;           // English item name (e.g. "Sugar", "Cardamom Packet")
  tamilName: string;      // Tamil item name (e.g. "சீனி / சர்க்கரை", "ஏலக்காய்பாக்கெட்")
  group: string;          // Category / Department name (e.g. "Groceries", "Dals", "Spices")
  unit: string;           // Unit of measurement: 'kg' | 'litre' | 'piece' | 'nos' | 'packet' | 'box' | 'bag'
  priceType: string;      // 'Quantity' (supports fractional weights & slabs) | 'Fixed'
  billItem: boolean;      // True if billable
  salableItem: boolean;   // True if salable
  disableItem: boolean;   // Soft-delete toggle: hides from billing search without breaking historical bills
  sellingPrice: number;   // Base selling price per unit / per 1kg (e.g. 40.00)
  netPrice: number;       // Base net price (usually identical to sellingPrice)
  mrp: number;            // Maximum Retail Price printed on manufacturer packaging
  costPrice: number;      // Wholesale purchase cost price (used for profit analytics)
  openingStock: number;   // Initial physical inventory stock
  currentStock: number;   // Live inventory stock level (auto-decrements on F10/F11/F12 save)
  slabs: Slab[];          // Array of weight-based price adjustment tiers
}
```

### 4.2 Line Item Schema (`transaction.items[]`)
```typescript
interface LineItem {
  code: string;           // Product code
  name: string;           // Product English name
  tamilName: string;      // Product Tamil name
  qty: number;            // Billed quantity (e.g. 1.500 or 2)
  unit: string;           // Product unit
  mrp: number;            // Product MRP
  basePrice: number;      // Base 1kg or unit rate
  overridePrice: string;  // Final applied unit rate as string (e.g. "525.00")
  totalPrice: number;     // Line total: overridePrice * qty (rounded to paise)
  priceType: string;      // 'Quantity' | 'Fixed'
  slabs: Slab[];          // Attached pricing slabs
}
```

### 4.3 Transaction / Invoice Schema (`database.transactions[]`)
```typescript
interface Transaction {
  id: string;             // Unique immutable ID: `b_${Date.now()}_${invoiceNo}` or legacy `legacy_${index}_${timestamp}`
  invoiceNo: number;      // Daily incremental receipt number (e.g. 1, 2, 37, 523)
  timestamp: string;      // ISO 8601 string (e.g. "2026-08-31T18:13:45.000Z")
  year: number;           // Numeric year (e.g. 2026)
  month: number;          // Numeric month 1-12
  day: number;            // Numeric day 1-31
  date: string;           // Formatted date string "DD/MM/YYYY" (e.g. "31/08/2026")
  time: string;           // Formatted time string "HH:MM:SS" (e.g. "18:13:45")
  customerName: string;   // Customer name (defaults to "CASH")
  customerMobile: string; // Customer contact number
  customerAddress: string;// Full joined address from address lines 1, 2, 3
  items: LineItem[];      // Array of canonical line items
  grossTotal: number;     // Sum of all items' totalPrice
  discount: number;       // Discount deducted from bill
  rent: number;           // Rental charges added to bill
  coolie: number;         // Labor / transport charges added to bill
  advance: number;        // Paid advance / cash collected
  roundOff: number;       // Rounding difference: netTotal - rawNetTotal (-0.49 to +0.50)
  netTotal: number;       // Final whole-rupee payable total: Math.round(gross - discount + rent + coolie)
  operator: string;       // Cashier ID (defaults to "PS")
}
```

### 4.4 System Settings Schema (`database.settings`)
```typescript
interface Settings {
  shopName: string;       // Primary store header: "SRI PERUMAL STORES"
  headerSlogan: string;   // Auspicious tagline: "ஸ்ரீ முருகன் துணை"
  phoneNumbers: string;   // Phone numbers: "9629708861"
  defaultOperator: string;// Default operator username: "T"
  theme: string;          // Default UI theme: "light"
  billCounter?: {         // Persistent daily sequential bill counter
    date: string;         // Current counter date "DD/MM/YYYY"
    next: number;         // Next bill number to issue (e.g. 38)
  };
}
```

---

## 5. Rust Backend Engine (`tari/src-tauri/src/lib.rs`)

The Rust backend handles all file persistence, OS path resolution, data integrity verification, log rotation, and native print dispatch.

### Key Rust Constructs & Methods
1. **Thread-Safe Mutex Lock (`DbLock`):**
   ```rust
   #[derive(Default)]
   struct DbLock(Mutex<()>);
   ```
   Tauri executes commands on an asynchronous thread pool. `DbLock` ensures concurrent write requests queue sequentially rather than interleaving, preventing corrupted half-written files.

2. **AppData Path Resolution:**
   - `app_dir(app)`: Resolves `%APPDATA%\com.ps.billing` using `app.path().app_data_dir()`. Creates folder automatically if missing.
   - `get_db_path(app)`: Returns `PathBuf` to `database.json`.
   - `get_log_path(app)`: Returns `PathBuf` to `app.log`.
   - `get_backup_dir(app)`: Returns `PathBuf` to `backups/`.

3. **Atomic File Write with OS Cache Flush (`write_file_atomic`):**
   ```rust
   fn write_file_atomic(path: &Path, contents: &str) -> Result<(), String>
   ```
   - Creates a unique temporary file: `path.with_extension("tmp.<pid>.<nanos>")`.
   - Writes all bytes and executes `file.sync_all()`. **Crucial:** Without `sync_all()`, the OS rename can commit while bytes remain in volatile RAM cache; an unexpected power cut would leave a 0-byte truncated file.
   - Atomically renames temporary file over `path`.

4. **Rolling Daily & Indefinite Monthly Backups (`refresh_backups`):**
   - Automatically triggered on every successful `db_write`.
   - **Daily Backup:** Saved as `backups/database-YYYY-MM-DD.json`.
   - **Monthly Backup:** Saved as `backups/database-monthly-YYYY-MM.json`. If it does not exist, the first write of each month is captured and retained **indefinitely**.
   - **Daily Pruning (`prune_daily_backups`):** Keeps the last 7 daily backup files (`DAILY_BACKUPS_TO_KEEP = 7`) and deletes older dailies, leaving monthly snapshots untouched.

5. **Disaster Recovery from Corrupt Live File (`newest_valid_backup`):**
   - If `db_read` encounters invalid/corrupted JSON in `database.json`, it **refuses** to overwrite it with empty seeds.
   - It searches `backups/` in reverse chronological order, locates the newest backup that parses valid JSON, renames the corrupt file to `database.corrupt.<timestamp>.json` for forensic recovery, and restores the valid backup immediately.

6. **Production Log Rotation (`write_log_file` / `try_write_log`):**
   - Writes timestamped log entries: `[<ISO8601>] [<LEVEL>] <MESSAGE>\n`.
   - Enforces a **1 MB cap**. When `app.log` exceeds 1,048,576 bytes, it rotates to `app.log.old` and starts fresh.

7. **Tauri IPC Commands:**
   - `#[tauri::command] fn db_read(app: AppHandle) -> Result<Value, String>`
   - `#[tauri::command] fn db_write(app: AppHandle, state: tauri::State<DbLock>, data: Value) -> Result<bool, String>`
   - `#[tauri::command] fn log_message(app: AppHandle, level: String, message: String) -> Result<bool, String>`
   - `#[tauri::command] fn print_silent(app: AppHandle) -> Result<bool, String>`: Fetches the WebviewWindow `"main"` and invokes native `window.print()`.

---

## 6. Tauri IPC Bridge (`tari/src/utils/tauriBridge.js`)

Provides an abstraction layer that allows the frontend to run transparently in Tauri v2, Electron (legacy), or standard web browsers.

### API Methods
- `isTauri()`: Checks `typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined`.
- `tauriAPI.readDatabase()`: Calls `invoke('db_read')`.
- `tauriAPI.writeDatabase(data)`: Calls `invoke('db_write', { data })`. Returns `{ success: true }` or `{ success: false, error }`.
- `tauriAPI.logMessage(level, message)`: Calls `invoke('log_message', { level, message })`.
- `tauriAPI.printSilent()`: Calls `invoke('print_silent')`.
- `tauriAPI.onLoginSuccess()`: Retrieves current window via `getCurrentWindow()`, calls `win.setResizable(true)`, `win.setMaximizable(true)`, and `win.maximize()` to absorb layout redraw lag during the login transition.
- `tauriAPI.onLogout()`: No-op; preserves maximized full-screen state to avoid window resizing flicker.

---

## 7. Database Abstraction Layer (`tari/src/utils/db.js`)

Manages client-side database reads and writes with strict fallback controls.

### Functions
- `readDatabase()`: Reads raw database from Tauri (or localStorage in dev mode) and immediately runs it through `normalizeDatabase(raw)`.
- `writeDatabase(data)`:
  - Inside desktop app (Tauri): Calls `tauriAPI.writeDatabase(data)`. Returns `true` only if the disk write succeeded.
  - Emergency Local Copy: If disk write fails or throws, it writes `localStorage.setItem('express_bill_db_emergency', JSON.stringify(data))` and returns `false`. This guarantees that a disk failure alerts the cashier immediately, but data remains retrievable in browser memory.

---

## 8. Data Normalization & Canonical Shapes (`tari/src/utils/normalize.js`)

Prevents data drift between legacy FoxPro imported records and modern React structures.

### Background Problem
FoxPro DBF imports stored line items as `{ rate, amount, total }`. Modern app writes `{ overridePrice, totalPrice, priceType, slabs }`. Without normalization, viewing or re-saving an old bill caused line prices to evaluate to `undefined` or `NaN`, zeroing out historical revenue records.

### Functions
- `round2(n)`: Returns `Math.round((Number(n) || 0) * 100) / 100`. Eliminates IEEE 754 floating point precision errors like `130.00000000000003`.
- `indexProducts(products)`: Returns a `Map<string, Product>` keyed by uppercase product code for $O(1)$ fast lookups.
- `normalizeLineItem(item, productsByCode)`:
  - Resolves unit rate: Checks `overridePrice` $\rightarrow$ `rate` $\rightarrow$ `sellingRate` $\rightarrow$ derives from `total / qty`.
  - Resolves line total: Prefers stored total (`totalPrice` $\rightarrow$ `total` $\rightarrow$ `amount`) over recomputing, ensuring historical bills never drift by 1 paisa.
  - Inherits master catalog metadata: Missing `unit`, `tamilName`, `priceType`, or `slabs` are automatically populated from the product master.
- `legacyTransactionId(tx, index)`: Generates deterministic IDs like `legacy_0_20260818120600` so repeatedly normalizing old bills never creates colliding or duplicate records.
- `normalizeTransaction(tx, productsByCode, index)`: Guarantees canonical item shapes and 2-decimal rounded financial totals.
- `normalizeDatabase(db)`: Transforms entire database object in place.

---

## 9. Product Search & Jump/Filter Engine (`tari/src/utils/productSearch.js`)

Implements a search philosophy optimized for grocery store cashiers.

### Jump Mode vs. Filter Mode
- **Code Queries (Jump Mode):** Product codes are clustered into semantic families (e.g., `M10`, `M11`, `M12` are flours; `D01`, `D02`, `D03` are dry spices). When a cashier types a code prefix (e.g. `"M1"`), the search **does not filter out other products**. Instead, it jumps the cursor to `M10` while keeping the full catalog visible above and below so the cashier can arrow up/down into neighboring items.
- **Name Queries (Filter Mode):** When searching by name (e.g. `"EGG"` or `"மல்லி"`), items have no neighboring relation. The engine filters and returns ranked matches only.

### Functions
- `findCodeMatchIndex(products, query)`: Returns index of first product whose code starts with `query`, or `-1`.
- `rankProducts(products, query)`: Stable 6-tier ranking algorithm:
  - **Tier 0:** Exact code match (`code === q`).
  - **Tier 1:** Code starts with query (`code.startsWith(q)`).
  - **Tier 2:** Code contains query (`code.includes(q)`).
  - **Tier 3:** English or Tamil name starts with query.
  - **Tier 4:** English or Tamil name contains query.
  - **Tier 5:** Department group contains query.
- `searchProducts(products, query)`:
  - If `query` is empty: Returns `{ mode: 'browse', list: products, index: -1 }`.
  - If code match exists: Returns `{ mode: 'jump', list: products, index: jumpIndex }`.
  - Otherwise: Returns `{ mode: 'filter', list: rankedProducts, index: 0 }`.

---

## 10. Units, Measures & Dynamic Slab Pricing (`tari/src/utils/units.js`)

### Supported Units
- `UNIT_OPTIONS`: `['kg', 'litre', 'piece', 'nos', 'packet', 'box', 'bag']`
- `MEASURED_UNITS`: `['kg', 'litre']` (units eligible for decimal quantities like `0.250` and weight slabs).

### Unresolved Units Recovery
623 legacy FoxPro products carried broken unit pointers (e.g. `_1jn0soi55`) because unit master rows were deleted years ago.
- `isUnresolvedUnit(unit)`: Checks `!unit || /^_/.test(String(unit))`.
- `unitLabel(unit)`: Returns `'— not set —'` in management views.
- `billingUnitLabel(unit)`: Returns `'?'` in billing grids; `'கிலோ'` for `kg`; `'NO'` for `piece`.

### Dynamic Slab Pricing Algorithm (`BillingDashboard.jsx` lines 410–426)
```javascript
const getCalculatedPrice = (product, quantity) => {
  if (product.priceType !== 'Quantity' || !product.slabs || product.slabs.length === 0) {
    return product.sellingPrice;
  }
  const sortedSlabs = [...product.slabs].sort((a, b) => a.qtyLimit - b.qtyLimit);
  const matchedSlab = sortedSlabs.find(s => quantity <= s.qtyLimit);
  if (matchedSlab) {
    return product.sellingPrice + matchedSlab.offset;
  }
  return product.sellingPrice;
};
```
*Example:* Jeera base price is ₹380/kg.
- If customer buys 50g (`qty = 0.050`), matched slab offset is ₹110 $\rightarrow$ effective rate is ₹490/kg $\rightarrow$ line total = ₹24.50.
- If customer buys 1kg (`qty = 1.000`), no slab applies $\rightarrow$ effective rate is ₹380/kg $\rightarrow$ line total = ₹380.00.

---

## 11. CSV Export Engine with UTF-8 BOM (`tari/src/utils/csv.js`)

Exports sales transactions and inventory sheets into standard `.csv` files.
- **Excel Tamil Glyph Fix:** Prepends the UTF-8 Byte Order Mark (`\ufeff`) to the Blob:
  ```javascript
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  ```
  Without `\ufeff`, Microsoft Excel opens CSV files in Windows-1252/ANSI encoding, corrupting all Tamil characters into unreadable mojibake.

---

## 12. Application State & Lifecycle (`tari/src/App.jsx`)

### Key State
- `database`: Master state holding `{ products, transactions, settings }`.
- `isLoggedIn`: Boolean controlling access. Displays `LoginScreen` when false.
- `currentPage`: Current view: `'billing'` | `'inventory'` | `'history'`.
- `activePrintInvoice`: Invoice object currently being spooled to the printer.
- `printLanguage`: Receipt language: `'tamil'` | `'english'`.

### Database Update Handler
```javascript
const handleUpdateDatabase = async (newDb) => {
  setDatabase(newDb);
  try {
    const saved = await writeDatabase(newDb);
    if (!saved) throw new Error('Database write did not complete');
  } catch (err) {
    // Logs error to app.log and halts with a bilingual alert
    alert('சேமிப்பு தோல்வி! இந்த பில் சேமிக்கப்படவில்லை.\nSAVE FAILED - this bill was NOT stored.');
  }
};
```

---

## 13. Login Screen & Animated Boot Loader (`tari/src/components/LoginScreen.jsx`)

1. **Authentication:** User `T`, Password `T` (case-insensitive `t` or `T`).
2. **Smooth Fullscreen Transition:** Window maximization (`tauriAPI.onLoginSuccess()`) is called **immediately on form submit**.
3. **2.5-Second Progress Animation:** Simulates retail terminal hardware calibration while WebView2 finishes window layout adjustments:
   - 0–15%: "Powering store lighting systems..."
   - 15–35%: "Arranging retail products on shelves..."
   - 35–55%: "Calibrating item retail prices..."
   - 55–75%: "Fetching cash register logs..."
   - 75–92%: "Calibrating drawer registers..."
   - 92–100%: "POS dashboard is ready!"

---

## 14. Billing Dashboard & Keyboard Engine (`tari/src/components/BillingDashboard.jsx`)

The core engine of the system. Designed to be operated exclusively via keyboard.

### 14.1 Billing Grid Traversal Flow
1. **Code Entry:** Type product code (e.g. `M14`). Code auto-uppercases.
2. **Press `Enter`:**
   - If exact active product matches: loads product details, sets default quantity (`1.000` for measured items, `1` for fixed items), calculates slab rate, and moves focus to **Qty** column.
   - If code does not match or is blank: opens Search Overlay with pre-filled query.
   - **Important:** Re-pressing Enter on an already-loaded item preserves existing custom quantity and slab rates; it does not reset to 1.
3. **Quantity Entry:** Type quantity (e.g. `0.250`). Press `Enter`.
   - Re-evaluates `getCalculatedPrice()`, formats quantity (3 decimals for measured, integer for fixed), moves focus to **Rate** column.
4. **Rate Override:** Cashier can override rate if needed. Press `Enter`.
   - Automatically appends a new blank row at bottom and returns focus to **Code** column.

### 14.2 Separate Tamil & English Product Columns
The billing grid provides separate, dedicated columns for high legibility:
- **Col 1:** `S.No` (50px)
- **Col 2:** `Code` (100px)
- **Col 3:** `தமிழ் பெயர் / Tamil Name` (Bold Tamil font, flex width)
- **Col 4:** `பொருள் / Product Name (Eng)` (Standard English font, flex width)
- **Col 5:** `Unit` (80px, centered)
- **Col 6:** `Qty` (100px)
- **Col 7:** `M.R.P` (100px)
- **Col 8:** `Rate` (110px)
- **Col 9:** `Total` (130px)
- **Col 10:** `Del` (40px)

### 14.3 Duplicate Product Detection Dialog
When an item code is entered that already exists in the current bill:
- Halts execution and opens a modal with two choices:
  - **Choice 0: Edit Existing Item:** Returns focus to the existing row's Qty field and clears duplicate row input.
  - **Choice 1: Add as New Line:** Proceeds to add the item as a separate row (permitting separate slab rates or packaging).
- Navigated via `ArrowLeft` / `ArrowRight` and confirmed with `Enter`.

### 14.4 Whole-Rupee Rounding & Totals Calculation
- `calculateGrossTotal()`: Sum of `item.totalPrice`.
- `calculateRawNetTotal()`: `Math.max(0, gross - discount + rent + coolie)`.
- `calculateNetTotal()`: `Math.round(calculateRawNetTotal())` (rounds to nearest whole rupee).
- `calculateRoundOff()`: `round2(netTotal - rawNetTotal)` (stores exact -0.50 to +0.50 adjustment).

### 14.5 Sequential Bill Numbering (`getNextBillNumber`)
Bill numbers are generated from `database.settings.billCounter`:
- Advances sequentially and atomically with each saved bill.
- **Never counts rows in transactions:** If an old bill is deleted, the counter does not decrement or reissue that number.

### 14.6 Past Bill Viewing & Editing Mode
- **`PageUp` / `PageDown`:** Navigates backward/forward through historical settled bills.
- **Draft Preservation:** When `PageUp` is pressed during an active new bill, the current unsaved draft is parked in `draftBill` and restored cleanly upon returning with `PageDown`.
- **Top Row Scroll Clearance (`--search-header-height`):** Viewing or editing a multi-item bill sets `activeRowIndex = 0` and `scrollTop = 0`. The dynamic CSS variable `--search-header-height` ensures Row 1 is never obscured beneath the sticky header.
- **Read-Only Mode:** Past bills load in read-only mode by default. Bottom buttons (Tamil Print, English Print, Edit) are focused. Pressing `Enter` on "Edit" unlocks the bill for modifications.

---

## 15. Thermal Receipt Printing Pipeline (`tari/src/components/PrintReceiptModal.jsx`)

Designed for **TVS RP 3160 STAR** and standard 80mm thermal printers using 72mm printable roll widths.

### 15.1 Direct Silent Printing
Injected via Webview2 kiosk mode:
- No Windows print dialog preview appears.
- Modal renders off-screen (`position: fixed; left: -9999px; top: -9999px`), invokes `tauriAPI.printSilent()`, and automatically closes 500ms after spooling.

### 15.2 Anti-Dithering CSS Architecture (`src/index.css` @media print)
- **Pure Black:** Forces `color: #000000 !important;` on all text and borders. Prevents Chromium from generating gray anti-aliased edge pixels that thermal heads dither into faint dots.
- **Bold Typography:** Forces `font-weight: 700 !important;` on all receipt elements.
- **Text Stroke:** Applies `-webkit-text-stroke: 0.25px #000000 !important;` to thicken font stems.
- **System Sans-Serif:** Uses `system-ui, -apple-system, sans-serif` during printing for cleaner, solid-burn Tamil stems compared to monospace fonts.
- **Big & Bold Total:** `.receipt-total-row` (18px, weight 900, 0.5px stroke) and `.receipt-total-amount` (**20px**, weight 900, 0.6px stroke).
- **Handwriting Space:** Includes a **50px clean blank whitespace area** below the total for the cashier to write extra items or notes by hand with a ballpoint pen. **Zero printed dotted lines.**

---

## 16. Product Manager & Slab Navigation (`tari/src/components/ProductManager.jsx`)

1. **Inventory Master Shelf:** Displays all 1,803 products with filtering by category group and search query.
2. **4-Way Arrow Key Navigation in Edit Modal:**
   - Navigates freely across form inputs (`Code`, `Tamil Name`, `English Name`, `Unit`, `Base Price`, `Cost Price`, `MRP`).
   - `ArrowDown` drops directly into the weight slabs grid (`Grams`, `Offset`, `Delete`).
   - `ArrowRight` / `ArrowLeft` transitions between slab input fields and delete buttons.
3. **Item Disabling:** Checking "Disable Item" soft-deletes a product, hiding it from billing lookup while keeping historical receipts valid.

---

## 17. Sales History & Analytics Engine (`tari/src/components/SalesHistory.jsx`)

1. **Ledger Filters:** Filter by specific date, date ranges, invoice number, or customer mobile.
2. **KPI Metrics:** Computes Total Revenue (₹), Total Invoices, and Average Bill Value for filtered dates.
3. **Inspection Modal:** "பார்க்க / View" button opens an itemized breakdown with separate Tamil and English columns and direct reprint triggers.
4. **Sales Trend Visualizer:** Interactive SVG chart modal analyzing sales across Days, Weeks, Months, and Years, highlighting peak trading hours and top-selling commodities.
5. **CSV Export:** Generates UTF-8 BOM CSV files for accounting.

---

## 18. Legacy FoxPro (SMS3) Data Migration (`import_old_data.py`)

Migrated historical data from legacy FoxPro `.DBF` tables (`PROD.DBF`, `BILL.DBF`, `CUST.DBF`).

### Byte-Level Bamini Tamil Font Decoder
The legacy FoxPro database stored Tamil characters using proprietary 8-bit Bamini font encoding. `import_old_data.py` contains lookup dictionaries:
- `BYTE_VOWELS` (bytes 171–183 $\rightarrow$ அ, ஆ, இ...)
- `BYTE_CONSONANTS` (bytes 184–201 $\rightarrow$ க, ங, ச...)
- `BYTE_PULLI` (bytes 236–253 $\rightarrow$ க், ங், ச்...)
- `BYTE_U` and `BYTE_OO` (bytes 204–235 $\rightarrow$ கு, கூ, சு, சூ...)
- Handles composite 3-byte vowel-consonants (e.g. kombu bytes 166, 167, 168 + consonant + auxiliary byte $\rightarrow$ கொ, கோ, கௌ).

---

## 19. CSS Design System & High-DPI Styling (`tari/src/index.css`)

### Color Palette (Light Mode POS)
```css
:root {
  --bg-color: #e4e4e7;       /* Zinc-200 desktop background */
  --card-bg: #ffffff;        /* White card surface */
  --card-bg-hover: #f1f5f9;  /* Light slate hover */
  --border-color: #a1a1aa;   /* Zinc-400 visible borders */
  --border-focus: #2563eb;   /* Blue focus ring */
  --text-primary: #09090b;   /* High contrast black */
  --text-secondary: #27272a; /* Sublabel dark gray */
  --text-muted: #71717a;     /* Placeholder gray */
  --primary: #2563eb;        /* Solid blue */
  --primary-hover: #1d4ed8;  /* Deep blue */
  --success: #10b981;        /* Emerald green */
  --error: #ef4444;          /* Red */
}
```

### Display Height Optimizations (`@media (max-height: 800px)`)
Targets the store's 1360x768 monitor:
- Reduces header padding to `6px 16px` and title to `24px`.
- Compresses table cell heights to `24px` and padding to `3px 6px`.
- Decreases button heights to `32px` to ensure 10+ table rows remain visible without vertical scrollbars.

---

## 20. Comprehensive Keyboard Shortcuts Matrix

| Shortcut Key | Scope | Action |
| :--- | :--- | :--- |
| **`Enter`** | Code Cell (Empty) | Opens Item Search Overlay |
| **`Enter`** | Code Cell (Filled) | Validates code; loads item details; moves to Qty |
| **`Enter`** | Qty Cell | Formats quantity; calculates slab rate; moves to Rate |
| **`Enter`** | Rate Cell | Commits row; appends new blank row; returns to Code |
| **`Enter`** | Search Overlay | Selects highlighted product into active bill row |
| **`Enter`** | Duplicate Modal | Confirms chosen option (Edit Existing vs Add New) |
| **`ArrowUp` / `ArrowDown`** | Billing Grid | Moves cursor vertically between rows |
| **`ArrowLeft` / `ArrowRight`** | Billing Grid | Moves cursor horizontally between Code, Qty, Rate |
| **`ArrowUp` / `ArrowDown`** | Search Overlay | Traverses filtered/jumped product search list |
| **`ArrowLeft` / `ArrowRight`** | Duplicate Modal | Toggles between "Edit Existing" and "Add as New Line" |
| **`Alt + D`** | Billing Grid | Instantly deletes active row |
| **`Numpad .`** | Qty / Rate Cells | Intercepts `keyCode 110` / `Decimal` to ensure standard dot `.` |
| **`F9`** | Dashboard | Clears current bill / Restores parked draft bill |
| **`F10`** | Dashboard | Saves bill to database without printing |
| **`F11`** | Dashboard | Settles bill and prints receipt in **Tamil** |
| **`F12`** | Dashboard | Settles bill and prints receipt in **English** |
| **`PageUp`** | Dashboard | Views previous settled bill from history |
| **`PageDown`** | Dashboard | Views next settled bill / Returns to active draft |
| **`Escape`** | Search Overlay | Closes search overlay and restores grid focus |
| **`Escape`** | Viewing Saved Bill| Discards edits and starts fresh new bill |

---

## 21. Historical Decisions, Bug Fixes & Lessons Learned

1. **Migration from Electron to Tauri v2:**
   - *Problem:* Electron consumed 220MB RAM, cold start took 4.5s, installer was 85MB.
   - *Fix:* Rebuilt using Tauri v2 in `tari/`. RAM dropped to 35MB, startup < 1s, installer 3.03MB.
2. **The "NaN" Reprint Bug:**
   - *Cause:* FoxPro records used `rate`, `amount`, `total`. Modern React code read `overridePrice`, `totalPrice`.
   - *Fix:* Created `normalize.js` pipeline so all database reads map into canonical shapes.
3. **Sequential Invoice Counter Bug:**
   - *Cause:* Code previously counted rows in `transactions` array. Deleting a transaction caused the next bill to duplicate the deleted bill's number.
   - *Fix:* Stored persistent `billCounter: { date, next }` in database settings.
4. **Enter Required for Item Code Matching:**
   - *Cause:* Auto-matching on keypress caused typing `"M"` to instantly load the first M-item, overwriting cashier input.
   - *Fix:* Require explicit `Enter` to confirm codes.
5. **Re-entering Code Preserves Custom Rates:**
   - *Cause:* Arrowing back to Code and pressing Enter previously reloaded the product, resetting quantity to 1 and wiping out slab rates.
   - *Fix:* Added `alreadyLoaded` check in `BillingDashboard.jsx` lines 666–676 to advance to Qty without resetting data.
6. **Input Text Selection Bug (`billItems` dependency in `useEffect`):**
   - *Cause:* Having `billItems` in the focus `useEffect` dependency array fired `.select()` on every keystroke, causing each character to replace the previous one.
   - *Fix:* Removed `billItems` from the dependency array; key management is handled exclusively by active row/col state.
7. **Previous Bill Focus & Top Row Scroll Clearance:**
   - *Cause:* Loading a 15-item saved bill scrolled the table to the bottom, hiding Rows 1–3 behind the sticky green header.
   - *Fix:* Explicitly set `activeRowIndex = 0`, `scrollTop = 0`, and added `--search-header-height` with `scroll-margin-top`.
8. **Thermal Print Dithering:**
   - *Cause:* Anti-aliased gray pixels caused 1-bit thermal printer drivers to print faint dithered dots.
   - *Fix:* Forced solid `#000000 !important`, font weight 700, and `-webkit-text-stroke: 0.25px`.
9. **Big & Bold Thermal Total:**
   - *Cause:* A blanket 12px print rule shrank the total line.
   - *Fix:* Targeted `.receipt-total-row` (18px) and `.receipt-total-amount` (20px, weight 900, 0.6px stroke).
10. **Clean Blank Writing Space vs. Dotted Lines:**
    - *Evolution:* The shop originally had 3 dotted lines, but dotted lines made the slip look cluttered and consumed vertical space. Removed dotted lines and replaced with an open **50px clean blank whitespace area** so the cashier can write manual notes smoothly.
11. **Syntax Check Lesson:**
    - *Lesson:* Never run `node -e "import(...)"` for syntax checking, as it executes the script against live data. Always use `node --check <file>`.

---

## 22. Build, Packaging & Verification Guide

### Prerequisites
- Node.js 18+ (tested with Node 20 / npm)
- Rust toolchain (`cargo`, `rustc` via `rustup`)
- Microsoft Visual Studio 2022 C++ Build Tools & Windows 10/11 SDK
- WiX Toolset v3 (for `.msi` bundling) & NSIS (for `.exe` setup packaging)

### Commands
```powershell
# Navigate to active production folder
cd c:\Users\tarun\Downloads\COLLEGE\projects\ps\tari

# Install frontend dependencies
npm install

# Run development server with live reload
npm run tauri dev

# Build production executable and NSIS/MSI installers
npm run build

# Output locations:
# Standalone EXE: tari\src-tauri\target\release\app.exe
# NSIS Setup EXE: tari\src-tauri\target\release\bundle\nsis\ps-billing-system_0.1.0_x64-setup.exe
# MSI Installer:  tari\src-tauri\target\release\bundle\msi\ps-billing-system_0.1.0_x64_en-US.msi
```

### Production Installer
The finalized production installer is copied to the workspace root:
`c:\Users\tarun\Downloads\COLLEGE\projects\ps\ps-billing-system_latest_setup.exe` (3.03 MB).

---
*End of Master Context Manual. This document is maintained as the single source of truth for AI agents and developers.*
