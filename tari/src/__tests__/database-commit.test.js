// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useDatabaseCommit } from '../billing/useDatabaseCommit';

afterEach(cleanup);
it('allows one writer and publishes only the confirmed snapshot', async () => {
  let resolve;
  const write = vi.fn(() => new Promise(done => { resolve = done; }));
  const onCommitted = vi.fn(), onFailure = vi.fn();
  const { result } = renderHook(() => useDatabaseCommit({ write, onCommitted, onFailure }));
  let pending;
  act(() => { pending = result.current.commit({ marker: 'first' }); });
  expect(result.current.isPending).toBe(true);
  expect(await result.current.commit({ marker: 'second' })).toBe(false);
  expect(write).toHaveBeenCalledTimes(1);
  expect(onCommitted).not.toHaveBeenCalled();
  await act(async () => { resolve(true); expect(await pending).toBe(true); });
  expect(onCommitted).toHaveBeenCalledWith({ marker: 'first' });
  expect(result.current.isPending).toBe(false);
});
it('reports failure, retains state and permits a subsequent retry', async () => {
  const write = vi.fn().mockRejectedValueOnce(new Error('Disk full')).mockResolvedValue(true);
  const onCommitted = vi.fn(), onFailure = vi.fn();
  const { result } = renderHook(() => useDatabaseCommit({ write, onCommitted, onFailure }));
  await act(async () => { expect(await result.current.commit({ marker: 'retry' })).toBe(false); });
  expect(onCommitted).not.toHaveBeenCalled();
  expect(onFailure).toHaveBeenCalledTimes(1);
  expect(result.current.isPending).toBe(false);
  await act(async () => { expect(await result.current.commit({ marker: 'retry' })).toBe(true); });
  expect(onCommitted).toHaveBeenCalledTimes(1);
});
