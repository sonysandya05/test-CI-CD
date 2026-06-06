import { useState, useCallback, useRef } from 'react';
import { getDropdownValues } from '../services/dropdownApi';

/**
 * Manages per-field value lists fetched from the API.
 * Debounces search calls by 300 ms to avoid hammering the server while typing.
 */
export function useDropdownValues(module) {
  const [valuesByField, setValuesByField] = useState({});
  const [loadingFields, setLoadingFields] = useState(new Set());
  const timers = useRef({});

  const setFieldLoading = (field, isLoading) => {
    setLoadingFields((prev) => {
      const next = new Set(prev);
      isLoading ? next.add(field) : next.delete(field);
      return next;
    });
  };

  const fetchValues = useCallback((field, search = '') => {
    if (!field || !module) return;

    // Clear any pending debounce for this field
    if (timers.current[field]) clearTimeout(timers.current[field]);

    const delay = search ? 300 : 0;

    timers.current[field] = setTimeout(async () => {
      setFieldLoading(field, true);
      try {
        const data = await getDropdownValues(module, field, search);
        const options = Array.isArray(data)
          ? data.map((item) => ({ label: String(item.label), value: item.value }))
          : [];
        setValuesByField((prev) => ({ ...prev, [field]: options }));
      } catch {
        // Keep previous options on error — don't blank out the dropdown
      } finally {
        setFieldLoading(field, false);
      }
    }, delay);
  }, [module]);

  return { valuesByField, loadingFields, fetchValues };
}
export default useDropdownValues;