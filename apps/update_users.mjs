import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const existing = await pb.collections.getFullList();
const usersColl = existing.find(c => c.name === 'users');

const roleField = {
  hidden: false,
  id: 'select' + Date.now(),
  maxSelect: 1,
  name: 'role',
  presentable: false,
  required: true,
  system: false,
  type: 'select',
  values: ['admin', 'client']
};

console.log('Existing schema:', usersColl.fields.map(f => f.name + ':' + f.type).join(', '));

// Check if role field already exists
if (usersColl.fields.find(f => f.name === 'role')) {
  console.log('role field already exists');
} else {
  // Add role field to schema
  const updated = await pb.collections.update(usersColl.id, {
    fields: [...usersColl.fields.map(f => {
      // Clean up the field to match PocketBase API format
      const clean = { ...f };
      delete clean.id; // remove id as it might conflict
      return clean;
    }), roleField],
    createRule: '',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
  });
  console.log('role field added. New schema:', updated.fields.map(f => f.name + ':' + f.type).join(', '));
}
console.log('Done!');
