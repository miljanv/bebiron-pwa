export function getVapidPublicKey(): string {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
}

export function getVapidPrivateKey(): string {
  return process.env.VAPID_PRIVATE_KEY ?? '';
}

export function getVapidSubject(): string {
  return process.env.VAPID_SUBJECT ?? 'mailto:support@bebiron.app';
}

export function isVapidConfigured(): boolean {
  return Boolean(getVapidPublicKey() && getVapidPrivateKey());
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
