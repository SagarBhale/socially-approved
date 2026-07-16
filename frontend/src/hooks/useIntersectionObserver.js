import { useEffect, useRef, useState, useCallback } from 'react';

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  freezeOnceVisible = false,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState(null);
  const frozen = useRef(false);

  const updateEntry = useCallback(([observerEntry]) => {
    if (frozen.current) return;
    setEntry(observerEntry);
    setIsVisible(observerEntry.isIntersecting);
    if (observerEntry.isIntersecting && freezeOnceVisible) {
      frozen.current = true;
    }
  }, [freezeOnceVisible]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(updateEntry, { threshold, rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, updateEntry]);

  return { ref, isVisible, entry };
}

export function useMultiIntersectionObserver({
  threshold = 0.1,
  rootMargin = '200px 0px',
} = {}) {
  const [visibilityMap, setVisibilityMap] = useState({});
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibilityMap((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const key = entry.target.dataset.observerKey;
            if (key) next[key] = entry.isIntersecting;
          });
          return next;
        });
      },
      { threshold, rootMargin }
    );

    elementsRef.current.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin]);

  const registerRef = useCallback((key) => (el) => {
    if (!el) return;
    const prev = elementsRef.current.get(key);
    if (prev === el) return;
    if (prev && observerRef.current) observerRef.current.unobserve(prev);
    el.dataset.observerKey = key;
    elementsRef.current.set(key, el);
    if (observerRef.current) observerRef.current.observe(el);
  }, []);

  return { registerRef, visibilityMap };
}
