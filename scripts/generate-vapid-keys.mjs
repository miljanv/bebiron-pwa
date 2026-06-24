import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
console.log('Add these to .env and Vercel Environment Variables:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('VAPID_SUBJECT=mailto:your@email.com');
console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
