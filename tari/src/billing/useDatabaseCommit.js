import { useEffect, useRef, useState } from 'react';

/** All screens share one confirmed, single-flight database commit boundary. */
export const useDatabaseCommit = ({ write, onCommitted, onFailure }) => {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isPending) return;
    const block = event => { event.preventDefault(); event.stopImmediatePropagation(); };
    window.addEventListener('keydown', block, true);
    return () => window.removeEventListener('keydown', block, true);
  }, [isPending]);

  const commit = async snapshot => {
    if (inFlight.current) return false;
    inFlight.current = true;
    setIsPending(true);
    try {
      if (await write(snapshot) !== true) throw new Error('Database write did not complete');
      onCommitted(snapshot);
      return true;
    } catch (error) {
      onFailure(error);
      return false;
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  };
  return { commit, isPending };
};
