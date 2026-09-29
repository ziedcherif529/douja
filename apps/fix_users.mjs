import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
console.log('Connecting to PocketBase at:', PB_URL);
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const existing = await pb.collections.getFullList();
const usersColl = existing.find(c => c.name === 'users');

// Update users collection: allow public signup, but only admins can list all
const updated = await pb.collections.update(usersColl.id, {
  createRule: '',  // empty = allow anyone to create (for signup)
  listRule: '@request.auth.id != "" && @request.auth.role = "admin"',  // only admins can list
  viewRule: '@request.auth.id != ""',  // authenticated users can view
  updateRule: 'id = @request.auth.id',  // users can update themselves
  deleteRule: 'id = @request.auth.id || @request.auth.role = "admin"',  // admin can delete anyone
});
console.log('Users collection rules updated:', updated.createRule, updated.listRule);
