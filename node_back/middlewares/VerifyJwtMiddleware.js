import jwtUtils from '../services/TokenVerificationService.js'

// Middleware для проверки JWT
function authMiddleware(req, res, next) {
  // Получение JWT из заголовка или запроса
  const token = req.headers.token || req.query.token || req.cookies.token

  try {
    // Проверка и декодирование JWT
    const decoded = jwtUtils.verifyToken(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } 
  catch (error) {
    return res.status(403).json({ message: 'Wrong token' })
  }
}

export default authMiddleware;