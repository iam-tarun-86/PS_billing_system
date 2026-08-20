# 🏪 PS Cash Memo - Point of Sale (POS) & Retail System

> **ஸ்ரீ முருகன் துணை**  
> **SRI PERUMAL STORES (பெருமாள் ஸ்டோர்ஸ்)**  
> *Express Retail & Wholesale Billing System*

[![Built With Tauri v2](https://img.shields.io/badge/Tauri-v2.0-24C8D5?logo=tauri&logoColor=white)](https://tauri.app)
[![React](https://img.shields.io/badge/React-v19.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Rust](https://img.shields.io/badge/Rust-v1.85+-DEA584?logo=rust&logoColor=white)](https://www.rust-lang.org)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-0078D6?logo=windows&logoColor=white)]()

A lightning-fast, 100% keyboard-driven desktop POS application designed specifically for high-throughput Indian grocery and retail stores. Built with **Tauri v2 + Rust** and **React 19**, offering instantaneous startup, zero lag, and full offline persistence.

---

## 🌟 Key Features

### ⚡ 1. 100% Keyboard-Driven & Mouse-Free Workflow
- **Instant Product Search:** Press Enter on an empty code cell to open the fuzzy search overlay across Tamil and English catalog names.
- **Stable List Navigation:** Arrow keys glide cleanly across products and slabs while table viewports remain visually locked in place.
- **Auto-Advancing Cursor:** Type code -> Enter -> Qty -> Enter -> Rate -> Enter -> next item automatically.
- **Rapid Navigation:** Full 4-way arrow key and Enter traversal across all form inputs, slab tables, and action buttons.

### 🏷️ 2. Comprehensive Catalog & Bilingual Support
- **1,803 Ingested Products:** Complete store catalog loaded with live retail selling prices, MRPs, cost rates, units (kg, piece, packet, litre), and category groups.
- **Tamil-First Display:** Tamil names prominently displayed as the first primary column, followed by English names.
- **Unit Normalization:** Correctly resolves FoxPro unit master codes (KG, NO, PKT, LITER, BAG, BOX, TIN, etc.).

### ⚖️ 3. Intelligent Multi-Tier Slab Pricing (Grams -> KG)
- **Automatic Weight Fractioning:** For weight-based items (kg), the system automatically calculates standard fractional rates (50g, 100g, 250g, 500g, 1kg).
- **Custom Offset Pricing:** Ingested **75+ custom DBF slab offsets** (e.g., சீரகம் -110, மிளகு -200, வெந்தயம் -60, துவரம் பருப்பு -8 / -4).
- **Live Calculation Formula:**
  \text{Packet Price} = (\text{Base Price} + \text{Offset}) \times \left(\frac{\text{Grams}}{1000}\right)

### 🧾 4. Optimized Thermal Receipt Printing (3-Inch / 80mm Roll)
- **Prominent Header:** Store contact number (📞 9629708861) in large bold text directly under the shop name.
- **Simplified Totals:** Clean single மொத்தம் / Total : ₹... line.
- **Handwritten Extra Items Buffer:** Ample guide line spacing after the items table for adding manual notations.
- **Silent Printing:** Off-screen spooling to Windows default thermal printer without browser dialog interruptions.
- **Bilingual Output:** Print or reprint receipts in either **Tamil (F6 / F11)** or **English (F7 / F12)**.

### 📊 5. Sales History & Business Analytics
- **1,850+ Historical Invoices:** Full chronological history with **14,011 itemized rows** mapped via voucher foreign key (VNO).
- **Sales Analytics:** Interactive daily turnover summaries, transaction counts, and trend visualizations.
- **Bill Inspection & Reprint:** Dedicated modal to inspect historical bills and trigger reprints instantly.

### 🔒 6. Robust Offline Storage & Safety
- **Atomic File Persistence:** Rust-managed atomic file writes with .json.tmp staging to eliminate any risk of database corruption.
- **Automated Backups:** Automatic timestamped backups created in %APPDATA%\com.perumalstores.psbilling\ and project root.
- **Log Rotation:** In-app production logging with automatic 1MB rotation limits (pp.log).

---

## ⌨️ Keyboard Shortcuts Cheat Sheet

| Key / Shortcut | Screen / Context | Action |
| :--- | :--- | :--- |
| Enter (on empty code) | Billing Grid | Open Product Search Overlay |
| ArrowUp / ArrowDown | Search / Table | Move row selection smoothly |
| Enter | Search Overlay | Select highlighted product and focus Qty |
| F5 or Ctrl + S | Billing Dashboard | Save current bill |
| F6 or Ctrl + P | Billing Dashboard | Save & Print Receipt in **Tamil** |
| F7 | Billing Dashboard | Save & Print Receipt in **English** |
| F8 | Billing Dashboard | View Previous Saved Bill (Backwards) |
| F9 | Billing Dashboard | View Next Saved Bill (Forward) |
| F10 | Billing Dashboard | Clear Screen & Start New Bill |
| F11 | View Past Bill Mode | Reprint Bill in **Tamil** |
| F12 | View Past Bill Mode | Reprint Bill in **English** |
| Delete | Billing Grid | Remove currently active row |
| Escape | Global | Close overlay / modal / Exit to previous screen |

---

## 🏗️ Project Architecture

`
ps/
├── Old_sms/Sms3/Data/       # Original FoxPro DBF source database
├── tari/                    # Tauri v2 Desktop Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── BillingDashboard.jsx   # Core POS cash memo billing screen
│   │   │   ├── LoginScreen.jsx        # Lock screen & animated loading screen
│   │   │   ├── ProductManager.jsx     # Product master & slab pricing editor
│   │   │   ├── SalesHistory.jsx       # Historical invoices & analytics
│   │   │   └── PrintReceiptModal.jsx  # Thermal receipt layout & printer spooler
│   │   ├── utils/
│   │   │   ├── db.js                  # Database abstractions & seed fallbacks
│   │   │   └── tauriBridge.js         # Tauri IPC invocation bridge
│   │   ├── App.jsx                    # Root state router & session manager
│   │   ├── main.jsx                   # ErrorBoundary & app entrypoint
│   │   └── index.css                  # Green header POS theme & dark mode styles
│   ├── src-tauri/
│   │   ├── src/
│   │   │   ├── lib.rs                 # Rust IPC commands (db_read, db_write, print_silent)
│   │   │   └── main.rs                # Windows desktop entrypoint
│   │   ├── tauri.conf.json            # Desktop bundle configuration
│   │   └── Cargo.toml                 # Rust dependencies
│   ├── database.json                  # Synchronized product & sales database
│   └── package.json                   # Frontend dependencies & scripts
├── context.txt                        # Complete project development log & context
├── database_backup_2026_08_18.json    # Safety database backup
└── ps-billing-system_latest_setup.exe # Production Windows installer
`

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18+ or v20+
- **Rust**: 
ustc / cargo v1.80+
- **WebView2**: Standard Windows 10/11 runtime

### Development Setup
`ash
# 1. Navigate to tari directory
cd tari

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
`

### Production Build
`ash
# Build standalone Windows binary and installer
npm run build
`
Output files are generated at:
- **Standalone Binary:** 	ari/src-tauri/target/release/app.exe
- **Setup Installer:** 	ari/src-tauri/target/release/bundle/nsis/ps-billing-system_0.1.0_x64-setup.exe (and ps-billing-system_latest_setup.exe in project root)

---

## 👥 Default Credentials

| Username | Password | Role | Access Level |
| :---: | :---: | :---: | :--- |
| T | T | Cashier / Operator | Billing, Search, Printing |
| dmin | password123 | Store Admin | Full Master & Settings Access |

---

## 📄 License & Ownership
Created and developed for **Sri Perumal Stores** by **Tarun & Team**. All rights reserved.
