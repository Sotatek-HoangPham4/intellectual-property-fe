export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const hasRole = (
  userRole: string | undefined | null,
  allowed?: Role[]
) => {
  if (!allowed || allowed.length === 0) return true; // không truyền allowedRoles => ai login cũng vào
  if (!userRole) return false;
  return allowed.includes(userRole as Role);
};
