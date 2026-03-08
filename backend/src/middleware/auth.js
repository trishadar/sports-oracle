import 'dotenv/config';
import { getAuth } from '@clerk/express';

const FREE_LIMIT = 3;
const PRO_DAILY_LIMIT = 20;
const usageStore = new Map();

function getTodayKey(userId) {
  const today = new Date().toISOString().split('T')[0];
  return `${userId}:${today}`;
}

export function getUsage(userId) {
  const key = getTodayKey(userId);
  return usageStore.get(key) || 0;
}

export function incrementUsage(userId) {
  const key = getTodayKey(userId);
  const current = usageStore.get(key) || 0;
  usageStore.set(key, current + 1);
  return current + 1;
}

export async function requireAuth(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = userId;

    const used = getUsage(userId);
    const plan = 'free';
    const limit = plan === 'free' ? FREE_LIMIT : PRO_DAILY_LIMIT;

    if (used >= limit) {
      return res.status(403).json({
        error: 'limit_reached',
        plan,
        used,
        limit,
        message: plan === 'free'
          ? `You've used all ${FREE_LIMIT} free signals. Upgrade to Pro for 20/day or Unlimited for unrestricted access.`
          : `You've reached your ${PRO_DAILY_LIMIT} daily signal limit. Upgrade to Unlimited for unrestricted access.`,
      });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function usageInfo(req, res) {
  const used = getUsage(req.userId);
  res.json({ used, limit: FREE_LIMIT, plan: 'free', remaining: Math.max(0, FREE_LIMIT - used) });
}