import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
console.log('Connecting to PocketBase at:', PB_URL);
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const getAuthRule = () => '@request.auth.id != ""';
const getPublicCreateRule = () => '';

// Get existing collections
const existing = await pb.collections.getFullList();
const usersCollId = existing.find(c => c.name === 'users')?.id || '_pb_users_auth_';
console.log('Users collection ID:', usersCollId);

const appCollections = ['clients', 'horses', 'operations', 'medical_records', 'invoices', 'invoice_items'];

// Delete existing app collections
for (const c of appCollections) {
  const found = existing.find(e => e.name === c);
  if (found) {
    await pb.collections.delete(found.id);
    console.log(`Deleted ${c} (${found.id})`);
  }
}

// Wait a moment
await new Promise(r => setTimeout(r, 500));

// Create collections with correct schema matching React code

// 1. clients
let clientsId, horsesId, operationsId, medicalId, invoicesId;

const clients = await pb.collections.create({
  name: 'clients',
  type: 'base',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: false },
    { name: 'phone', type: 'text', required: false },
    { name: 'address', type: 'text', required: false },
    { name: 'city', type: 'text', required: false },
    { name: 'country', type: 'text', required: false },
    { name: 'notes', type: 'text', required: false },
    { name: 'userId', type: 'relation', required: true, maxSelect: 1, collectionId: usersCollId }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('clients created');
clientsId = clients.id;

// 2. horses
const horses = await pb.collections.create({
  name: 'horses',
  type: 'base',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'breed', type: 'text', required: false },
    { name: 'age', type: 'number', required: false },
    { name: 'color', type: 'text', required: false },
    { name: 'microchip', type: 'text', required: false },
    { name: 'notes', type: 'text', required: false },
    { name: 'clientId', type: 'relation', required: true, maxSelect: 1, collectionId: clientsId }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('horses created');
horsesId = horses.id;

// 3. operations (catalog)
const operations = await pb.collections.create({
  name: 'operations',
  type: 'base',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text', required: false },
    { name: 'price', type: 'number', required: true },
    { name: 'category', type: 'select', values: ['Diagnostics', 'Surgery', 'Vaccination', 'Emergency Care', 'Performance Monitoring', 'Rehabilitation'], required: false }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('operations created');
operationsId = operations.id;

// 4. medical_records
const medical_records = await pb.collections.create({
  name: 'medical_records',
  type: 'base',
  fields: [
    { name: 'record_date', type: 'date', required: true },
    { name: 'diagnosis', type: 'text', required: true },
    { name: 'treatment_plan', type: 'text', required: false },
    { name: 'notes', type: 'text', required: false },
    { name: 'horseId', type: 'relation', required: true, maxSelect: 1, collectionId: horsesId }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('medical_records created');
medicalId = medical_records.id;

// 5. invoices
const invoices = await pb.collections.create({
  name: 'invoices',
  type: 'base',
  fields: [
    { name: 'invoice_number', type: 'text', required: true },
    { name: 'invoice_date', type: 'date', required: true },
    { name: 'due_date', type: 'date', required: false },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'total_amount', type: 'number', required: true },
    { name: 'status', type: 'select', values: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], required: true },
    { name: 'notes', type: 'text', required: false },
    { name: 'clientId', type: 'relation', required: true, maxSelect: 1, collectionId: clientsId },
    { name: 'horseId', type: 'relation', required: false, maxSelect: 1, collectionId: horsesId }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('invoices created');
invoicesId = invoices.id;

// 6. invoice_items
const invoice_items = await pb.collections.create({
  name: 'invoice_items',
  type: 'base',
  fields: [
    { name: 'description', type: 'text', required: true },
    { name: 'quantity', type: 'number', required: true },
    { name: 'unit_price', type: 'number', required: true },
    { name: 'line_total', type: 'number', required: true },
    { name: 'invoiceId', type: 'relation', required: true, maxSelect: 1, collectionId: invoicesId },
    { name: 'operationId', type: 'relation', required: false, maxSelect: 1, collectionId: operationsId }
  ],
  listRule: getAuthRule(),
  viewRule: getAuthRule(),
  createRule: getAuthRule(),
  updateRule: getAuthRule(),
  deleteRule: getAuthRule()
});
console.log('invoice_items created');

console.log('All collections recreated with correct schema!');
