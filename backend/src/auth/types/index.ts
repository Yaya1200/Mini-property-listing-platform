export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export type UserRole = 'admin' | 'property_owner' | 'regular_user';
