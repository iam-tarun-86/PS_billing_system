// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { readDatabase, writeDatabase } from '../utils/db';
import { normalizeDatabase } from '../utils/normalize';

vi.mock('../utils/db', () => ({ readDatabase: vi.fn(), writeDatabase: vi.fn() }));
vi.mock('../components/LoginScreen', () => ({
  default: ({ onLogin }) => <button onClick={onLogin}>Test login</button>
}));
// No OS printing or live persistence: exercise App's actual print callback and state.
vi.mock('../components/PrintReceiptModal', () => ({
  default: ({ invoice, printLanguage }) => (
    <div data-testid="receipt" data-language={printLanguage}>{invoice.netTotal}</div>
  )
}));

const fixture = () => {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  return normalizeDatabase({
    products: [
      { code: 'M47', name: 'JEERA', tamilName: 'சீரகம்', group: 'Groceries', unit: 'kg',
        priceType: 'Quantity', sellingPrice: 380, mrp: 400, currentStock: 10,
        slabs: [{ qtyLimit: 0.1, offset: 110 }, { qtyLimit: 0.5, offset: 0 }] },
      { code: 'B01', name: 'HAMAM', tamilName: 'ஹமாம்', group: 'Soap', unit: 'piece',
        priceType: 'Fixed', sellingPrice: 39, mrp: 40, currentStock: 20, slabs: [] }
    ],
    transactions: [{ id: 'old-bill', invoiceNo: 8, date, timestamp: now.toISOString(),
      customerName: 'CASH', grossTotal: 190, netTotal: 190,
      items: [{ code: 'M47', qty: 0.5, rate: 380, amount: 190 }] }],
    settings: { shopName: 'TEST SHOP', billCounter: { date, next: 10 } }
  });
};

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const grid = () => document.querySelector('.billing-table');
const cells = (row = 0) => grid().querySelectorAll('tbody tr')[row].querySelectorAll('input');
const press = (key, target = window, extra = {}) => fireEvent.keyDown(target, { key, ...extra });
const change = (input, value) => fireEvent.change(input, { target: { value } });
const enterJeera = (qty = '0.050') => {
  change(cells()[0], 'M47');
  press('Enter', cells()[0]);
  change(cells()[1], qty);
  press('Enter', cells()[1]);
};
const openApp = async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: 'Test login' }));
  await waitFor(() => expect(grid()).not.toBeNull());
};

beforeEach(() => {
  vi.clearAllMocks();
  readDatabase.mockResolvedValue(fixture());
  writeDatabase.mockResolvedValue(true);
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('existing keyboard and billing behavior', () => {
  it.each(['new', 'saved edit'])('replaces an existing product after code overwrite and Enter in a %s bill', async mode => {
    await openApp();
    if (mode === 'saved edit') {
      press('PageUp');
      press('Enter');
    } else {
      enterJeera();
    }
    const code = cells()[0];
    fireEvent.focus(code);
    change(code, 'B01');
    press('Enter', code);
    expect(grid().querySelector('tbody tr').textContent).toContain('HAMAM');
    expect(grid().querySelector('tbody tr').textContent).not.toContain('JEERA');
    expect(cells()[1].value).toBe('1');
    expect(cells()[2].value).toBe('39.00');
    press('F10');
    await waitFor(() => expect(writeDatabase).toHaveBeenCalledTimes(1));
    const saved = writeDatabase.mock.calls[0][0];
    const invoice = mode === 'new' ? saved.transactions[1] : saved.transactions[0];
    expect(invoice.items[0]).toMatchObject({ code: 'B01', name: 'HAMAM', tamilName: 'ஹமாம்',
      unit: 'piece', qty: 1, basePrice: 39, overridePrice: '39.00', totalPrice: 39 });
    expect(invoice.netTotal).toBe(39);
    expect(saved.products[0].currentStock).toBe(mode === 'new' ? 10 : 10.5);
    expect(saved.products[1].currentStock).toBe(19);
  });

  it('preserves quantity and custom rate when the same code is retyped character by character', async () => {
    await openApp();
    enterJeera();
    change(cells()[2], '500');
    fireEvent.focus(cells()[0]);
    for (const value of ['M', 'M4', 'M47']) change(cells()[0], value);
    press('Enter', cells()[0]);
    expect(cells()[1].value).toBe('0.050');
    expect(cells()[2].value).toBe('500');
  });

  it('keeps fractional slab prices, Enter traversal, overrides and code selection', async () => {
    await openApp();
    enterJeera();
    expect(cells()[1].value).toBe('0.050');
    expect(cells()[2].value).toBe('490.00');
    change(cells()[2], '500');
    press('Enter', cells()[2]);
    await waitFor(() => expect(document.activeElement).toBe(cells(1)[0]));
    press('ArrowUp', cells(1)[0]);
    await waitFor(() => expect(document.activeElement).toBe(cells()[0]));
    expect(cells()[0].selectionStart).toBe(0);
    expect(cells()[0].selectionEnd).toBe(3);
    press('Enter', cells()[0]);
    expect(cells()[1].value).toBe('0.050');
    expect(cells()[2].value).toBe('500');
  });

  it('retains code-jump search, name filtering and bold search text', async () => {
    await openApp();
    press('Enter', cells()[0]);
    const query = screen.getByPlaceholderText(/Search by code, name/);
    change(query, 'M4');
    expect(document.querySelectorAll('.search-overlay-table tbody tr')).toHaveLength(2);
    change(query, 'JEERA');
    const rows = document.querySelectorAll('.search-overlay-table tbody tr');
    expect(rows).toHaveLength(1);
    for (const i of [0, 1, 2, 4]) expect(rows[0].cells[i].style.fontWeight).toBe('700');
    press('Enter', query);
    expect(cells()[0].value).toBe('M47');
    expect(screen.queryByPlaceholderText(/Search by code, name/)).toBeNull();
  });

  it('saves rounded totals, correct stock and a monotonic counter', async () => {
    await openApp();
    enterJeera();
    press('F10');
    await waitFor(() => expect(cells()[0].value).toBe(''));
    const saved = writeDatabase.mock.calls[0][0];
    expect(saved.transactions).toHaveLength(2);
    expect(saved.transactions[1]).toMatchObject({ invoiceNo: 10, grossTotal: 24.5, netTotal: 25, roundOff: 0.5 });
    expect(saved.products[0].currentStock).toBe(9.95);
    expect(saved.settings.billCounter.next).toBe(11);
    expect(screen.getByDisplayValue('11')).toBeTruthy();
    expect(screen.queryByTestId('receipt')).toBeNull();
  });

  it.each([
    ['0.100', '490.00', 49], ['0.250', '380.00', 95],
    ['0.500', '380.00', 190], ['1.000', '380.00', 380]
  ])('preserves the existing %s kg slab and total', async (qty, rate, total) => {
    await openApp();
    enterJeera(qty);
    expect(cells()[2].value).toBe(rate);
    press('F10');
    await waitFor(() => expect(cells()[0].value).toBe(''));
    expect(writeDatabase.mock.calls[0][0].transactions[1]).toMatchObject({ grossTotal: total, netTotal: total });
  });

  it('keeps saved bills read-only and reprints without writing', async () => {
    await openApp();
    press('PageUp');
    expect(cells()[0].readOnly).toBe(true);
    expect(cells()[1].value).toBe('0.5');
    press('F10');
    expect(writeDatabase).not.toHaveBeenCalled();
    press('F12');
    expect(screen.getByTestId('receipt').dataset.language).toBe('english');
    expect(writeDatabase).not.toHaveBeenCalled();
  });

  it('restores the unsaved draft after navigating past bills', async () => {
    await openApp();
    enterJeera();
    press('PageUp');
    press('PageDown');
    expect(cells()[0].value).toBe('M47');
    expect(cells()[1].value).toBe('0.050');
    expect(cells()[2].value).toBe('490.00');
    expect(writeDatabase).not.toHaveBeenCalled();
  });

  it('restores a parked draft with F9 and cancels saved-bill editing with Escape', async () => {
    await openApp();
    enterJeera();
    press('PageUp');
    press('F9');
    expect(cells()[1].value).toBe('0.050');
    press('PageUp');
    // Read-only bottom buttons start on Edit; Enter must work without the mouse.
    press('Enter');
    await waitFor(() => expect(document.activeElement).toBe(cells()[0]));
    expect(cells()[0].selectionEnd).toBe(3);
    expect(cells()[0].readOnly).toBe(false);
    window.confirm.mockReturnValueOnce(false);
    press('Escape');
    expect(cells()[0].value).toBe('M47');
    press('Escape');
    expect(cells()[0].value).toBe('');
    expect(writeDatabase).not.toHaveBeenCalled();
  });

  it('navigates saved-bill print buttons using arrows and Enter without a write', async () => {
    await openApp();
    press('PageUp');
    press('ArrowLeft');
    press('ArrowLeft');
    press('Enter');
    expect(screen.getByTestId('receipt').dataset.language).toBe('tamil');
    expect(writeDatabase).not.toHaveBeenCalled();
  });

  it('retains the duplicate-item choice and Alt+D row removal', async () => {
    await openApp();
    enterJeera();
    press('Enter', cells()[2]);
    change(cells(1)[0], 'M47');
    press('Enter', cells(1)[0]);
    // The duplicate dialog defaults to editing the existing quantity.
    press('Enter');
    await waitFor(() => expect(document.activeElement).toBe(cells()[1]));
    expect(cells()[1].value).toBe('0.050');
    expect(cells(1)[0].value).toBe('');
    press('d', cells()[1], { altKey: true });
    expect(cells()[0].value).toBe('');
    expect(writeDatabase).not.toHaveBeenCalled();
  });
});

describe('product editor persistence', () => {
  it('retains a rejected edit for retry and leaves invoice history unchanged', async () => {
    const original = fixture();
    readDatabase.mockResolvedValue(original);
    await openApp();
    fireEvent.click(screen.getByRole('button', { name: /Products/ }));
    const row = screen.getByText('ஹமாம்').closest('tr');
    fireEvent.click(row);
    change(screen.getByDisplayValue('ஹமாம்'), 'ஹமாம் சோப்');
    writeDatabase.mockResolvedValueOnce(false);
    fireEvent.click(screen.getByRole('button', { name: /சேமி \/ Save/ }));
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(screen.getByDisplayValue('ஹமாம் சோப்')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /சேமி \/ Save/ }));
    await waitFor(() => expect(screen.queryByDisplayValue('ஹமாம் சோப்')).toBeNull());
    expect(writeDatabase).toHaveBeenCalledTimes(2);
    expect(writeDatabase.mock.calls[1][0].transactions).toEqual(original.transactions);
  });
});

describe('confirmed persistence', () => {
  it.each([['F11', 'tamil'], ['F12', 'english']])('waits before %s printing or clearing', async (key, language) => {
    const pending = deferred();
    writeDatabase.mockReturnValue(pending.promise);
    await openApp();
    enterJeera();
    press(key);
    expect(writeDatabase).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('receipt')).toBeNull();
    expect(cells()[0].value).toBe('M47');
    expect(window.alert).not.toHaveBeenCalled();
    // Still locked after the old fixed 500ms delay would have expired.
    await act(() => new Promise(resolve => setTimeout(resolve, 550)));
    press('F10');
    press('F12', window, { repeat: true });
    expect(writeDatabase).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve(true));
    expect(screen.getByTestId('receipt').dataset.language).toBe(language);
    expect(cells()[0].value).toBe('');
  });

  it.each(['false', 'reject'])('preserves the draft and persisted state on %s, then retries once', async failure => {
    if (failure === 'false') writeDatabase.mockResolvedValueOnce(false);
    else writeDatabase.mockRejectedValueOnce(new Error('Disk unavailable'));
    await openApp();
    enterJeera();
    press('F11');
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(window.alert.mock.calls.flat().join(' ')).toContain('SAVE FAILED');
    expect(screen.queryByTestId('receipt')).toBeNull();
    expect(cells()[0].value).toBe('M47');
    expect(cells()[1].value).toBe('0.050');
    expect(screen.getByDisplayValue('10')).toBeTruthy();
    expect(window.alert.mock.calls.flat().join(' ')).not.toContain('Bill saved successfully');
    writeDatabase.mockResolvedValue(true);
    press('F10');
    await waitFor(() => expect(cells()[0].value).toBe(''));
    const retry = writeDatabase.mock.calls[1][0];
    expect(retry.transactions).toHaveLength(2);
    expect(retry.transactions[1].invoiceNo).toBe(10);
    expect(retry.products[0].currentStock).toBe(9.95);
  });

  it('blocks editing, clear, history and navigation while storage is pending', async () => {
    const pending = deferred();
    writeDatabase.mockReturnValue(pending.promise);
    await openApp();
    enterJeera();
    press('F10');
    expect(document.querySelector('.billing-dashboard-screen').hasAttribute('inert')).toBe(true);
    expect(screen.getByRole('status').textContent).toContain('Saving');
    press('F9');
    press('PageUp');
    press('Escape');
    press('ArrowLeft', cells()[2]);
    fireEvent.click(screen.getByRole('button', { name: /Products/ }));
    expect(grid()).not.toBeNull();
    expect(cells()[0].readOnly).toBe(false);
    expect(cells()[1].value).toBe('0.050');
    expect(window.confirm).not.toHaveBeenCalled();
    await act(async () => pending.resolve(false));
    expect(document.querySelector('.billing-dashboard-screen').hasAttribute('inert')).toBe(false);
    await waitFor(() => expect(document.activeElement).toBe(cells()[2]));
  });

  it('preserves saved-bill edits after failure and saves without duplicating the invoice', async () => {
    await openApp();
    press('PageUp');
    fireEvent.click(screen.getByRole('button', { name: /Edit/ }));
    change(cells()[1], '0.250');
    writeDatabase.mockResolvedValueOnce(false);
    press('F10');
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(cells()[1].value).toBe('0.250');
    expect(cells()[0].readOnly).toBe(false);
    const edited = writeDatabase.mock.calls[0][0];
    expect(edited.transactions).toHaveLength(1);
    expect(edited.transactions[0]).toMatchObject({ id: 'old-bill', invoiceNo: 8, netTotal: 95 });
    expect(edited.products[0].currentStock).toBe(10.25);
    press('F10');
    await waitFor(() => expect(writeDatabase).toHaveBeenCalledTimes(2));
    expect(writeDatabase.mock.calls[1][0]).toEqual(edited);
    expect(cells()[1].value).toBe('0.250');
  });

  it('waits for an edited bill to reach storage before printing, then keeps it on screen', async () => {
    const pending = deferred();
    writeDatabase.mockReturnValue(pending.promise);
    await openApp();
    press('PageUp');
    fireEvent.click(screen.getByRole('button', { name: /Edit/ }));
    change(cells()[1], '0.250');
    press('F12');
    expect(screen.queryByTestId('receipt')).toBeNull();
    expect(writeDatabase).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve(true));
    expect(screen.getByTestId('receipt').textContent).toBe('95');
    expect(cells()[0].value).toBe('M47');
    expect(cells()[1].value).toBe('0.250');
    expect(writeDatabase.mock.calls[0][0].transactions).toHaveLength(1);
  });
});
