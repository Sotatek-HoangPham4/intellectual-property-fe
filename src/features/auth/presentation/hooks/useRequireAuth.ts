"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setCredentials, logout } from "@/store/slices/authSlice";
import { useRefreshTokenMutation } from "@/features/auth/infrastructure/api/authApi";
import { hasRole, Role } from "@/core/domain/auth/roles";

export const useRequireAuth = ({
  redirectIfUnauthenticated,
  redirectIfAuthenticated,
  allowedRoles,
  redirectIfUnauthorized,
}: {
  redirectIfUnauthenticated?: string;
  redirectIfAuthenticated?: string;
  allowedRoles?: Role[];
  redirectIfUnauthorized?: string; // ví dụ "/403"
} = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(true);
  const [refreshTokenMutation] = useRefreshTokenMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = auth.accessToken; // token trong redux/persist
      const refreshToken = localStorage.getItem("refreshToken");

      const authRoutes = ["/login", "/register"];

      // 1) Chưa login mà vào private route
      if (!accessToken && !authRoutes.includes(pathname)) {
        if (refreshToken) {
          try {
            const response = await refreshTokenMutation({
              refreshToken,
            }).unwrap();

            dispatch(
              setCredentials({
                user: auth.user, // giữ user hiện tại, hoặc bạn có thể call /me lại nếu muốn chắc chắn
                accessToken: response.data.accessToken,
              })
            );

            // sau refresh, sẽ kiểm role ở bước dưới
          } catch {
            dispatch(logout());
            router.replace(redirectIfUnauthenticated || "/login");
            setLoading(false);
            return;
          }
        } else {
          router.replace(redirectIfUnauthenticated || "/login");
          setLoading(false);
          return;
        }
      }

      // 2) Đã login mà vào trang auth (login/register)
      if (
        refreshToken &&
        authRoutes.includes(pathname) &&
        redirectIfAuthenticated
      ) {
        router.replace(redirectIfAuthenticated);
        setLoading(false);
        return;
      }

      // 3) Check role (chỉ khi đang ở protected area)
      // Nếu bạn muốn chỉ check role khi route thuộc protected, thì bạn có thể thêm điều kiện !authRoutes.includes(pathname)
      if (!authRoutes.includes(pathname)) {
        const userRole = auth.user?.role; // <-- đảm bảo /me trả về có role
        const ok = hasRole(userRole, allowedRoles);

        if (!ok) {
          router.replace(redirectIfUnauthorized || "/403");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [
    pathname,
    router,
    redirectIfAuthenticated,
    redirectIfUnauthenticated,
    redirectIfUnauthorized,
    allowedRoles,
    auth.accessToken,
    auth.user,
    dispatch,
    refreshTokenMutation,
  ]);

  return { loading };
};
