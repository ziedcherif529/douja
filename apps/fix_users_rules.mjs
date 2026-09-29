import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
console.log('Connecting to PocketBase at:', PB_URL);
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const existing = await pb.collections.getFullList();
const usersColl = existing.find(c => c.name === 'users');

if (!usersColl) {
  console.error('Users collection not found!');
  process.exit(1);
}

// Simplify rules: remove @request.auth.role which may fail in PB 0.27
const updated = await pb.collections.update(usersColl.id, {
  createRule: '',
  listRule: '@request.auth.id != ""',
  viewRule: '@request.auth.id != ""',
  updateRule: 'id = @request.auth.id',
  deleteRule: 'id = @request.auth.id || @request.auth.role = "admin"',
});

console.log('Users collection rules updated:');
console.log('  createRule:', updated.createRule);
console.log('  listRule:', updated.listRule);
console.log('  viewRule:', updated.viewRule);
console.log('  updateRule:', updated.updateRule);
console.log('  deleteRule:', updated.deleteRule);
console.log('Done!');
