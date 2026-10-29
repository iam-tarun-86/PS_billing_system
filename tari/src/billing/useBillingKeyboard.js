import { useEffect } from 'react';

/** Global shortcut ownership is explicit for new/viewing/editing/searching modes. */
export const useBillingKeyboard = ({ state, refs, commands }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (refs.saving.current) { event.preventDefault(); return; }
      if (state.printOpen || state.duplicateOpen) return;
      if (event.repeat && ['F10', 'F11', 'F12'].includes(event.key)) return;
      if (state.searchOpen) {
        if (event.key === 'Escape') { event.preventDefault(); commands.closeSearch(); }
        return;
      }
      const viewing = state.mode === 'viewing';
      if (viewing && ['ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') commands.moveBottomButton(-1);
        else if (event.key === 'ArrowRight') commands.moveBottomButton(1);
        else if (state.bottomButton === 2) commands.edit();
        else commands.printSaved(state.bottomButton === 0 ? 'tamil' : 'english');
        return;
      }
      if (['F10', 'F11', 'F12'].includes(event.key)) {
        event.preventDefault();
        const action = event.key === 'F10' ? 'save' : event.key === 'F11' ? 'tamil' : 'english';
        if (viewing) { if (action !== 'save') commands.printSaved(action); }
        else commands.settle(action);
      } else if (event.key === 'F9') {
        event.preventDefault();
        if (state.mode !== 'new' && state.hasParkedDraft) commands.restoreParkedDraft();
        else if (confirm('நிச்சயமாக இந்த பில்லை அழிக்க வேண்டுமா? / Clear current bill?')) commands.clear();
      } else if (event.key === 'Escape' && state.mode !== 'new') {
        event.preventDefault();
        if (state.mode !== 'editing' || confirm('திருத்தங்களை ரத்து செய்துவிட்டு புதிய பில் தொடங்க வேண்டுமா? / Discard edits and start a new bill?')) commands.clear();
      } else if (event.key === 'PageUp') {
        event.preventDefault(); commands.previous();
      } else if (event.key === 'PageDown') {
        event.preventDefault(); commands.next();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, commands, refs.saving]);

  const { code, qty, rate, searchInput, bottomButtons } = refs;
  const { row, column, searchOpen, printOpen, duplicateOpen, isSaving, mode, bottomButton } = state;
  useEffect(() => {
    if (mode !== 'viewing' || isSaving || printOpen) return;
    const button = bottomButton === 0 ? bottomButtons.tamilPrint
      : bottomButton === 1 ? bottomButtons.englishPrint : bottomButtons.editSave;
    button.current?.focus();
  }, [mode, bottomButton, bottomButtons.tamilPrint, bottomButtons.englishPrint, bottomButtons.editSave, isSaving, printOpen]);

  // Deliberately exclude draft values: reselecting per keystroke overwrites typing.
  useEffect(() => {
    if (mode === 'viewing' || isSaving || printOpen || duplicateOpen) return;
    if (searchOpen) { searchInput.current?.focus(); return; }
    const timer = setTimeout(() => {
      if (row < 0) return;
      const fields = column === 'qty' ? qty : column === 'rate' ? rate : code;
      const input = fields.current[row];
      if (input) { input.focus(); input.select?.(); }
    }, 50);
    return () => clearTimeout(timer);
  }, [mode, row, column, searchOpen, printOpen, duplicateOpen, isSaving, code, qty, rate, searchInput]);
};
