# Billing Organization — Remaining Batches

Goal: Move financial rules, transaction updates and keyboard/history handling into focused modules while preserving the verified retail workflow.

Approved continuation: complete the remaining organization before the user tests. Work on `codex/confirmed-bill-saves`; keep each stage committed. No live JSON, seed, installed executable, installer, merge or push changes.

## Batch 2 — Pricing
- [x] Move slab selection and totals into `src/billing/pricing.js`; use it from billing and product slab previews.
- [x] Verify exact thresholds, fixed prices, manual overrides, fees, rounding and no mutation.
- [x] Run React regression checks and commit.

## Batch 3 — Transactions
- [x] Move numbering, invoice creation/edit/delete, stock adjustments and product-code rename updates into `src/billing/transactions.js`.
- [x] Preserve IDs, historical fields, counter and current arithmetic. Do not silently change product/legacy policies.
- [x] Keep transaction changes atomic as one database snapshot through the existing normalized read/native atomic-write path.
- [x] Await persistence before closing the product editor; preserve rejection for retry. Verify delete and rename behavior.
- [x] Run regression checks and commit.

## Batch 4 — Keyboard and history
- [x] Move global billing shortcuts and input focus into `src/billing/useBillingKeyboard.js`.
- [x] Move draft parking/restoration and saved-bill view/edit transitions into `src/billing/useBillHistory.js`.
- [x] Keep exact Enter/arrows, duplicate choices, saved-bill reprints, PageUp/PageDown, F9 and F10/F11/F12 behavior.
- [x] Avoid billItems in focus-effect dependencies; preserve Code selection and contrast styling.
- [x] Run the full test suite, lint, frontend build, diff review and database/installer hash checks.
- [x] Update CODEX_CONTEXT.md and commit. Rebuild only the standalone release app.exe for manual testing; leave the installer and installed app unchanged.

Tests use disposable products/invoices and mock storage/printing only. Physical Windows/thermal-printer verification remains a release step.

## Verification and handoff

- 45 checks pass in six test files using synthetic data and mocked persistence/printing.
- The frontend production build passes; lint exits successfully with existing warnings.
- Save, pricing, rename and historical record policies remain explicit in modules.
- Product editor failure/retry is checked through the actual App screen.
- The stock algorithm deliberately retains first-matching-row behavior. Correct aggregation of repeated item codes is a separate business-rule task.
- Source equality checks confirm normalization, disk IO, Tauri bridge, Rust backend, receipt renderer and CSS are unchanged from main.
- Store database SHA-256: da7bd4c147784dc9d1fdd263c8e23f383c4bd95521f653dfe0e409e678331cc0.
- Unchanged installer SHA-256: b31bdd70d68f2d411ca26adf51d9a02323ec5c9919ac1c4372ad19c00f781a68.
- Native Windows/thermal-printer manual testing is still required; no merge, push or installer rebuild was performed.
