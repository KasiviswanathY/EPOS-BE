import { User } from '@prisma/client';

export const checkPermissions = (user?: User, permission?: string) => {
  if (!user || !user.permissions || !permission) {
    return false;
  }

  return user.permissions.includes(permission);
};
