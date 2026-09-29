import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const existing = await pb.collections.getFullList();
const usersColl = existing.find(c => c.name === 'users');
console.log('users schema before:', JSON.stringify((usersColl.fields || usersColl.schema).map(s => s.name + ':' + s.type)));

// Update users collection with name and role fields
const updated = await pb.collections.update(usersColl.id, {
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', values: ['admin', 'client'], required: true }
  ],
  listRule: '@request.auth.id != ""',
  viewRule: '@request.auth.id != ""',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""'
});
console.log('users schema after:', JSON.stringify((updated.fields || updated.schema).map(s => s.name + ':' + s.type)));
console.log('Users collection updated!');
