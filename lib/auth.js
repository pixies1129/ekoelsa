import redis from './redis';

export async function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return null;

  const empId = await redis.get(`token:${token}`);
  return empId || null;
}
