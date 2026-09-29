import PocketBase from './node_modules/pocketbase/dist/pocketbase.es.mjs';
const PB_URL = process.env.PB_URL || 'https://bavet-pb-production.up.railway.app';
const pb = new PocketBase(PB_URL);

try {
  const admin = await pb.collection('_superusers').create({
    email: 'admin@bavet.local',
    password: 'Admin123!',
    passwordConfirm: 'Admin123!',
  });
  console.log('Superadmin created:', admin.email);
} catch (e) {
  console.error('Error:', e.message, e.data || '');
}

try {
  await pb.collection('_superusers').authWithPassword('admin@bavet.local', 'Admin123!');
  console.log('Superadmin authenticated');

  const user = await pb.collection('users').create({
    email: 'admin@bavet.local',
    password: 'Admin123!',
    passwordConfirm: 'Admin123!',
    name: 'Admin',
    role: 'admin',
    emailVisibility: true,
  });
  console.log('Admin user created:', user.email);
} catch (e) {
  console.error('Error:', e.message, JSON.stringify(e.data || {}));
}
