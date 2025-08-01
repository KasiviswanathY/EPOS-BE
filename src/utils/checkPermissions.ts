import { User, UserPermissionType } from '@prisma/client';

export const checkPermissions = (
  user?: User,
  permission?: UserPermissionType,
) => {
  if (!user || !user.permissions || !permission) {
    return false;
  }

  return user.permissions.includes(permission);
};
