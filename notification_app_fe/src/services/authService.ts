import { setToken } from '../logger';

const CREDS = {
  email: 'pp2634@srmist.edu.in',
  name: 'pragya paramita sahoo',
  rollNo: 'ra2311003010770',
  accessCode: 'QkbpxH',
  clientID: '1a10c8d4-99a4-419f-ae44-81fa79227ba2',
  clientSecret: 'MQrqxszUcgqHMWqz',
};

export const initAuth = async (): Promise<string> => {
  console.log('Fetching fresh auth token...');
  const res = await fetch('/eval-api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDS),
  });
  if (!res.ok) throw new Error(`Auth failed: HTTP ${res.status}`);
  const data = await res.json();
  const token: string = data.access_token;
  setToken(token);
  console.log('Auth token set successfully');

  setInterval(async () => {
    try {
      const r = await fetch('/eval-api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CREDS),
      });
      if (r.ok) {
        const d = await r.json();
        setToken(d.access_token);
        console.log('Token refreshed');
      }
    } catch (e) {
      console.error('Token refresh failed:', e);
    }
  }, 12 * 60 * 1000);

  return token;
};
