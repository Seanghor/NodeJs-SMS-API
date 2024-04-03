import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '@prisma/client';
import { TokenPayload } from '../interfaces';

function generateAccessToken(user: User) {
  const payload = {
    email: user.email,
    role: user.role,
    userId: user.id,
    schoolId: user.schoolId,
  } as TokenPayload;
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });
}

function generateRefreshToken(user: User, jti: string) {
  const payload = {
    email: user.email,
    role: user.role,
    userId: user.id,
    schoolId: user.schoolId,
    jti,
  } as TokenPayload;
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '12h',
  });
}

function generateTokens(user: User, jti: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

function hashToken(token: string) {
  return crypto.createHash('sha512').update(token).digest('hex');
}

export { generateTokens, hashToken, generateAccessToken, generateRefreshToken };
