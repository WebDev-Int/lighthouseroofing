import { useState, useEffect, useCallback } from 'react';
import {
  fetchResource,
  createResource,
  updateResource,
  deleteResource,
} from '../services/adminDataService.js';

export function useAdminResource(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchResource(resource);
      setItems(data[resource] || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (formData) => {
      const result = await createResource(resource, formData);
      await load();
      return result;
    },
    [resource, load]
  );

  const update = useCallback(
    async (id, formData) => {
      const result = await updateResource(resource, id, formData);
      await load();
      return result;
    },
    [resource, load]
  );

  const remove = useCallback(
    async (id) => {
      await deleteResource(resource, id);
      await load();
    },
    [resource, load]
  );

  return { items, loading, error, refresh: load, create, update, delete: remove };
}
