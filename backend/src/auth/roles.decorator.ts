// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/index.js';

export const ROLES_KEY = 'roles';
type RoleValue = UserRole | 'admin' | 'property_owner' | 'regular_user';

export const Roles = (...roles: RoleValue[]) => SetMetadata(ROLES_KEY, roles);
