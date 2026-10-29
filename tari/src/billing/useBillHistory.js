import { useEffect, useRef, useState } from 'react';
import { createEmptyRow, draftCursor, transactionToDraft } from './drafts';

/** Own saved-bill modes and the parked draft as one navigation lifecycle. */
export const useBillHistory = ({ transactions, draft, applyDraft, resetDraft, refs }) => {
  const [viewingTxIndex, setViewingTxIndex] = useState(null);
  const [isEditingSavedBill, setIsEditingSavedBill] = useState(false);
  const [draftBill, setDraftBill] = useState(null);
  const [activeBottomBtnIndex, setActiveBottomBtnIndex] = useState(2);
  const focusTimer = useRef(null);
  useEffect(() => () => clearTimeout(focusTimer.current), []);

  const focusCell = (row, column) => {
    clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => {
      const fields = column === 'qty' ? refs.qty : column === 'rate' ? refs.rate : refs.code;
      const input = fields.current[row];
      if (input) { input.focus(); input.select?.(); }
    }, 50);
  };
  const scrollToTop = () => {
    if (refs.table.current) refs.table.current.scrollTop = 0;
  };
  const load = tx => {
    setIsEditingSavedBill(false);
    setActiveBottomBtnIndex(2);
    applyDraft(transactionToDraft(tx));
    scrollToTop();
  };
  const startNewBill = nextBillNumber => {
    setViewingTxIndex(null);
    setIsEditingSavedBill(false);
    setDraftBill(null);
    resetDraft(nextBillNumber);
    focusCell(0, 'code');
  };
  const restoreDraft = parked => {
    const cursor = draftCursor(parked);
    setViewingTxIndex(null);
    setIsEditingSavedBill(false);
    setDraftBill(null);
    applyDraft({ ...parked, activeRowIndex: cursor.row, activeColumn: cursor.column });
    focusCell(cursor.row, cursor.column);
  };
  const previous = () => {
    if (!transactions.length || viewingTxIndex === 0) return;
    if (viewingTxIndex === null) setDraftBill(draft);
    const index = viewingTxIndex === null ? transactions.length - 1 : viewingTxIndex - 1;
    setViewingTxIndex(index);
    load(transactions[index]);
  };
  const next = () => {
    if (viewingTxIndex === null) return;
    if (viewingTxIndex === transactions.length - 1) {
      if (draftBill) restoreDraft(draftBill);
      else startNewBill();
    } else {
      const index = viewingTxIndex + 1;
      setViewingTxIndex(index);
      load(transactions[index]);
    }
  };
  const startEdit = () => {
    setIsEditingSavedBill(true);
    const rows = draft.billItems;
    applyDraft({ ...draft,
      billItems: !rows.length || rows[rows.length - 1].code !== '' ? [...rows, createEmptyRow()] : rows,
      activeRowIndex: 0, activeColumn: 'code'
    });
    scrollToTop();
    focusCell(0, 'code');
  };
  const finishEdit = invoice => {
    clearTimeout(focusTimer.current);
    setIsEditingSavedBill(false);
    setActiveBottomBtnIndex(2);
    // Show only the committed items, with no active/focused billing row.
    applyDraft({ ...transactionToDraft(invoice), activeRowIndex: -1 });
  };
  return {
    viewingTxIndex, isEditingSavedBill, draftBill, activeBottomBtnIndex,
    mode: viewingTxIndex === null ? 'new' : isEditingSavedBill ? 'editing' : 'viewing',
    startNewBill, restoreDraft, previous, next, startEdit, finishEdit,
    moveBottomButton: direction => setActiveBottomBtnIndex(index => Math.min(2, Math.max(0, index + direction)))
  };
};
