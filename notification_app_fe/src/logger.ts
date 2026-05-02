let _token: string | null = null;

export const setToken = (t: string) => { _token = t; };
export const getToken = () => _token;

export const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> => {
  const token = _token;
  if (!token) {
    console.log(`[LOG] ${stack}|${level}|${pkg}: ${message}`);
    return;
  }
  try {
    const res = await fetch('/eval-api/logs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message.toLowerCase(),
      }),
    });
    const data = await res.json();
    console.log('Log success:', data);
  } catch (err) {
    console.error('Log failed:', err);
  }
};
