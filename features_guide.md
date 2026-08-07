# 📖 PS Billing System — Complete Features Specifications Guide

This document provides a comprehensive, feature-by-feature specification of the POS Billing System. It covers every user interface window, hotkey command, data processing formula, and backend hook.

---

## 🔑 1. Login & Store Identity Window
The entry point of the POS terminal, optimized to secure the cashier interface and load dynamic configurations:
* **Instant Window Maximization:** Launches automatically in maximized full-screen state on boot to fit POS monitors (specifically tested on `1360*768` displays) and prevent access to underlying desktop files.
* **Persistent Maximize View:** The window remains full-screen even when an operator logs out (no dimensions shifting or window shrinking).
* **Dynamic Slogan & Branding:** Reads settings from the database at startup and renders:
  - **Store Title Name:** Custom shop name (e.g. `SRI PERUMAL STORES` or fallback `RETAIL POS SYSTEM`).
  - **Header Slogan:** Tamil or English tagline (e.g. `ஸ்ரீ முருகன் துணை` or fallback `Express POS & Retail System`).
* **Operator Codes:** Supports local authentication check. Entering operator code (default `T`) grants dashboard access.
* **Autofocus Flow:** Focuses the operator input box instantly on mount for mouse-free credentials entry.

---

## 🛒 2. Billing Dashboard
The primary billing screen, designed to be operated **100% mouse-free** via keyboard hotkeys:
* **Interactive Metadata Fields:**
  - **Bill No (BILL NO):** Automatically increments sequentially on successful cash settlement.
  - **Date:** Displays today's date in local system formatting.
  - **Type:** Cashier category selector (default is `CASH`).
* **Customer Details Form:** Fields for **Customer Name**, **Mobile No**, and three separate **Address Lines** ( Village/Town, Area/Street, City).
* **Keyboard Billing Flow (Spreadsheet Aesthetics):**
  1. Type item code into the active row's **Code** field.
  2. Press `Enter`. If the code is valid, the app fills the item name, retail price, and moves focus to the **Qty** field.
  3. Type the quantity and press `Enter`. The app calculates the total price and moves focus to the **Rate** override field.
  4. Press `Enter` on the **Rate** field. This saves the row, creates a new blank row below it, and automatically resets focus back to the **Code** field.
* **Row Controls:**
  - **Row Deletion (`Alt + D`):** Instantly deletes the highlighted row and focuses the preceding row.
  - **Arrow Keys:** Operators can navigate up and down between cells in different rows.
* **Hold Bills Bin (F10):**
  - Parks unfinished bills in a temporary sidebin.
  - Supports holding multiple separate bills.
  - Held bills display on the right-hand panel showing Bill No and Net Total.
  - Click or press corresponding shortcuts to restore a held bill to the active screen, or delete it from the bin.
* **Digital Clock:** Real-time display showing hours, minutes, and AM/PM indicators in monospace typography.

---

## ⚠️ 3. Duplicate Item Warnings
Handles accidental double additions of the same product code in a single bill:
* **Conflict Interception:** When an operator types a code that is already listed in the active bill, the app halts entry and opens a dialog box.
* **Option Navigation:** Provides two options:
  1. **Edit Existing Item:** Combines the quantities or lets you modify the active item.
  2. **Add as New Row:** Adds the product code as a separate row (allowing separate weight slabs or price overrides).
* **Keyboard Control:** Operators navigate between the options using the **Left/Right Arrow keys** and confirm their selection by pressing **`Enter`**.

---

## 🔍 4. Item Search Modal (F2)
A fuzzy lookup overlay to find items without knowing their codes:
* **Query Matcher:** Search query filters the database by **Product Code**, **English Name**, **Tamil Name**, or **Category Group** dynamically.
* **Full Data Grid:** Results show Code, Product Name, Cost Price, Retail Price, and current Stock levels.
* **Keyboard Traversal:** Use `ArrowUp` / `ArrowDown` to highlight rows, and press `Enter` to insert the highlighted product directly into the active billing row.
* **Dismiss (`Esc`):** Closes the search box instantly and returns cursor focus to the active cell.

---

## ⚖️ 5. Dynamic Weight-Based Pricing Slabs
Optimized for wholesale commodity retail where prices fluctuate based on fractional weight limits:
* **Base 1kg Rate:** Evaluates product pricing based on standard base values.
* **Slab Offsets:** Configurable price adjustments applied to specific quantities (e.g. +10 Rs or -50 Rs offsets for weights like 250g, 500g, 750g).
* **Formula:**
  $$\text{Final Rate} = \text{Base Price} + \text{Slab Offset}$$
  $$\text{Row Total} = \text{Final Rate} \times \text{Quantity}$$
* **Auto-Recalculation:** Price and row totals update dynamically in real time as the operator alters the quantity value.

---

## 📦 6. Product Master (Inventory Manager)
Accessible via **Program ➔ Product Master** from the top menu, providing complete database control:
* **Product Form Fields:**
  - **Product Code:** Unique alphanumeric ID.
  - **Product Name (English):** Standard name.
  - **Tamil Name:** Native script name for localized receipt prints.
  - **Group:** Category folder (e.g., Rice, Oils, Spices).
  - **Unit:** Unit of measurement (e.g., `kg`, `litre`, `piece`, `packet`).
  - **Price Type:** Toggle between *Fixed Price* and *Slab-based Price*.
  - **Base Price, MRP, and Cost Price:** Financial ledger inputs.
  - **Opening Stock:** Initial quantity inventory counts.
* **Item Disabling:** A "Disable Item" checkbox hides discontinued products from the active billing lookup list while preserving their historical transaction logs.

---

## 📜 7. Sales History & Exporter
A complete historical ledger of all store transactions:
* **Transactions Grid:** Displays sequential list of all saved invoices.
* **Advanced Filters:** Search logs by invoice number, date ranges, customer phone, or operator ID.
* **View Details Modal:** Open any past invoice to inspect item lists, discounts, rent, labor, and settlement totals.
* **Sales Statistics Cards:** Renders cumulative transaction count and total revenue generated for the filtered range.
* **CSV Exporter:** Exports sales history grids into a standard `.csv` spreadsheet compatible with Microsoft Excel.

---

## 🖨️ 8. Thermal Print Spooler (Silent Printing)
Specifically configured for retail speed and monochrome receipt legibility:
* **Bypassed Print Dialog:** Launches WebView2 with `--kiosk-printing` browser arguments, meaning pressing print sends the job directly to the system's default spooler. No print preview dialog pops up, and no mouse interaction is required.
* ** तमिलनाडु/தமிழ் Print Toggle:** Choose layout print language (Tamil or English). Renders item names in the chosen script.
* **Monochrome stylesheet formatting:**
  - **80mm Roll Optimization:** Standard `72mm` printable roll width with margins suited for thermal rolls.
  - **Zero Dithering:** Font weights and borders are styled in high-contrast solid black (`#000000`) and white background (`#ffffff`). No gray styling elements are used, ensuring print text is readable on thermal paper.
  - **Automatic Modal Close:** The receipt modal closes automatically 500ms after spooling.
