import jwt from 'jsonwebtoken'

// Функция для генерации JWT
function generateToken(payload, secretKey, expiresIn = 3600) {
  return jwt.sign(payload, secretKey, {expiresIn});
}

// Функция для проверки и декодирования JWT
function verifyToken(token, secretKey) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    // В случае недействительного токена или истечения срока действия будет выброшено исключение
    throw new Error('Invalid token');
  }
}

export default {
  generateToken,
  verifyToken
}