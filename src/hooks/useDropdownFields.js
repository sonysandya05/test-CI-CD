import { useState, useEffect } from 'react';
import { getDropdownFields, getFieldConfig } from '../services/dropdownApi';

/**
 * Fetches the list of filterable fields for a module.
 * Pass `module=null` to skip fetching (e.g. when drawer is closed).
 */
export function useDropdownFields(module) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!module) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getDropdownFields(module)
      .then((data) => {
        if (!cancelled) setFields(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [module]);

  return { fields, loading, error };
}

export function useFieldConfig(module) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!module) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getFieldConfig(module)
      .then((data) => {
        if (!cancelled) setConfig(Array.isArray(data) ? data : null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [module]);

  return { config, loading, error };
}

