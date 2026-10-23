# Billing Organization — Remaining Batches

Goal: Move financial rules, transaction updates and keyboard/history handling into focused modules while preserving the verified retail workflow.

Approved continuation: complete the remaining organization before the user tests. Work on `codex/confirmed-bill-saves`; keep each stage committed. No live JSON, seed, installed executable, installer, merge or push changes.

## Batch 2 — Pricing
- [ ] Move slab selection and totals into `src/billing/pricing.js`; use it from billing and product slab previews.
- [ ] Verify exact thresholds, fixed prices, manual overrides, fees, rounding and no mutation.
- [ ] Run React regression checks and commit.

## Batch 3 — Transactions
- [ ] Move numbering, invoice creation/edit/delete, stock adjustments and product-code rename updates into `src/billing/transactions.js`.
- [ ] Preserve IDs, historical fields, counter and current arithmetic. Do not silently change product/legacy policies.
- [ ] Keep transaction changes atomic as one database snapshot through the existing normalized read/native atomic-write path.
- [ ] Await persistence before closing the product editor; preserve rejection for retry. Verify delete and rename behavior.
- [ ] Run regression checks and commit.

## Batch 4 — Keyboard and history
- [ ] Move global billing shortcuts and input focus into `src/billing/useBillingKeyboard.js`.
- [ ] Move draft parking/restoration and saved-bill view/edit transitions into `src/billing/useBillHistory.js`.
- [ ] Keep exact Enter/arrows, duplicate choices, saved-bill reprints, PageUp/PageDown, F9 and F10/F11/F12 behavior.
- [ ] Avoid billItems in focus-effect dependencies; preserve Code selection and contrast styling.
- [ ] Run the full test suite, lint, frontend build, diff review and database/installer hash checks.
- [ ] Update CODEX_CONTEXT.md and commit. Leave all deployment artifacts unchanged for the user's later test/release decision.

Tests use disposable products/invoices and mock storage/printing only. Physical Windows/thermal-printer verification remains a release step.
