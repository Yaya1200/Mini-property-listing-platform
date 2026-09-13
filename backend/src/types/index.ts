export enum UserRole {
  ADMIN = 'admin',
  PROPERTY_OWNER = 'property_owner',
  REGULAR_USER = 'regular_user',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  status: PropertyStatus;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
}
