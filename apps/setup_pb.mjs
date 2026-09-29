import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);

await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const authRule = '@request.auth.id != ""';

async function createCollection(name, type, schema, options = {}) {
  const existing = await pb.collections.getFullList();
  const found = existing.find(c => c.name === name);
  if (found) {
    console.log(`${name} already exists, updating...`);
    return await pb.collections.update(found.id, {
      name,
      type,
      schema,
      ...options
    });
  }
  return await pb.collections.create({
    name,
    type,
    schema,
    ...options
  });
}

// 1. clients
const clients = await createCollection('clients', 'base', [
  { name: 'name', type: 'text', required: true },
  { name: 'email', type: 'email', required: false },
  { name: 'phone', type: 'text', required: false },
  { name: 'address', type: 'text', required: false },
  { name: 'notes', type: 'text', required: false },
  { name: 'user', type: 'relation', required: true, maxSelect: 1, collectionId: 'users' }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('clients:', clients.id);

// 2. horses
const horses = await createCollection('horses', 'base', [
  { name: 'name', type: 'text', required: true },
  { name: 'breed', type: 'text', required: false },
  { name: 'age', type: 'number', required: false },
  { name: 'color', type: 'text', required: false },
  { name: 'notes', type: 'text', required: false },
  { name: 'client', type: 'relation', required: true, maxSelect: 1, collectionId: 'clients' }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('horses:', horses.id);

// 3. operations (catalog of operations/services)
const operations = await createCollection('operations', 'base', [
  { name: 'name', type: 'text', required: true },
  { name: 'description', type: 'text', required: false },
  { name: 'price', type: 'number', required: true },
  { name: 'category', type: 'text', required: false }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('operations:', operations.id);

// 4. medical_records
const medical_records = await createCollection('medical_records', 'base', [
  { name: 'date', type: 'date', required: true },
  { name: 'diagnosis', type: 'text', required: true },
  { name: 'treatment', type: 'text', required: false },
  { name: 'notes', type: 'text', required: false },
  { name: 'horse', type: 'relation', required: true, maxSelect: 1, collectionId: 'horses' },
  { name: 'operation', type: 'relation', required: false, maxSelect: 1, collectionId: 'operations' }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('medical_records:', medical_records.id);

// 5. invoices
const invoices = await createCollection('invoices', 'base', [
  { name: 'invoice_number', type: 'text', required: true },
  { name: 'date', type: 'date', required: true },
  { name: 'total', type: 'number', required: true },
  { name: 'status', type: 'select', required: true, values: ['pending', 'paid', 'cancelled'] },
  { name: 'notes', type: 'text', required: false },
  { name: 'client', type: 'relation', required: true, maxSelect: 1, collectionId: 'clients' }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('invoices:', invoices.id);

// 6. invoice_items
const invoice_items = await createCollection('invoice_items', 'base', [
  { name: 'description', type: 'text', required: true },
  { name: 'quantity', type: 'number', required: true },
  { name: 'unit_price', type: 'number', required: true },
  { name: 'total', type: 'number', required: true },
  { name: 'invoice', type: 'relation', required: true, maxSelect: 1, collectionId: 'invoices' },
  { name: 'operation', type: 'relation', required: false, maxSelect: 1, collectionId: 'operations' }
], {
  listRule: authRule,
  viewRule: authRule,
  createRule: authRule,
  updateRule: authRule,
  deleteRule: authRule
});
console.log('invoice_items:', invoice_items.id);

console.log('All collections created!');
