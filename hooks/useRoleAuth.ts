import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

const useRoleAuthorization = (allowedRoles: string[]) => {
  const token = Cookie.get("token");
  const role = Cookie.get("role") as string;

  useEffect(() => {
    if (!token) {
      Router.push("/auth/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      Router.push("/auth/unauthorized");
    }
  }, [allowedRoles, role, token]);
};

export default useRoleAuthorization;
