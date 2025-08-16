// server/middleware/auth.js
// 아주 심플한 토큰 확인 미들웨어
// - Authorization: Bearer <token>
// - 또는 x-api-key: <token>
// 둘 중 아무거나 있으면 "로그인 되었음"으로 간주

function extractToken(req) {
  const apiKey = req.headers['x-api-key'];
  const auth = req.headers.authorization || '';
  if (apiKey) return apiKey;
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // 간단하게 사용자 이름도 함께 받으면 붙여줌 (없으면 unknown)
  req.user = {
    name: req.headers['x-username'] || 'unknown',
    token,
  };
  next();
}

module.exports = { requireAuth };