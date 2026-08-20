# PS Billing System (POS Desktop Application)

An offline-first, high-speed retail POS (Point of Sale) billing application designed specifically for quick keyboard-only operations. Built with **React + Vite** and wrapped in **Electron** to run as a standalone Windows desktop executable (`.exe`).

The layout is intentionally designed with a classic, high-contrast Windows light-grey theme to maximize text readability and billing speed for store operators.

---

## 🌟 Key Features

### 1. High-Speed Keyboard Navigation
Designed to be operated 100% mouse-free:
* **Enter-Key Flow**: Type Item Code ➔ Press `Enter` (selects item and goes to Qty) ➔ Type Qty ➔ Press `Enter` (goes to Rate) ➔ Type Rate/Change Price ➔ Press `Enter` (creates a new row and resets cursor to Code).
* **Alt + D**: Deletes the currently focused item/row in the billing table and moves the cursor to the previous row automatically.
* **Arrow Up / Down**: Move quickly between cells in different rows.
* **F1 / Ctrl + S**: Cash Settlement (Saves transaction and triggers print receipt).
* **F2**: Opens billing area search overlay to lookup items by name, Tamil name, code, or group.
* **F10**: Puts current billing items on hold in a "Held Bills" bin.
* **Esc**: Closes search overlay.

### 2. Dynamic Weight-based Pricing Slabs
Optimized for fractional quantities (e.g. wholesale spices, rava, flour, sugar):
* Supports markup offsets (e.g. `+10` or `-110`) applied directly to the base 1kg rate before calculation.
* **Formula**: `Final Price = (Base 1kg Price + Slab Offset) * Quantity`
* **Custom Slab Settings**: Owners can add, edit, or delete custom weight slabs (e.g. custom limits like `150g` or `750g` with custom offsets) inside the Product Master.

### 3. Product & Inventory Management (Product Master)
Accessible from the classic top menu bar (**Program ➔ Product Master**):
* Add new products with customized units (`kg`, `litre`, `piece`, `packet`, etc.) and price types (Fixed or Qty-based).
* Set dynamic weights slabs for specific quantity items.
* View and edit opening stocks, cost price, MRP, and retail prices.

### 4. Billing Dashboard Details
* **Metadata split panels**: Top layout houses Customer Name, stacked 3-line Address, Mobile, and live digital clock.
* **Blue Gradient Header Grid**: Layout table features clear horizontal & vertical borders (spreadsheet style) with high contrast blue gradient headers.
* **Color-Coded Summary Boxes**: Gross, Count (Green), Discount (Red), Rent (Purple), Labor (Blue), and Advance (Orange) with high-contrast text.
* **Large Net Total Card**: Prominently displays the final bill amount in bold blue.
* **Thermal Printing**: Embedded receipt template optimized for standard 80mm thermal POS slip rolls.

---

## 🛠️ Tech Stack
* **Frontend Core**: React 18, Vite (for rapid client builds)
* **Styling**: Vanilla CSS (no Tailwind dependencies) with Outfits and JetBrains Mono typography for POS terminal aesthetics.
* **Wrapper**: Electron (for local OS filesystem integrations and running as a native `.exe`)
* **Local Database**: Persistent local file storage. Writes to `database.json` inside the Windows AppData directory (`userDataPath`) with an automatic localStorage fallback for web environments.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iam-tarun-86/PS_billing_system.git
   cd PS_billing_system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
* **Web Browser Version** (Fast UI/UX testing):
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

* **Electron Desktop Version** (Runs desktop application concurrently with dev server):
  ```bash
  npm run dev:electron
  ```

### Packaging for Windows
To package the app into a standalone `.exe` installer/folder:
```bash
npm run package
```
The packaged Windows build will be generated in:
`dist-desktop/ps-win32-x64/ps.exe`
