import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL;

if (!PB_URL) {
  console.warn(
    'VITE_POCKETBASE_URL is not set. Falling back to http://localhost:8090. ' +
    'In production (Vercel), set VITE_POCKETBASE_URL in your project environment variables.'
  );
}

const pb = new PocketBase(PB_URL || 'http://localhost:8090');

export default pb;
