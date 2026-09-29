import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');

const existing = await pb.collections.getFullList();
const usersColl = existing.find(c => c.name === 'users');
console.log('createRule:', JSON.stringify(usersColl.createRule));
console.log('listRule:', JSON.stringify(usersColl.listRule));
console.log('viewRule:', JSON.stringify(usersColl.viewRule));
console.log('updateRule:', JSON.stringify(usersColl.updateRule));
console.log('deleteRule:', JSON.stringify(usersColl.deleteRule));
