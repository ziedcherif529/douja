import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const usePocketbase = (collection, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await pb.collection(collection).getFullList({
        ...options,
        $autoCancel: false
      });
      setData(records);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${collection}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collection]);

  const create = async (record) => {
    try {
      const newRecord = await pb.collection(collection).create(record, { $autoCancel: false });
      setData(prev => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const update = async (id, record) => {
    try {
      const updatedRecord = await pb.collection(collection).update(id, record, { $autoCancel: false });
      setData(prev => prev.map(item => item.id === id ? updatedRecord : item));
      return updatedRecord;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await pb.collection(collection).delete(id, { $autoCancel: false });
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, create, update, remove, refetch: fetchData };
};