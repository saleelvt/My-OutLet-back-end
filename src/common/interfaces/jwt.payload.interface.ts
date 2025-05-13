export interface JwtPayload {
  sub: string; // User ID
  phone: string;
  role: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}
